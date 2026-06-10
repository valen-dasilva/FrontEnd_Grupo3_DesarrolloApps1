import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { ApiError } from '../services/api';
import {
    deleteItem,
    deleteItinerario,
    getActiveItinerario,
    getItinerarioDetalles,
    getItinerarios,
    ItemItinerarioUsuario,
    ItinerarioResumen,
    ItinerarioUsuario,
    postItem,
    postItinerario,
    putItem,
    putItinerarioFechas,
    UpdateDatesRequest
} from '../services/favoritosService';
import {
    getDownloadedIds,
    getOfflineItinerariesList,
    getOfflineItineraryDetails,
    saveItineraryOffline,
    removeItineraryOffline
} from '../services/itineraryStorage';

export const useFavoritosHook = () => {
    const [listItinerarioResumen, setListItinerarioResumen] = useState<ItinerarioResumen[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMutating, setIsMutating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeItinerary, setActiveItinerary] = useState<ItinerarioUsuario | null>(null);
    const [downloadedIds, setDownloadedIds] = useState<number[]>([]);

    //cargar lista de itinerarios
    const loadItinerarios = useCallback(async () => {
        try {
            setIsLoading(true);
            const offlineIds = await getDownloadedIds();
            setDownloadedIds(offlineIds);

            const datos = await getItinerarios();
            setListItinerarioResumen(datos);
            setError(null);
        } catch (err) {
            const offlineList = await getOfflineItinerariesList();
            setListItinerarioResumen(offlineList);
            setError(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadItinerarios() }, [loadItinerarios])




    //agregar un itinerario a favoritos
    const addItineraryToFavs = async (idItinerary: number) => {
        try {
            setIsMutating(true);
            const data = await postItinerario(idItinerary);
            setListItinerarioResumen((prev) => [...prev, data]);
        } catch (err) {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo guardar en favoritos.")
        } finally {
            setIsMutating(false);
        }
    }

    //eliminar un itinerario de favoritos
    const quitItineraryFromFavs = async (idItinerario: number) => {
        try {
            setIsMutating(true);
            await deleteItinerario(idItinerario);
            setListItinerarioResumen((prev) => prev.filter((o) => o.id !== idItinerario));
            setIsLoading(false)
        } catch (err) {
            Alert.alert("Error", err instanceof ApiError ? err.message : 'No se pudo eliminar el itinerario de favoritos.');
        } finally {
            setIsMutating(false)
        }
    }

    //obtener itinerario activo
    const getActive = async () => {
        try {
            setIsLoading(true);
            const data = await getActiveItinerario();
            setActiveItinerary(data);
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setActiveItinerary(null);
            } else {
                Alert.alert("Error", err instanceof ApiError ? err.message : "Error al obtener itinerario activo.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Descargar itinerario para offline
    const downloadItinerary = async (summary: ItinerarioResumen) => {
        try {
            setIsMutating(true);
            const details = await getItinerarioDetalles(summary.id);
            await saveItineraryOffline(summary, details);
            const offlineIds = await getDownloadedIds();
            setDownloadedIds(offlineIds);
        } catch (err) {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo descargar el itinerario.");
        } finally {
            setIsMutating(false);
        }
    };

    // Eliminar descarga offline
    const removeDownload = async (id: number) => {
        try {
            setIsMutating(true);
            await removeItineraryOffline(id);
            const offlineIds = await getDownloadedIds();
            setDownloadedIds(offlineIds);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "No se pudo encontrar el itinerario.");
            Alert.alert("Error", "No se pudo eliminar la descarga local.");
        } finally {
            setIsMutating(false);
        }
    };

    return {
        loadItinerarios,
        addItineraryToFavs,
        quitItineraryFromFavs,
        listItinerarioResumen,
        getActive,
        isLoading,
        isMutating,
        error,
        activeItinerary,
        downloadedIds,
        downloadItinerary,
        removeDownload,
    }

}

export const useFavoritosDetailsHook = () => {
    const [itineraryDetails, setItineraryDetails] = useState<ItinerarioUsuario>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMutating, setIsMutating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadItineraryInfo = useCallback(async (idItinerary: number) => {
        try {
            setIsLoading(true);
            const data = await getItinerarioDetalles(idItinerary);
            setItineraryDetails(data);
            setError(null);
        } catch (err) {
            const offlineDetails = await getOfflineItineraryDetails(idItinerary);
            if (offlineDetails) {
                setItineraryDetails(offlineDetails);
                setError(null);
            } else {
                setError(err instanceof ApiError ? err.message : "No se pudo encontrar el itinerario.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    //modificar fechas del itinerario
    const putItineraryDates = async (idItinerary: number, dates: UpdateDatesRequest) => {
        try {
            setIsMutating(true);
            const updatedItinerary = await putItinerarioFechas(idItinerary, dates);
            setItineraryDetails(updatedItinerary);
        } catch (err) {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo modificar las fechas.");
        } finally {
            setIsMutating(false);
        }
    };

    //agregar actividad
    const newItem = async (idItinerary: number, itemData: Omit<ItemItinerarioUsuario, 'id'>) => {
        try {
            setIsMutating(true);
            const createdItem = await postItem(idItinerary, itemData);
            setItineraryDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: [...prev.items, createdItem]
                };
            });
        } catch (err) {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo crear la actividad");
        } finally {
            setIsMutating(false);
        }
    };

    //modificar actividad
    const editItem = async (idItinerary: number, idItem: number, itemData: Omit<ItemItinerarioUsuario, 'id'>) => {
        try {
            setIsMutating(true);
            const updatedItem = await putItem(idItinerary, idItem, itemData);
            setItineraryDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((item) => item.id === idItem ? updatedItem : item)
                };
            });
        } catch (err) {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo modificar la actividad");
        } finally {
            setIsMutating(false);
        }
    };

    //quitar actividad
    const quitItem = async (idItinerary: number, idItem: number) => {
        try {
            setIsMutating(true);
            await deleteItem(idItinerary, idItem);
            setItineraryDetails((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.filter((item) => item.id !== idItem)
                };
            });
        } catch (err) {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo eliminar la actividad");
        } finally {
            setIsMutating(false);
        }
    };

    return {
        error,
        isMutating,
        isLoading,
        itineraryDetails,
        quitItem,
        editItem,
        newItem,
        putItineraryDates,
        loadItineraryInfo,
    };
};