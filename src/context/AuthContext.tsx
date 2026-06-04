import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { setAuthToken, setUnauthorizedHandler, isTokenExpired } from "../services/api";
import * as authService from "../services/authService";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../services/authService";
import * as storage from "../services/storage";

export interface AuthUser {
  idUsuario: number;
  nombre: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => Promise<void>;  // 👈 nuevo
}



const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toUser = ({ idUsuario, nombre, email }: AuthResponse): AuthUser => ({
  idUsuario,
  nombre,
  email,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura la sesión guardada al arrancar la app. Mantenemos el splash
  // visible un mínimo de tiempo aunque la lectura termine antes (branding).
  useEffect(() => {
    const MIN_SPLASH_MS = 2000;
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS));
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          storage.getToken(),
          storage.getUser<AuthUser>(),
        ]);
        if (storedToken && !isTokenExpired(storedToken)) {
          setAuthToken(storedToken);
          setToken(storedToken);
          setUser(storedUser);
        } else if (storedToken) {
          await storage.clearSession();
        }
      } finally {
        await minDelay;
        setIsLoading(false);
      }
    })();
  }, []);

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

  const logout = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    await storage.clearSession();
  }, []);

  const updateUser = useCallback(async (partial: Partial<AuthUser>) => {
  setUser((prev) => {
    if (!prev) return prev;
    const next = { ...prev, ...partial };
    // Persistir asíncronamente sin bloquear el render
    storage.saveUser(next).catch(() => {});
    return next;
  });
}, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}
