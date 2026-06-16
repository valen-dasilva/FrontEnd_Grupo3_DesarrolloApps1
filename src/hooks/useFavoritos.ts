import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/api';
import {
    deleteItem,
    deleteItinerario,
    getActiveItinerario,
    getItinerarioDetalles,
    getItinerarios,
    patchPin,
    ItemItinerarioUsuario,
    ItinerarioResumen,
    ItinerarioUsuario,
    postItem,
    postItinerario,
    putItem,
    putItinerarioFechas,
    putItinerarioTitulo,
    UpdateDatesRequest
} from '@/services/favoritosService';
import { ItinerarioEnCursoDTO, Provincia, CategoriaItinerario } from '@/types/itinerario';
import { getItinerarioEnCurso } from '@/services/itinerarioService';
import {
    getDownloadedIds,
    getOfflineItinerariesList,
    getOfflineItineraryDetails,
    saveItineraryOffline,
    removeItineraryOffline
} from '@/services/itineraryStorage';

// Fetch favorites with local offline fallback
const fetchFavoritesWithOfflineFallback = async () => {
    try {
        return await getItinerarios();
    } catch {
        return await getOfflineItinerariesList();
    }
};

export const useFavoritosHook = () => {
    const queryClient = useQueryClient();

    // Query for favorites list
    const {
        data: listItinerarioResumen = [],
        isLoading,
        error,
        refetch: loadItinerarios,
    } = useQuery({
        queryKey: ['favorites'],
        queryFn: fetchFavoritesWithOfflineFallback,
    });

    // Query for active itinerary (pin / home)
    const { data: activeItinerary = null } = useQuery({
        queryKey: ['activeItinerary'],
        queryFn: async () => {
            return getItinerarioEnCurso();
        },
    });

    // Query for downloaded offline IDs
    const { data: downloadedIds = [] } = useQuery({
        queryKey: ['downloadedIds'],
        queryFn: getDownloadedIds,
        initialData: [],
    });

    // Mutation: add to favorites
    const addMutation = useMutation({
        mutationFn: postItinerario,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        onError: (err) => {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo guardar en favoritos.");
        }
    });

    const addItineraryToFavs = async (idItinerary: number) => {
        await addMutation.mutateAsync(idItinerary);
    };

    // Mutation: remove from favorites
    const deleteMutation = useMutation({
        mutationFn: deleteItinerario,
        onSuccess: (data, idItinerario) => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
            // Cleanup offline download if it exists
            removeItineraryOffline(idItinerario).catch(console.error);
            queryClient.invalidateQueries({ queryKey: ['downloadedIds'] });
        },
        onError: (err) => {
            Alert.alert("Error", err instanceof ApiError ? err.message : 'No se pudo eliminar el itinerario de favoritos.');
        }
    });

    const quitItineraryFromFavs = async (idItinerario: number) => {
        await deleteMutation.mutateAsync(idItinerario);
    };

    // Mutation: toggle pin with Optimistic Updates
    const pinMutation = useMutation({
        mutationKey: ['pinItinerary'],
        mutationFn: patchPin,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['favorites'] });
            await queryClient.cancelQueries({ queryKey: ['activeItinerary'] });

            const previousFavorites = queryClient.getQueryData<ItinerarioResumen[]>(['favorites']);
            const previousActiveItinerary = queryClient.getQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary']);

            // 1. Optimistically update favorites list
            if (previousFavorites) {
                queryClient.setQueryData<ItinerarioResumen[]>(
                    ['favorites'],
                    previousFavorites.map((it) => ({
                        ...it,
                        esPinned: it.id === id ? !it.esPinned : false,
                    }))
                );
            }

            // 2. Optimistically update activeItinerary
            const targetItinerary = previousFavorites?.find(it => it.id === id);
            if (targetItinerary) {
                const wasPinned = targetItinerary.esPinned;
                if (!wasPinned) {
                    // Pinned: set as active itinerary
                    const optimisticActive: ItinerarioEnCursoDTO = {
                        idItinerarioUsuario: targetItinerary.id,
                        idItinerarioSistema: targetItinerary.idItinerarioSistema,
                        titulo: targetItinerary.titulo,
                        descripcion: "", // blank
                        provincia: targetItinerary.provincia as Provincia,
                        fechaInicio: targetItinerary.fechaInicio,
                        fechaFin: targetItinerary.fechaFin,
                        fotoPortada: targetItinerary.fotoPortada,
                        duracionDias: targetItinerary.duracionDias,
                        etiquetas: targetItinerary.etiquetas as CategoriaItinerario[],
                        items: [], // blank
                        isOptimistic: true,
                    };
                    queryClient.setQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary'], optimisticActive);
                } else {
                    // Unpinned: set to null
                    queryClient.setQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary'], null);
                }
            }

            return { previousFavorites, previousActiveItinerary };
        },
        onError: (err, id, context) => {
            if (context?.previousFavorites) {
                queryClient.setQueryData(['favorites'], context.previousFavorites);
            }
            if (context?.previousActiveItinerary !== undefined) {
                queryClient.setQueryData(['activeItinerary'], context.previousActiveItinerary);
            }
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo fijar el itinerario.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
        }
    });

    const togglePin = async (id: number) => {
        await pinMutation.mutateAsync(id);
    };

    // Mutation: download offline
    const downloadMutation = useMutation({
        mutationFn: async (summary: ItinerarioResumen) => {
            const details = await getItinerarioDetalles(summary.id);
            await saveItineraryOffline(summary, details);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['downloadedIds'] });
        },
        onError: (err) => {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo descargar el itinerario.");
        }
    });

    const downloadItinerary = async (summary: ItinerarioResumen) => {
        await downloadMutation.mutateAsync(summary);
    };

    // Mutation: remove offline download
    const removeDownloadMutation = useMutation({
        mutationFn: async (id: number) => {
            await removeItineraryOffline(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['downloadedIds'] });
        },
        onError: () => {
            Alert.alert("Error", "No se pudo eliminar la descarga local.");
        }
    });

    const removeDownload = async (id: number) => {
        await removeDownloadMutation.mutateAsync(id);
    };

    const getActive = async () => {
        // Handled by activeItinerary query. Exposed as no-op or refetch wrapper if needed.
        await queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
    };

    let errorString: string | null = null;
    if (error instanceof Error) {
        errorString = error.message;
    } else if (error) {
        errorString = String(error);
    }

    return {
        loadItinerarios,
        addItineraryToFavs,
        quitItineraryFromFavs,
        togglePin,
        listItinerarioResumen,
        getActive,
        isLoading,
        isMutating: addMutation.isPending || deleteMutation.isPending || pinMutation.isPending || downloadMutation.isPending || removeDownloadMutation.isPending,
        error: errorString,
        activeItinerary,
        downloadedIds,
        downloadItinerary,
        removeDownload,
    };
};

