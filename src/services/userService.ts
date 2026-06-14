import { apiClient } from "./api";

export interface UserProfile {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfil?: string;
}

export interface UpdatePerfilRequest {
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfil?: string;
}

/**
 * Uploads a profile picture to the public 'fotos-usuarios' Supabase bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProfilePicture(userId: number, uri: string): Promise<string> {
  const supabaseUrl = "https://qwkqhlpwwpjjqcbztbcl.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3FobHB3d3BqanFjYnp0YmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzAzMTgsImV4cCI6MjA4OTUwNjMxOH0.PVQjAPvwRvEVolQhQnG1hSmKdeywTzgYnvw6Bd-eScg";
  
  const filename = `avatar_${userId}_${Date.now()}.jpg`;

  // Fetch local file URI and get it as Blob
  const localResponse = await fetch(uri);
  const blob = await localResponse.blob();

  const response = await fetch(`${supabaseUrl}/storage/v1/object/fotos-usuarios/${filename}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${supabaseKey}`,
      "apikey": supabaseKey,
      "Content-Type": blob.type || "image/jpeg",
    },
    body: blob,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload to Supabase Storage: ${errorText}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/fotos-usuarios/${filename}`;
}

export function getUserProfile(idUsuario: number): Promise<UserProfile> {
  return apiClient.get<UserProfile>(`/users/${idUsuario}`).then((r) => r.data);
}

export function updateUserProfile(idUsuario: number, payload: UpdatePerfilRequest): Promise<UserProfile> {
  return apiClient.put<UserProfile>(`/users/${idUsuario}`, payload).then((r) => r.data);
}

export interface ChangePasswordRequest {
  contraseniaActual: string;
  contraseniaNueva: string;
}

export function changePassword(
  idUsuario: number,
  payload: ChangePasswordRequest
): Promise<void> {
  return apiClient
    .put(`/users/${idUsuario}/password`, payload)
    .then(() => undefined);
}