import { apiClient } from './api';
import { GroupItinerary, GroupItineraryItem, GroupItineraryItemRequest } from '@/types/itinerarioGrupo';

const GROUPS_PATH = '/grupos';

export interface UpdateGroupItineraryDateRequest {
  fechaInicio: string;
}

/** Cambia la fecha de inicio del itinerario de grupo (solo creador). */
export const patchFechaInicio = async (
  idGrupo: number,
  request: UpdateGroupItineraryDateRequest,
): Promise<GroupItinerary> => {
  const response = await apiClient.patch<GroupItinerary>(
    `${GROUPS_PATH}/${idGrupo}/itinerario/fecha-inicio`,
    request,
  );
  return response.data;
};

/** Elimina un día completo del itinerario (solo creador). */
export const deleteDay = async (idGrupo: number, dia: number): Promise<GroupItinerary> => {
  const response = await apiClient.delete<GroupItinerary>(
    `${GROUPS_PATH}/${idGrupo}/itinerario/dias/${dia}`,
  );
  return response.data;
};

/** Itinerario compartido del grupo (el del último ganador de una encuesta). */
export const getGroupItinerary = async (idGrupo: number): Promise<GroupItinerary> => {
  const response = await apiClient.get<GroupItinerary>(`${GROUPS_PATH}/${idGrupo}/itinerario`);
  return response.data;
};

/** Proponer una actividad (queda CONFIRMADO si la agrega el líder, PROPUESTO si no). */
export const proposeItem = async (
  idGrupo: number,
  request: GroupItineraryItemRequest,
): Promise<GroupItineraryItem> => {
  const response = await apiClient.post<GroupItineraryItem>(
    `${GROUPS_PATH}/${idGrupo}/itinerario/items`,
    request,
  );
  return response.data;
};

/** Editar una actividad (líder si está confirmada; el proponente si sigue propuesta). */
export const updateItem = async (
  idGrupo: number,
  idItem: number,
  request: GroupItineraryItemRequest,
): Promise<GroupItineraryItem> => {
  const response = await apiClient.put<GroupItineraryItem>(
    `${GROUPS_PATH}/${idGrupo}/itinerario/items/${idItem}`,
    request,
  );
  return response.data;
};

/** Confirmar una actividad propuesta (solo el líder). */
export const confirmItem = async (idGrupo: number, idItem: number): Promise<GroupItineraryItem> => {
  const response = await apiClient.patch<GroupItineraryItem>(
    `${GROUPS_PATH}/${idGrupo}/itinerario/items/${idItem}/confirmar`,
  );
  return response.data;
};

/** Eliminar/rechazar una actividad. */
export const deleteItem = async (idGrupo: number, idItem: number): Promise<void> => {
  await apiClient.delete(`${GROUPS_PATH}/${idGrupo}/itinerario/items/${idItem}`);
};

/** Marcar si voy / no voy a una actividad confirmada. */
export const toggleAttendance = async (
  idGrupo: number,
  idItem: number,
  asiste: boolean,
): Promise<GroupItineraryItem> => {
  const response = await apiClient.post<GroupItineraryItem>(
    `${GROUPS_PATH}/${idGrupo}/itinerario/items/${idItem}/asistencia`,
    { asiste },
  );
  return response.data;
};
