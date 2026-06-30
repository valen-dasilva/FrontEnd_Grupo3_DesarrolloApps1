import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react"; 
import {
  isTokenExpired,
  setAuthToken,
  setRefreshToken,
  setUnauthorizedHandler,
  setTokensRefreshedHandler,
  refreshTokens,
} from '@/services/api';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/services/authService';
import * as authService from '@/services/authService';
import * as storage from '@/services/storage';
import { getUserProfile } from '@/services/userService';

// Forma del usuario que exponemos al resto de la app. Es un subconjunto de
// AuthResponse: solo los datos que las pantallas necesitan mostrar (sin el token).
export interface AuthUser {
  idUsuario: number;
  nombre: string;
  email: string;
  fotoPerfil?: string;
}

// Contrato del contexto: todo lo que cualquier componente puede leer o pedirle
// al sistema de autenticación. Es la "API pública" del AuthProvider.
interface AuthContextValue {
  user: AuthUser | null; // datos del usuario logueado, o null si no hay sesión
  token: string | null; // JWT actual; sirve para saber si hay sesión activa
  isLoading: boolean; // true mientras restauramos la sesión guardada al arrancar
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<AuthUser>) => Promise<void>;
}

// createContext arranca en undefined a propósito: si algún componente usa el
// contexto sin estar envuelto por AuthProvider, useAuth() lo detecta y tira error.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Convierte la respuesta del backend (que incluye el token) en el AuthUser
// "limpio" que guardamos en estado. Descarta el token y cualquier campo extra.
const toUser = ({ idUsuario, nombre, email, fotoPerfil }: AuthResponse): AuthUser => ({
  idUsuario,
  nombre,
  email,
  fotoPerfil,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado global de la sesión. Vive acá una sola vez y se comparte vía contexto.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al arrancar la app intentamos restaurar la sesión guardada en el dispositivo.
  // Mantenemos el splash visible un mínimo de tiempo aunque la lectura termine
  // antes, para que el logo no "parpadee" (decisión de branding).
  useEffect(() => {
    const MIN_SPLASH_MS = 2000;
    const minDelay = new Promise((resolve) =>
      setTimeout(resolve, MIN_SPLASH_MS),
    );

    // Refresca los datos del perfil desde el backend (foto, etc.) sin bloquear:
    // si falla, nos quedamos con lo que había guardado en el dispositivo.
    const hydrateProfile = (current: AuthUser | null) => {
      if (!current?.idUsuario) return;
      getUserProfile(current.idUsuario)
        .then((profile) => {
          const freshUser: AuthUser = {
            idUsuario: profile.idUsuario,
            nombre: profile.nombre,
            email: profile.email,
            fotoPerfil: profile.fotoPerfil,
          };
          setUser(freshUser);
          storage.saveUser(freshUser).catch(console.error);
        })
        .catch(console.error);
    };

    (async () => {
      try {
        // Leemos los dos tokens y el usuario en paralelo (lecturas independientes).
        const [storedToken, storedRefreshToken, storedUser] = await Promise.all([
          storage.getToken(),
          storage.getRefreshToken(),
          storage.getUser<AuthUser>(),
        ]);

        // Encendemos el refresh token en el módulo api apenas lo tenemos, así
        // queda disponible para renovar (ahora o ante el primer 401 en uso).
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);

        if (storedToken && !isTokenExpired(storedToken)) {
          // Access token todavía válido: restauramos la sesión directo.
          setAuthToken(storedToken);
          setToken(storedToken);
          setUser(storedUser);
          hydrateProfile(storedUser);
        } else if (storedRefreshToken) {
          // Access vencido (lo habitual con 15 min) pero hay refresh: renovamos
          // en silencio en vez de expulsar al usuario al login.
          try {
            const res = await refreshTokens();
            setToken(res.accessToken);
            const restoredUser = storedUser ?? toUser(res);
            setUser(restoredUser);
            await Promise.all([
              storage.saveToken(res.accessToken),
              storage.saveRefreshToken(res.refreshToken),
              storage.saveUser(restoredUser),
            ]);
            hydrateProfile(restoredUser);
          } catch {
            // El refresh también venció o fue revocado: limpiamos y vamos a login.
            await storage.clearSession();
          }
        } else if (storedToken) {
          // Había access vencido y ningún refresh: limpiamos para no dejar basura.
          await storage.clearSession();
        }
      } finally {
        // Pase lo que pase (haya o no sesión), esperamos el mínimo de splash y
        // recién ahí dejamos de cargar para que el router decida a dónde ir.
        await minDelay;
        setIsLoading(false);
      }
    })();
  }, []);

  // Guarda una sesión nueva en las 3 capas: el módulo api (para el interceptor),
  // el estado de React (para la UI y el routing) y AsyncStorage (para persistir).
  // useCallback evita recrear la función en cada render: login y register
  // dependen de ella, así que si cambiara se recrearían también.
  const persistSession = useCallback(async (res: AuthResponse) => {
    const nextUser = toUser(res);
    setAuthToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    setToken(res.accessToken);
    setUser(nextUser);
    await Promise.all([
      storage.saveToken(res.accessToken),
      storage.saveRefreshToken(res.refreshToken),
      storage.saveUser(nextUser),
    ]);
  }, []);

  // Cuando el interceptor de api renueva los tokens por su cuenta (access vencido
  // a mitad de uso), nos avisa por acá para reflejar el access token nuevo en el
  // estado de React y guardar el par rotado en el dispositivo.
  const handleTokensRefreshed = useCallback((res: AuthResponse) => {
    setToken(res.accessToken);
    Promise.all([
      storage.saveToken(res.accessToken),
      storage.saveRefreshToken(res.refreshToken),
    ]).catch(console.error);
  }, []);

  // login y register son envoltorios finos sobre authService: llaman al backend
  // y, si sale bien, persisten la sesión. Lo que agregan respecto de authService
  // es actualizar el estado global y guardar en el dispositivo.
  const login = useCallback(
    async (payload: LoginPayload) => {
      const res = await authService.login(payload);
      await persistSession(res);
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const res = await authService.register(payload);
      await persistSession(res);
    },
    [persistSession],
  );

  // logout limpia las 3 capas. Lo usa tanto el botón "Cerrar sesión" como el
  // interceptor de api cuando el backend responde 401/403 (token inválido).
  const logout = useCallback(async () => {
    // Leemos el refresh token ANTES de limpiar para poder revocarlo en el server.
    const currentRefresh = await storage.getRefreshToken();
    setAuthToken(null);
    setRefreshToken(null);
    setToken(null);
    setUser(null);
    await storage.clearSession();
    // Revocación best-effort: si falla (sin red, o token ya inválido) no importa,
    // la sesión local ya quedó limpia.
    if (currentRefresh) {
      authService.logout(currentRefresh).catch(() => {});
    }
  }, []);

  // updateUser actualiza el usuario en estado y en AsyncStorage sin cerrar sesión
  const updateUser = useCallback(
    async (updatedFields: Partial<AuthUser>) => {
      setUser((current) => {
        if (!current) return null;
        const nextUser = { ...current, ...updatedFields };
        storage.saveUser(nextUser).catch(console.error);
        return nextUser;
      });
    },
    [],
  );

  // Le inyectamos logout al módulo api para romper la dependencia circular:
  // api.ts no puede importar este contexto, así que recibe la función por acá.
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // Le pasamos a api el handler que persiste los tokens cuando los renueva solo.
  useEffect(() => {
    setTokensRefreshedHandler(handleTokensRefreshed);
    return () => setTokensRefreshedHandler(null);
  }, [handleTokensRefreshed]);

  const contextValue = useMemo(
    () => ({ user, token, isLoading, login, register, logout, updateUser }),
    [user, token, isLoading, login, register, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de acceso al contexto. Centraliza el chequeo de "¿estoy dentro del
// Provider?" para que las pantallas usen useAuth() sin preocuparse por eso.
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}
