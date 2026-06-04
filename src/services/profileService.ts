import { apiClient } from "./api";

export interface ProfileResponse {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  tema?: string | null;
  fotoPerfil?: string | null;
}

export interface UpdateProfilePayload {
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfil?: string | null;
}

export interface ChangePasswordPayload {
  contraseniaActual: string;
  contraseniaNueva: string;
}

export async function getProfile(idUsuario: number): Promise<ProfileResponse> {
  const res = await apiClient.get<ProfileResponse>(`/users/${idUsuario}`);
  return res.data;
}

export async function updateProfile(
  idUsuario: number,
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  const res = await apiClient.put<ProfileResponse>(`/users/${idUsuario}`, payload);
  return res.data;
}

export async function changePassword(
  idUsuario: number,
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiClient.put(`/users/${idUsuario}/password`, payload);
}