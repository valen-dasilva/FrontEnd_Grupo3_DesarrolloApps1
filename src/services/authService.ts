import { apiClient } from "./api";

// Forma de la respuesta del backend al loguear o registrarse: el token JWT más
// los datos básicos del usuario. AuthContext la usa para armar el AuthUser.
export interface AuthResponse {
  token: string;
  idUsuario: number;
  nombre: string;
  email: string;
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