export const useFavoritosDetailsHook = () => {
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<number | null>(null);

    const loadItineraryInfo = useCallback((idItinerary: number) => {
        setActiveId(idItinerary);
    }, []);

    // Query for specific itinerary details
    const {
        data: itineraryDetails,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['itineraryDetails', activeId],
        queryFn: async () => {
            if (!activeId) return undefined;
            try {
                return await getItinerarioDetalles(activeId);
            } catch (err) {
                const offlineDetails = await getOfflineItineraryDetails(activeId);
                if (offlineDetails) {
                    return offlineDetails;
                }
                throw err;
            }
        },
        enabled: activeId !== null,
    });

    // Mutation: put dates
    const putDatesMutation = useMutation({
        mutationFn: ({ idItinerary, dates }: { idItinerary: number; dates: UpdateDatesRequest }) =>
            putItinerarioFechas(idItinerary, dates),
        onSuccess: (updatedItinerary, variables) => {
            queryClient.setQueryData(['itineraryDetails', variables.idItinerary], updatedItinerary);
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
        },
        onError: (err) => {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo modificar las fechas.");
        }
    });

    const putItineraryDates = async (idItinerary: number, dates: UpdateDatesRequest) => {
        await putDatesMutation.mutateAsync({ idItinerary, dates });
    };

    // Mutation: put title
    const putTitleMutation = useMutation({
        mutationFn: ({ idItinerary, titulo }: { idItinerary: number; titulo: string }) =>
            putItinerarioTitulo(idItinerary, titulo),
        onMutate: async ({ idItinerary, titulo }) => {
            await queryClient.cancelQueries({ queryKey: ['itineraryDetails', idItinerary] });
            await queryClient.cancelQueries({ queryKey: ['favorites'] });
            await queryClient.cancelQueries({ queryKey: ['activeItinerary'] });

            const prevDetails = queryClient.getQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary]);
            if (prevDetails) {
                queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary], {
                    ...prevDetails,
                    titulo
                });
            }

            const prevFavorites = queryClient.getQueryData<ItinerarioResumen[]>(['favorites']);
            if (prevFavorites) {
                queryClient.setQueryData<ItinerarioResumen[]>(['favorites'], prevFavorites.map(it => it.id === idItinerary ? { ...it, titulo } : it));
            }

            const prevActive = queryClient.getQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary']);
            if (prevActive && prevActive.idItinerarioUsuario === idItinerary) {
                queryClient.setQueryData<ItinerarioEnCursoDTO>(['activeItinerary'], { ...prevActive, titulo });
            }

            return { prevDetails, prevFavorites, prevActive };
        },
        onError: (err, variables, context) => {
            if (context?.prevDetails) {
                queryClient.setQueryData(['itineraryDetails', variables.idItinerary], context.prevDetails);
            }
            if (context?.prevFavorites) {
                queryClient.setQueryData(['favorites'], context.prevFavorites);
            }
            if (context?.prevActive !== undefined) {
                queryClient.setQueryData(['activeItinerary'], context.prevActive);
            }
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo modificar el título.");
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['itineraryDetails', variables.idItinerary] });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
        }
    });

    const putItineraryTitle = async (idItinerary: number, titulo: string) => {
        await putTitleMutation.mutateAsync({ idItinerary, titulo });
    };

    // Mutation: create item
    const newItemMutation = useMutation({
        mutationFn: ({ idItinerary, itemData }: { idItinerary: number; itemData: Omit<ItemItinerarioUsuario, 'id'> }) =>
            postItem(idItinerary, itemData),
        onSuccess: (createdItem, variables) => {
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary], (prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: [...prev.items, createdItem]
                };
            });
            queryClient.invalidateQueries({ queryKey: ['itineraryDetails', variables.idItinerary] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
        },
        onError: (err) => {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo crear la actividad");
        }
    });

    const newItem = async (idItinerary: number, itemData: Omit<ItemItinerarioUsuario, 'id'>) => {
        await newItemMutation.mutateAsync({ idItinerary, itemData });
    };

    // Mutation: edit item
    const editItemMutation = useMutation({
        mutationFn: ({ idItinerary, idItem, itemData }: { idItinerary: number; idItem: number; itemData: Omit<ItemItinerarioUsuario, 'id'> }) =>
            putItem(idItinerary, idItem, itemData),
        onSuccess: (updatedItem, variables) => {
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary], (prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((item) => item.id === variables.idItem ? updatedItem : item)
                };
            });
            queryClient.invalidateQueries({ queryKey: ['itineraryDetails', variables.idItinerary] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
        },
        onError: (err) => {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo modificar la actividad");
        }
    });

    const editItem = async (idItinerary: number, idItem: number, itemData: Omit<ItemItinerarioUsuario, 'id'>) => {
        await editItemMutation.mutateAsync({ idItinerary, idItem, itemData });
    };

    // Mutation: delete item
    const quitItemMutation = useMutation({
        mutationFn: ({ idItinerary, idItem }: { idItinerary: number; idItem: number }) =>
            deleteItem(idItinerary, idItem),
        onSuccess: (data, variables) => {
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary], (prev) => {
                if (!prev) return prev;
                
                let newItems = prev.items.filter((item) => item.id !== variables.idItem);
                
                // Re-mapear días para que no queden huecos (ej: Día 1, Día 3 -> Día 1, Día 2)
                const daysPresent = Array.from(new Set(newItems.map(item => item.dia))).sort((a,b) => a - b);
                const dayMap = new Map<number, number>();
                daysPresent.forEach((oldDay, index) => {
                    dayMap.set(oldDay, index + 1);
                });
                
                newItems = newItems.map(item => ({
                    ...item,
                    dia: dayMap.get(item.dia) || item.dia
                }));

                const newDuracion = daysPresent.length > 0 ? daysPresent.length : 1;

                return {
                    ...prev,
                    items: newItems,
                    duracionDias: newDuracion
                };
            });
            queryClient.invalidateQueries({ queryKey: ['itineraryDetails', variables.idItinerary] });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
        },
        onError: (err) => {
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo eliminar la actividad");
        }
    });

    const quitItem = async (idItinerary: number, idItem: number) => {
        await quitItemMutation.mutateAsync({ idItinerary, idItem });
    };

    let errorString: string | null = null;
    if (error instanceof Error) {
        errorString = error.message;
    } else if (error) {
        errorString = String(error);
    }

    return {
        error: errorString,
        isMutating: putDatesMutation.isPending || putTitleMutation.isPending || newItemMutation.isPending || editItemMutation.isPending || quitItemMutation.isPending,
        isLoading,
        itineraryDetails,
        quitItem,
        editItem,
        newItem,
        putItineraryDates,
        putItineraryTitle,
        loadItineraryInfo,
    };
};