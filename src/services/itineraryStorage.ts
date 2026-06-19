import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItinerarioResumen, ItinerarioUsuario } from "./itinerariosService";

const OFFLINE_LIST_KEY = "@turistear/offline_itineraries_list";
const OFFLINE_DETAIL_PREFIX = "@turistear/offline_itinerary_detail_";

/**
 * Obtiene la lista de resúmenes de itinerarios guardados localmente para ver offline.
 */
export async function getOfflineItinerariesList(): Promise<ItinerarioResumen[]> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_LIST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ItinerarioResumen[];
  } catch (error) {
    console.error("Error al obtener la lista de itinerarios offline:", error);
    return [];
  }
}

/**
 * Obtiene los IDs de todos los itinerarios descargados.
 */
export async function getDownloadedIds(): Promise<number[]> {
  const list = await getOfflineItinerariesList();
  return list.map((item) => item.id);
}

/**
 * Obtiene los detalles completos de un itinerario descargado a partir de su ID.
 */
export async function getOfflineItineraryDetails(id: number): Promise<ItinerarioUsuario | null> {
  try {
    const raw = await AsyncStorage.getItem(`${OFFLINE_DETAIL_PREFIX}${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as ItinerarioUsuario;
  } catch (error) {
    console.error(`Error al obtener detalles offline del itinerario ${id}:`, error);
    return null;
  }
}

/**
 * Guarda un itinerario para su acceso offline (guarda el resumen en la lista y los detalles individuales).
 */
export async function saveItineraryOffline(
  summary: ItinerarioResumen,
  details: ItinerarioUsuario
): Promise<void> {
  try {
    // 1. Guardar el detalle completo
    await AsyncStorage.setItem(`${OFFLINE_DETAIL_PREFIX}${summary.id}`, JSON.stringify(details));

    // 2. Actualizar la lista de resúmenes offline
    const list = await getOfflineItinerariesList();
    const filteredList = list.filter((item) => item.id !== summary.id);
    filteredList.push(summary);

    await AsyncStorage.setItem(OFFLINE_LIST_KEY, JSON.stringify(filteredList));
  } catch (error) {
    console.error(`Error al guardar offline el itinerario ${summary.id}:`, error);
    throw error;
  }
}

/**
 * Quita un itinerario descargado eliminando sus detalles y actualizando la lista de resúmenes.
 */
export async function removeItineraryOffline(id: number): Promise<void> {
  try {
    // 1. Eliminar el detalle completo
    await AsyncStorage.removeItem(`${OFFLINE_DETAIL_PREFIX}${id}`);

    // 2. Quitarlo de la lista de resúmenes offline
    const list = await getOfflineItinerariesList();
    const updatedList = list.filter((item) => item.id !== id);

    await AsyncStorage.setItem(OFFLINE_LIST_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error(`Error al eliminar offline el itinerario ${id}:`, error);
    throw error;
  }
}
