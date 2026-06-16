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
  setUnauthorizedHandler,
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
    (async () => {
      try {
        // Leemos token y usuario en paralelo (Promise.all) porque son lecturas
        // independientes: no hay razón para esperar una y después la otra.
        const [storedToken, storedUser] = await Promise.all([
          storage.getToken(),
          storage.getUser<AuthUser>(),
        ]);
        if (storedToken && !isTokenExpired(storedToken)) {
          // Token válido: lo "encendemos" en api (interceptor) y en el estado.
          setAuthToken(storedToken);
          setToken(storedToken);
          setUser(storedUser);

          // Hidratamos el perfil desde el backend para asegurar que campos como
          // fotoPerfil estén actualizados (AsyncStorage puede tener datos viejos
          // de una versión anterior que no los incluía).
          if (storedUser?.idUsuario) {
            getUserProfile(storedUser.idUsuario)
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
              .catch(console.error); // Si falla, usamos los datos del storage
          }
        } else if (storedToken) {
          // Había token pero está vencido: limpiamos para no dejar basura.
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
    setAuthToken(res.token);
    setToken(res.token);
    setUser(nextUser);
    await Promise.all([
      storage.saveToken(res.token),
      storage.saveUser(nextUser),
    ]);
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
    setAuthToken(null);
    setToken(null);
    setUser(null);
    await storage.clearSession();
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
