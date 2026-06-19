import { apiClient } from './api'

export interface UpdateDatesRequest {
  fechaInicio: string,
  fechaFin: string
}

/**
 * Payload para crear un itinerario propio desde cero.
 * La duración la calcula el backend a partir del rango de fechas.
 */
export interface CrearItinerarioRequest {
  titulo: string;
  descripcion?: string;
  provincia: string;
  fechaInicio: string;
  fechaFin: string;
  fotoPortada?: string;
  etiquetas?: string[];
}

/** Resumen de un itinerario propio del usuario (sin items). */
export interface ItinerarioResumen {
  id: number; // mapped to idItinerarioUsuario
  idItinerarioUsuario: number;
  titulo: string;
  descripcion?: string;
  provincia: string;
  fechaInicio: string;
  fechaFin: string;
  fotoPortada: string;
  duracionDias: number;
  etiquetas: string[];
  esPinned: boolean; // true si es el itinerario fijado como activo (tachuela)
  completado: boolean;
}

export interface ItemItinerarioUsuario {
  id: number;
  nombreActividad: string;
  descripcion: string;
  localidad: string;
  direccion: string;
  dia: number;
  hora: string;
}

/** Detalle completo de un itinerario propio (con items). */
export interface ItinerarioUsuario {
  id: number;
  titulo: string;
  descripcion?: string;
  provincia: string;
  fechaInicio: string;
  fechaFin: string;
  fotoPortada: string;
  duracionDias: number;
  etiquetas: string[];
  items: ItemItinerarioUsuario[];
  esPinned: boolean;
  completado: boolean;
}

const ITIN_PATH = '/itinerarios';

const mapResumen = (data: any): ItinerarioResumen => ({
  id: data.idItinerarioUsuario,
  idItinerarioUsuario: data.idItinerarioUsuario,
  titulo: data.titulo,
  descripcion: data.descripcion,
  provincia: data.provincia,
  fechaInicio: data.fechaInicio,
  fechaFin: data.fechaFin,
  fotoPortada: data.fotoPortada,
  duracionDias: data.duracionDias,
  etiquetas: data.etiquetas ?? [],
  esPinned: data.esPinned ?? false,
  completado: data.completado ?? false,
});

// Crear una copia independiente a partir de un template guardado en favoritos.
// Cada llamada genera una copia nueva (sin límite).
export const crearItinerarioDesdeFavorito = async (idSistema: number): Promise<ItinerarioUsuario> => {
  const response = await apiClient.post<ItinerarioUsuario>(`${ITIN_PATH}/desde-favorito/${idSistema}`);
  return response.data;
}

// Crear un itinerario propio desde cero.
export const crearItinerarioDesdeCero = async (payload: CrearItinerarioRequest): Promise<ItinerarioUsuario> => {
  const response = await apiClient.post<ItinerarioUsuario>(`${ITIN_PATH}`, payload);
  return response.data;
}

// Listar mis itinerarios.
export const getItinerarios = async (): Promise<ItinerarioResumen[]> => {
  const response = await apiClient.get<any[]>(`${ITIN_PATH}`);
  return response.data.map(mapResumen);
}

// Itinerario activo o próximo a iniciar.
export const getActiveItinerario = async (): Promise<ItinerarioUsuario> => {
  const response = await apiClient.get<ItinerarioUsuario>(`${ITIN_PATH}/activo`);
  return response.data;
}

// Detalle de un itinerario propio.
export const getItinerarioDetalles = async (id: number): Promise<ItinerarioUsuario> => {
  const response = await apiClient.get<ItinerarioUsuario>(`${ITIN_PATH}/${id}`);
  return response.data;
}

// Actualizar fechas.
export const putItinerarioFechas = async (
  id: number,
  dates: UpdateDatesRequest
): Promise<ItinerarioUsuario> => {
  const response = await apiClient.put<ItinerarioUsuario>(`${ITIN_PATH}/${id}`, dates);
  return response.data;
}

// Actualizar título (el backend solo persiste fechas; el front mantiene
// override local del título — se conserva el comportamiento previo).
export const putItinerarioTitulo = async (
  id: number,
  titulo: string
): Promise<ItinerarioUsuario> => {
  const response = await apiClient.put<ItinerarioUsuario>(`${ITIN_PATH}/${id}`, { titulo });
  return response.data;
}

// Eliminar un itinerario propio.
export const deleteItinerario = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`${ITIN_PATH}/${id}`);
}

// Fijar/desfijar como activo del Home (tachuela).
export const patchPin = async (id: number): Promise<void> => {
  await apiClient.patch<void>(`${ITIN_PATH}/${id}/pin`);
}

// Marcar como completado (viaje realizado).
export const completarItinerario = async (id: number): Promise<void> => {
  await apiClient.patch<void>(`${ITIN_PATH}/${id}/completar`);
}

//------ endpoints de items

export const postItem = async (
  idItinerario: number,
  itemData: Omit<ItemItinerarioUsuario, 'id'>): Promise<ItemItinerarioUsuario> => {
  const response = await apiClient.post<ItemItinerarioUsuario>(`${ITIN_PATH}/${idItinerario}/items`, itemData);
  return response.data;
}

export const putItem = async (
  idItinerario: number,
  idItem: number,
  itemData: Omit<ItemItinerarioUsuario, 'id'>): Promise<ItemItinerarioUsuario> => {
  const response = await apiClient.put<ItemItinerarioUsuario>(`${ITIN_PATH}/${idItinerario}/items/${idItem}`, itemData);
  return response.data;
}

export const deleteItem = async (
  idItinerario: number,
  idItem: number,
): Promise<void> => {
  await apiClient.delete<void>(`${ITIN_PATH}/${idItinerario}/items/${idItem}`);
}
