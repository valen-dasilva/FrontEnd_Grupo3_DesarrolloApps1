import { apiClient } from './api'
import { ItinerarioSistemaResumenDTO } from '@/types/itinerario'

/**
 * Servicio de FAVORITOS = bookmarks de itinerarios del sistema.
 * Guardar un favorito NO crea una copia: solo marca el template.
 * La copia editable se crea con el servicio de itinerarios
 * (crearItinerarioDesdeFavorito).
 */
const FAVS_PATH = '/favoritos';

// Listar mis favoritos: devuelve los templates del sistema guardados.
export const getFavoritos = async (): Promise<ItinerarioSistemaResumenDTO[]> => {
  const response = await apiClient.get<ItinerarioSistemaResumenDTO[]>(`${FAVS_PATH}`);
  return response.data;
}

// Guardar un itinerario del sistema como favorito (idempotente).
export const guardarFavorito = async (idSistema: number): Promise<void> => {
  await apiClient.post<void>(`${FAVS_PATH}/${idSistema}`);
}

// Quitar un itinerario del sistema de favoritos.
export const quitarFavorito = async (idSistema: number): Promise<void> => {
  await apiClient.delete<void>(`${FAVS_PATH}/${idSistema}`);
}

// ¿El usuario ya tiene guardado este template? (para el toggle del corazón).
export const existeFavorito = async (idSistema: number): Promise<boolean> => {
  const response = await apiClient.get<boolean>(`${FAVS_PATH}/${idSistema}/existe`);
  return response.data;
}
