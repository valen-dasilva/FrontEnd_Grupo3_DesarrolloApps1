import { apiClient } from './api'


export interface UpdateDatesRequest{
        fechaInicio: string, 
        fechaFin: string 
    }
 
export interface ItinerarioResumen {
    id: number;
  titulo: string;
  provincia: string;
  fechaInicio: string; //fecha
  fechaFin: string;
  fotoPortada: string;
  duracionDias: number;
  etiquetas: string[];

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


export interface ItinerarioUsuario {
  id: number;
  titulo: string;
  provincia: string;
  fechaInicio: string; //fecha
  fechaFin: string;
  fotoPortada: string;
  duracionDias: number;
  etiquetas: string[];
  items: ItemItinerarioUsuario[];
}

const FAVS_PATH = '/favoritos';

//guardar en favoritos un itinerario
export const postItinerario = async (idItinerario: number): Promise<ItinerarioResumen> => {
    const response = await apiClient.post<ItinerarioResumen>(`${FAVS_PATH}/${idItinerario}`);
    return response.data;
} 

//obtener todos los itinerarios de favoritos
export const getItinerarios = async (): Promise<ItinerarioResumen[]> => {
    const response = await apiClient.get<ItinerarioResumen[]>(`${FAVS_PATH}`);
    return response.data;
}

//devuelve el itinerario activo o proximo a iniciar
export const getActiveItinerario = async (): Promise<ItinerarioUsuario> => {
    const response = await apiClient.get<ItinerarioUsuario>(`${FAVS_PATH}/activo`);
    return response.data;
}

//devuelve detalles de un itinerario en favoritos
export const getItinerarioDetalles = async (id: number): Promise<ItinerarioUsuario> => {
    const response = await apiClient.get<ItinerarioUsuario>(`${FAVS_PATH}/${id}`);
    return response.data;
}

//actualizar fechas de un itinerario en favoritos
export const putItinerarioFechas = async (
    id: number, 
    dates: UpdateDatesRequest
    ): Promise<ItinerarioUsuario> => {
    const response = await apiClient.put<ItinerarioUsuario>(`${FAVS_PATH}/${id}`, dates);
    return response.data;
}

//quitar un itinerario de favoritos
export const deleteItinerario = async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`${FAVS_PATH}/${id}`);
    return response.data;
}

//------endpoints a items

//crear un item itinerario
export const postItem = async (
    idItinerario: number, 
    itemData: Omit<ItemItinerarioUsuario, 'id'> ): Promise<ItemItinerarioUsuario> => {
    const response = await apiClient.post<ItemItinerarioUsuario>(`${FAVS_PATH}/${idItinerario}/items`, itemData);
    return response.data;
}

//actualizar item de itinerario
export const putItem = async (
    idItinerario: number, 
    idItem: number, 
    itemData: Omit<ItemItinerarioUsuario, 'id'>): Promise<ItemItinerarioUsuario> => {
    const response = await apiClient.put<ItemItinerarioUsuario>(`${FAVS_PATH}/${idItinerario}/items/${idItem}`, itemData);
    return response.data;
}

//eliminat una actividad del itinerario
export const deleteItem = async (
    idItinerario: number,
    idItem: number,
): Promise<void> => {
    await apiClient.delete<void>(`${FAVS_PATH}/${idItinerario}/items/${idItem}`);
}
