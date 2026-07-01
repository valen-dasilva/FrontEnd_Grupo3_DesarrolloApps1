import axios from "axios";
import { Platform } from "react-native";
import Constants from 'expo-constants'
// Solo el TIPO de AuthResponse (no su código): con `import type` esta dependencia
// se borra al compilar, así que NO crea un ciclo en runtime con authService.
import type { AuthResponse } from "./authService";

const getHost = (): string => {
  if (Platform.OS === "web") return "localhost";
  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
  if (expoHost) return expoHost;
  return Platform.OS === "android" ? "10.0.2.2" : "localhost";
};

const BASE_URL = `http://${getHost()}:8080`; // Cambia esto por la URL real de tu backend

// Guardamos el token y el handler de "no autorizado" como variables de módulo
// (no como estado de React) porque el interceptor de abajo no es un componente:
// necesita leerlos en cada request sin re-renderizar nada.
let authToken: string | null = null;
let refreshTokenValue: string | null = null;
let unauthorizedHandler: (() => void) | null = null;
let onTokensRefreshed: ((res: AuthResponse) => void) | null = null;

// AuthContext nos "enciende" o "apaga" el access token con esto en cada login/logout.
export function setAuthToken(token: string | null): void {
  authToken = token;
}

// Idem para el refresh token: el interceptor lo necesita para pedir uno nuevo
// cuando el access token vence.
export function setRefreshToken(token: string | null): void {
  refreshTokenValue = token;
}

// AuthContext nos inyecta su función logout acá. Es la solución a la dependencia
// circular: api.ts no puede importar AuthContext, así que recibe la función.
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn;
}

// AuthContext registra acá un handler que persiste los tokens nuevos (estado de
// React + AsyncStorage) cada vez que el interceptor los renueva por su cuenta.
export function setTokensRefreshedHandler(fn: ((res: AuthResponse) => void) | null): void {
  onTokensRefreshed = fn;
}

// Decodifica el JWT (sin verificar la firma, eso lo hace el backend) solo para
// leer el campo "exp" y saber si ya venció. El token es header.payload.firma en
// base64url: tomamos el payload [1], lo pasamos a base64 normal y lo parseamos.
// exp viene en segundos, por eso lo multiplicamos por 1000 para comparar con
// Date.now(). Cualquier token mal formado se considera vencido (catch => true).
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Error propio que agrega el status HTTP al Error normal. Así las pantallas
// pueden hacer `if (e instanceof ApiError && e.status === 404)` en vez de
// adivinar qué pasó a partir del texto del mensaje.
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Instancia única de axios que usa toda la app. Centraliza baseURL y headers
// para no repetirlos en cada llamada.
// eslint-disable-next-line import/no-named-as-default-member
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 segundos de timeout para todas las llamadas
});

// Interceptor de request: antes de cada llamada, si hay token lo agrega como
// header Authorization. Así ninguna pantalla tiene que acordarse de mandarlo.
apiClient.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// Pide al backend un par de tokens nuevo usando el refresh token actual. Usa
// axios "crudo" (no apiClient) a propósito: así esta llamada NO pasa por el
// interceptor de abajo y no puede entrar en un loop de refresh.
// Single-flight: si varias requests fallan con 401 a la vez, comparten una sola
// promesa de refresh (refreshPromise) en vez de disparar N renovaciones.
let refreshPromise: Promise<AuthResponse> | null = null;

export function refreshTokens(): Promise<AuthResponse> {
  if (refreshPromise) return refreshPromise;
  if (!refreshTokenValue) {
    return Promise.reject(new Error("No hay refresh token disponible"));
  }

  refreshPromise = axios
    .post<AuthResponse>(
      `${BASE_URL}/auth/refresh`,
      { refreshToken: refreshTokenValue },
      { headers: { "Content-Type": "application/json" }, timeout: 30000 },
    )
    .then((r) => {
      const res = r.data;
      // Activamos los tokens nuevos en el módulo (para las próximas requests) y
      // avisamos a AuthContext para que los persista en estado + AsyncStorage.
      setAuthToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      if (onTokensRefreshed) onTokensRefreshed(res);
      return res;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// Interceptor de response: centraliza el manejo de errores de toda la app.
// - Si el backend responde 401/403 porque el access token venció y tenemos un
//   refresh token, lo renueva en silencio y reintenta la request original UNA vez.
// - Si no hay refresh, el refresh falla, o ya era un reintento, cierra la sesión.
// - Siempre transforma el error de axios en un ApiError con status + mensaje.
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status: number = error.response?.status ?? 0;
    const original = error.config;

    if (
      (status === 401 || status === 403) &&
      refreshTokenValue &&
      original &&
      !original._retry
    ) {
      original._retry = true;
      try {
        const refreshed = await refreshTokens();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return apiClient(original); // reintentamos la request original con el token nuevo
      } catch {
        if (unauthorizedHandler) unauthorizedHandler(); // el refresh falló: a login
      }
    } else if ((status === 401 || status === 403) && unauthorizedHandler) {
      unauthorizedHandler();
    }

    const data = error.response?.data;
    let message: string =
      data?.message || `HTTP ${status}`;

    // Si es un error de red o timeout, mostramos un mensaje amigable en español
    if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
      message = "No hay conexión con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.";
    }

    throw new ApiError(status, message);
  },
);
