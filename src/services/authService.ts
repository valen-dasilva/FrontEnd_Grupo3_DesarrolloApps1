import { apiClient } from "./api";

// Forma de la respuesta del backend al loguear, registrarse o refrescar: el par
// de tokens (access corto + refresh largo) más los datos básicos del usuario.
// AuthContext la usa para armar el AuthUser y persistir la sesión.
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idUsuario: number;
  nombre: string;
  email: string;
  fotoPerfil?: string;
}

// Datos que el usuario completa en la pantalla de login.
export interface LoginPayload {
  email: string;
  contrasenia: string;
}

// Datos que el usuario completa en el registro (login + nombre y apellido).
export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
}

// Capa de servicio: solo conoce las URLs del backend y la forma de los datos.
// No maneja estado ni errores (de eso se encargan el interceptor de api.ts y
// AuthContext). Devolvemos r.data para que quien llame reciba directo el
// AuthResponse y no todo el objeto de respuesta de axios.
export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient
    .post<AuthResponse>("/auth/login", payload)
    .then((r) => r.data);
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiClient
    .post<AuthResponse>("/auth/register", payload)
    .then((r) => r.data);
}

// Revoca el refresh token en el backend (logout real del lado servidor). El
// endpoint es público, así que funciona aunque el access token ya haya vencido.
// Se llama "best effort": si falla, igual limpiamos la sesión local.
export function logout(refreshToken: string): Promise<void> {
  return apiClient
    .post("/auth/logout", { refreshToken })
    .then(() => undefined);
}
