import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";


// El backend corre en el puerto 8080, pero "localhost" significa cosas distintas
// según dónde se ejecute la app. Esta función resuelve el host correcto:
// - en web, localhost apunta bien a la PC
// - en un dispositivo/emulador real necesitamos la IP de la máquina que sirve
//   Expo (la tomamos de expoConfig.hostUri)
// - el emulador de Android usa 10.0.2.2 como alias del localhost de la PC
const getHost = (): string => {
  if (Platform.OS === "web") return "localhost";
  const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
  if (expoHost) return expoHost;
  return Platform.OS === "android" ? "10.0.2.2" : "localhost";
};

const BASE_URL = `https://turistear-back.onrender.com`;

// Guardamos el token y el handler de "no autorizado" como variables de módulo
// (no como estado de React) porque el interceptor de abajo no es un componente:
// necesita leerlos en cada request sin re-renderizar nada.
let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

// AuthContext nos "enciende" o "apaga" el token con esto en cada login/logout.
export function setAuthToken(token: string | null): void {
  authToken = token;
}

// AuthContext nos inyecta su función logout acá. Es la solución a la dependencia
// circular: api.ts no puede importar AuthContext, así que recibe la función.
export function setUnauthorizedHandler(fn: () => void): void {
  unauthorizedHandler = fn;
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
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de request: antes de cada llamada, si hay token lo agrega como
// header Authorization. Así ninguna pantalla tiene que acordarse de mandarlo.
apiClient.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// Interceptor de response: centraliza el manejo de errores de toda la app.
// - Si el backend responde 401/403 (token vencido o inválido), dispara el
//   handler registrado, que cierra la sesión y manda al login.
// - Siempre transforma el error de axios en un ApiError con status + mensaje,
//   usando el mensaje del backend si existe, o un fallback si no.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status: number = error.response?.status ?? 0;
    if ((status === 401 || status === 403) && unauthorizedHandler) {
      unauthorizedHandler();
    }
    const data = error.response?.data;
    let message: string =
      data?.message || data?.error || error.message || `HTTP ${status}`;

    // Si es un error de red o timeout, mostramos un mensaje amigable en español
    if (
      message === "Network Error" ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      message.toLowerCase().includes("timeout")
    ) {
      message = "No hay conexión con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.";
    }

    throw new ApiError(status, message);
  },
);
