import { useEffect, useState } from 'react';
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

export const useFavoritosHook = () => {
    const [listItinerarioResumen, setListItinerarioResumen] = useState<ItinerarioResumen[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMutating, setIsMutating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeItinerary, setActiveItinerary] = useState<ItinerarioUsuario | null>(null);




    //cargar lista de itinerarios
    const loadItinerarios = async () => {
        try {
            setIsLoading(true);
            const datos = await getItinerarios();
            setListItinerarioResumen(datos);
            setError(null);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'No se pudo cargar los itinerarios.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { loadItinerarios() }, [])




    //agregar un itinerario a favoritos
    const addItineraryToFavs = async (idItinerary: number) => {
        try {
            setIsMutating(true);
            const data = await postItinerario(idItinerary);
            setListItinerarioResumen((prev) => [...prev, data]);
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo guardar en favoritos.")
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
            alert(err instanceof ApiError ? err.message : 'No se pudo cargar los itinerarios.');
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
                alert(err instanceof ApiError ? err.message : "Error al obtener itinerario activo.");
            }
        } finally {
            setIsLoading(false);
        }
    }

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
    }

}

export const useFavoritosDetailsHookq = () => {
    const [itineraryDetails, setItineraryDetails] = useState<ItinerarioUsuario>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMutating, setIsMutating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadItineraryInfo = async (idItinerary: number) => {
        try {
            setIsLoading(true);
            const data = await getItinerarioDetalles(idItinerary);
            setItineraryDetails(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "No se pudo encontrar el itinerario.");
        } finally {
            setIsLoading(false);
        }
    };

    //modificar fechas del itinerario
    const putItineraryDates = async (idItinerary: number, dates: UpdateDatesRequest) => {
        try {
            setIsMutating(true);
            const updatedItinerary = await putItinerarioFechas(idItinerary, dates);
            setItineraryDetails(updatedItinerary);
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "No se pudo modificar las fechas.");
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
            alert(err instanceof ApiError ? err.message : "No se pudo crear la actividad");
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
            alert(err instanceof ApiError ? err.message : "No se pudo modificar la actividad");
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
            alert(err instanceof ApiError ? err.message : "No se pudo modificar la actividad");
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