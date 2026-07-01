import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItineraryPhotoFromStorage } from '@/services/itineraryPhotoService';
import { getErrorMessage, toErrorString } from '@/utils/errorUtils';
import {
    getLocalTitleOverride,
    saveLocalTitleOverride,
    removeLocalTitleOverride,
} from '@/services/titleOverrideStorage';
import {
    getLocalDurationOverride,
    saveLocalDurationOverride,
    removeLocalDurationOverride,
} from '@/services/durationOverrideStorage';
import { fetchActiveItinerary } from '@/hooks/useActiveItinerary';
import {
    cancelItinerarioCaches,
    invalidateItinerarioCaches,
    snapshotItinerarioCaches,
    restoreItinerarioCaches,
} from '@/hooks/itinerarioCacheHelpers';
import {
    deleteFoto,
    deleteItem,
    deleteItinerario,
    getItinerarioDetalles,
    getItinerarios,
    patchPin,
    completarItinerario,
    crearItinerarioDesdeFavorito,
    crearItinerarioDesdeCero,
    CrearItinerarioRequest,
    ItemItinerarioUsuario,
    ItinerarioResumen,
    ItinerarioUsuario,
    postFoto,
    postItem,
    putItem,
    patchFechaInicio,
    putItinerarioTitulo,
} from '@/services/itinerariosService';
import { ItinerarioEnCursoDTO, Provincia, CategoriaItinerario } from '@/types/itinerario';
import {
    getDownloadedIds,
    getOfflineItinerariesList,
    getOfflineItineraryDetails,
    saveItineraryOffline,
    removeItineraryOffline
} from '@/services/itineraryStorage';

// Fetch itineraries with local offline fallback
const fetchItinerariosWithOfflineFallback = async () => {
    let list: ItinerarioResumen[] = [];
    try {
        list = await getItinerarios();
    } catch {
        list = await getOfflineItinerariesList();
    }
    // Merge local overrides
    return await Promise.all(list.map(async (it) => {
        const localTitle = await getLocalTitleOverride(it.id);
        const localDuration = await getLocalDurationOverride(it.id);
        return { 
            ...it, 
            titulo: localTitle ?? it.titulo,
            duracionDias: localDuration ?? it.duracionDias
        };
    }));
};

export const useItinerariosHook = () => {
    const queryClient = useQueryClient();

    // Query for itineraries list
    const {
        data: listItinerarioResumen = [],
        isLoading,
        error,
        refetch: loadItinerarios,
    } = useQuery({
        queryKey: ['misItinerarios'],
        queryFn: fetchItinerariosWithOfflineFallback,
    });

    // Query for active itinerary (pin / home). Comparte queryFn con HomeScreen
    // vía useActiveItinerary para que la misma queryKey no tenga dos fuentes.
    const { data: activeItinerary = null } = useQuery({
        queryKey: ['activeItinerary'],
        queryFn: fetchActiveItinerary,
    });

    // Query for downloaded offline IDs
    const { data: downloadedIds = [] } = useQuery({
        queryKey: ['downloadedIds'],
        queryFn: getDownloadedIds,
        initialData: [],
    });

    // Mutation: crear copia desde un favorito (template del sistema guardado)
    const crearCopiaMutation = useMutation({
        mutationFn: (idSistema: number) => crearItinerarioDesdeFavorito(idSistema),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['misItinerarios'] });
        },
        onError: (err) => {
            Alert.alert("Error", getErrorMessage(err, "No se pudo crear la copia del itinerario."));
        }
    });

    const crearCopiaDesdeFavorito = async (idSistema: number) => {
        return await crearCopiaMutation.mutateAsync(idSistema);
    };

    // Mutation: crear itinerario desde cero
    const crearDesdeCeroMutation = useMutation({
        mutationFn: (payload: CrearItinerarioRequest) => crearItinerarioDesdeCero(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['misItinerarios'],
                refetchType: 'all',
            });
        },
        onError: (err) => {
            Alert.alert("Error", getErrorMessage(err, "No se pudo crear el itinerario."));
        }
    });

    const crearItinerario = async (payload: CrearItinerarioRequest) => {
        return await crearDesdeCeroMutation.mutateAsync(payload);
    };

    // Mutation: remove itinerary
    const deleteMutation = useMutation({
        mutationFn: async (idItinerario: number) => {
            // Juntamos las URLs para limpiar Storage. Preferimos el cache; si no
            // está, un GET best-effort. Es limpieza secundaria: nunca debe
            // bloquear el borrado del itinerario, por eso va en try/catch.
            let photoUrls: string[] = [];
            try {
                const details = queryClient.getQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerario])
                    ?? await getItinerarioDetalles(idItinerario);
                photoUrls = Array.from(new Set([
                    ...(details.fotos ?? []).map((photo) => photo.url),
                    ...(details.fotoPortada ? [details.fotoPortada] : []),
                ]));
            } catch {
                // Sin conexión o detalle inaccesible: seguimos con el borrado.
            }

            await deleteItinerario(idItinerario);

            if (photoUrls.length > 0) {
                const cleanupResults = await Promise.allSettled(
                    photoUrls.map(deleteItineraryPhotoFromStorage)
                );
                const failedCleanups = cleanupResults.filter((result) => result.status === 'rejected').length;
                if (failedCleanups > 0) {
                    console.warn(`No se pudieron limpiar ${failedCleanups} fotos del itinerario ${idItinerario}.`);
                }
            }
        },
        onSuccess: (data, idItinerario) => {
            queryClient.invalidateQueries({ queryKey: ['misItinerarios'] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
            // Recalcula el mapa: si el viaje borrado estaba completado, sus
            // provincias/días deben dejar de contar.
            queryClient.invalidateQueries({ queryKey: ['estadisticas'] });
            // Cleanup offline download if it exists
            removeItineraryOffline(idItinerario).catch(console.error);
            // Limpia el override de título local para no dejar claves huérfanas
            // en AsyncStorage que pisen títulos de itinerarios futuros.
            removeLocalTitleOverride(idItinerario).catch(console.error);
            removeLocalDurationOverride(idItinerario).catch(console.error);
            queryClient.invalidateQueries({ queryKey: ['downloadedIds'] });
            queryClient.removeQueries({ queryKey: ['itineraryDetails', idItinerario], exact: true });
        },
        onError: (err) => {
            Alert.alert("Error", getErrorMessage(err, 'No se pudo eliminar el itinerario.'));
        }
    });

    const quitItinerary = async (idItinerario: number) => {
        await deleteMutation.mutateAsync(idItinerario);
    };

    // Mutation: toggle pin with Optimistic Updates
    const pinMutation = useMutation({
        mutationKey: ['pinItinerary'],
        mutationFn: patchPin,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['misItinerarios'] });
            await queryClient.cancelQueries({ queryKey: ['activeItinerary'] });

            const previousItinerarios = queryClient.getQueryData<ItinerarioResumen[]>(['misItinerarios']);
            const previousActiveItinerary = queryClient.getQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary']);

            // 1. Optimistically update itineraries list
            if (previousItinerarios) {
                queryClient.setQueryData<ItinerarioResumen[]>(
                    ['misItinerarios'],
                    previousItinerarios.map((it) => ({
                        ...it,
                        esPinned: it.id === id ? !it.esPinned : false,
                    }))
                );
            }

            // 2. Optimistically update activeItinerary
            const targetItinerary = previousItinerarios?.find(it => it.id === id);
            if (targetItinerary) {
                const wasPinned = targetItinerary.esPinned;
                if (!wasPinned) {
                    // Pinned: set as active itinerary
                    const optimisticActive: ItinerarioEnCursoDTO = {
                        idItinerarioUsuario: targetItinerary.id,
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

            return { previousItinerarios, previousActiveItinerary };
        },
        onError: (err, id, context) => {
            if (context?.previousItinerarios) {
                queryClient.setQueryData(['misItinerarios'], context.previousItinerarios);
            }
            if (context?.previousActiveItinerary !== undefined) {
                queryClient.setQueryData(['activeItinerary'], context.previousActiveItinerary);
            }
            Alert.alert("Error", getErrorMessage(err, "No se pudo fijar el itinerario."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['misItinerarios'] });
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
            Alert.alert("Error", getErrorMessage(err, "No se pudo descargar el itinerario."));
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
        await queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
    };

    const errorString = toErrorString(error);

    return {
        loadItinerarios,
        crearCopiaDesdeFavorito,
        crearItinerario,
        quitItinerary,
        togglePin,
        listItinerarioResumen,
        getActive,
        isLoading,
        isMutating: crearCopiaMutation.isPending || crearDesdeCeroMutation.isPending || deleteMutation.isPending || pinMutation.isPending || downloadMutation.isPending || removeDownloadMutation.isPending,
        isCreando: crearCopiaMutation.isPending || crearDesdeCeroMutation.isPending,
        error: errorString,
        activeItinerary,
        downloadedIds,
        downloadItinerary,
        removeDownload,
    };
};

export const useItinerariosDetailsHook = () => {
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
            let details;
            try {
                details = await getItinerarioDetalles(activeId);
            } catch (err) {
                const offlineDetails = await getOfflineItineraryDetails(activeId);
                if (offlineDetails) {
                    details = offlineDetails;
                } else {
                    throw err;
                }
            }
            if (details) {
                const localTitle = await getLocalTitleOverride(activeId);
                const localDuration = await getLocalDurationOverride(activeId);
                
                const maxActivityDay = details.items.length > 0 ? Math.max(...details.items.map(i => i.dia)) : 0;
                let finalDuration = localDuration ?? details.duracionDias;
                
                if (maxActivityDay > finalDuration) {
                    finalDuration = maxActivityDay;
                    await saveLocalDurationOverride(activeId, finalDuration);
                }

                return { 
                    ...details, 
                    titulo: localTitle ?? details.titulo,
                    duracionDias: finalDuration
                };
            }
            return details;
        },
        enabled: activeId !== null,
    });

    // Mutation: reprogramar la fecha de inicio. La fecha de fin la recalcula
    // el backend a partir de la duración, así que refrescamos detalle + listas.
    const fechaInicioMutation = useMutation({
        mutationFn: ({ idItinerary, fechaInicio }: { idItinerary: number; fechaInicio: string }) =>
            patchFechaInicio(idItinerary, fechaInicio),
        onSuccess: (updatedItinerary, variables) => {
            queryClient.setQueryData(['itineraryDetails', variables.idItinerary], updatedItinerary);
            queryClient.invalidateQueries({ queryKey: ['misItinerarios'] });
            queryClient.invalidateQueries({ queryKey: ['activeItinerary'] });
        },
        onError: (err) => {
            Alert.alert("Error", getErrorMessage(err, "No se pudo modificar la fecha de inicio."));
        }
    });

    const putItineraryFechaInicio = async (idItinerary: number, fechaInicio: string) => {
        await fechaInicioMutation.mutateAsync({ idItinerary, fechaInicio });
    };

    // Mutation: put title
    const putTitleMutation = useMutation({
        mutationFn: async ({ idItinerary, titulo }: { idItinerary: number; titulo: string }) => {
            await saveLocalTitleOverride(idItinerary, titulo);
            try {
                return await putItinerarioTitulo(idItinerary, titulo);
            } catch (err) {
                console.warn("Failed to update title on backend, keeping local update:", err);
                return { id: idItinerary, titulo }; // Mock success response
            }
        },
        onMutate: async ({ idItinerary, titulo }) => {
            await cancelItinerarioCaches(queryClient, idItinerary);

            const prevDetails = queryClient.getQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary]);
            if (prevDetails) {
                queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary], {
                    ...prevDetails,
                    titulo
                });
            }

            const prevItinerarios = queryClient.getQueryData<ItinerarioResumen[]>(['misItinerarios']);
            if (prevItinerarios) {
                queryClient.setQueryData<ItinerarioResumen[]>(['misItinerarios'], prevItinerarios.map(it => it.id === idItinerary ? { ...it, titulo } : it));
            }

            const prevActive = queryClient.getQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary']);
            if (prevActive?.idItinerarioUsuario === idItinerary) {
                queryClient.setQueryData<ItinerarioEnCursoDTO>(['activeItinerary'], { ...prevActive, titulo });
            }

            return { prevDetails, prevItinerarios, prevActive };
        },
        onError: (err, variables, context) => {
            restoreItinerarioCaches(queryClient, variables.idItinerary, context);
            Alert.alert("Error", getErrorMessage(err, "No se pudo modificar el título."));
        },
        onSettled: (data, error, variables) => {
            if (data !== null && !error) {
                invalidateItinerarioCaches(queryClient, variables.idItinerary);
            }
        }
    });

    const putItineraryTitle = async (idItinerary: number, titulo: string) => {
        await putTitleMutation.mutateAsync({ idItinerary, titulo });
    };

    // Mutation: create item
    const newItemMutation = useMutation({
        mutationFn: ({ idItinerary, itemData }: { idItinerary: number; itemData: Omit<ItemItinerarioUsuario, 'id'> }) =>
            postItem(idItinerary, itemData),
        onMutate: async ({ idItinerary, itemData }) => {
            await cancelItinerarioCaches(queryClient, idItinerary);

            const { prevDetails, prevActive, prevItinerarios } = snapshotItinerarioCaches(queryClient, idItinerary);

            const optimisticItem: ItemItinerarioUsuario = {
                ...itemData,
                id: -Math.floor(Math.random() * 1000000),
            };

            if (prevDetails) {
                const updatedItems = [...prevDetails.items, optimisticItem];
                const newDuracion = Math.max(prevDetails.duracionDias, itemData.dia);
                saveLocalDurationOverride(idItinerary, newDuracion).catch(console.error);
                queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary], {
                    ...prevDetails,
                    items: updatedItems,
                    duracionDias: newDuracion
                });
            }

            if (prevActive?.idItinerarioUsuario === idItinerary) {
                const newDuracion = Math.max(prevActive.duracionDias, itemData.dia);
                queryClient.setQueryData<ItinerarioEnCursoDTO>(['activeItinerary'], {
                    ...prevActive,
                    duracionDias: newDuracion
                });
            }

            if (prevItinerarios) {
                queryClient.setQueryData<ItinerarioResumen[]>(
                    ['misItinerarios'],
                    prevItinerarios.map(it => it.id === idItinerary ? { ...it, duracionDias: Math.max(it.duracionDias, itemData.dia) } : it)
                );
            }

            return { prevDetails, prevActive, prevItinerarios };
        },
        onSuccess: (createdItem, variables) => {
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary], (prev) => {
                if (!prev) return prev;
                const cleanItems = prev.items.filter(item => item.id > 0);
                const updatedItems = [...cleanItems, createdItem];
                const newDuracion = Math.max(prev.duracionDias, createdItem.dia);
                return {
                    ...prev,
                    items: updatedItems,
                    duracionDias: newDuracion
                };
            });
            queryClient.setQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary'], (prev) => {
                if (!prev || prev.idItinerarioUsuario !== variables.idItinerary) return prev;
                return {
                    ...prev,
                    duracionDias: Math.max(prev.duracionDias, createdItem.dia)
                };
            });
            queryClient.setQueryData<ItinerarioResumen[]>(['misItinerarios'], (prev) => {
                if (!prev) return prev;
                return prev.map(it => it.id === variables.idItinerary ? { ...it, duracionDias: Math.max(it.duracionDias, createdItem.dia) } : it);
            });
        },
        onError: (err, variables, context) => {
            restoreItinerarioCaches(queryClient, variables.idItinerary, context);
            Alert.alert("Error", getErrorMessage(err, "No se pudo crear la actividad"));
        },
        onSettled: (data, error, variables) => {
            invalidateItinerarioCaches(queryClient, variables.idItinerary);
        }
    });

    const newItem = async (idItinerary: number, itemData: Omit<ItemItinerarioUsuario, 'id'>) => {
        await newItemMutation.mutateAsync({ idItinerary, itemData });
    };

    // Mutation: edit item
    const editItemMutation = useMutation({
        mutationFn: ({ idItinerary, idItem, itemData }: { idItinerary: number; idItem: number; itemData: Omit<ItemItinerarioUsuario, 'id'> }) =>
            putItem(idItinerary, idItem, itemData),
        onMutate: async ({ idItinerary, idItem, itemData }) => {
            await cancelItinerarioCaches(queryClient, idItinerary);

            const { prevDetails, prevActive, prevItinerarios } = snapshotItinerarioCaches(queryClient, idItinerary);

            if (prevDetails) {
                const updatedItems = prevDetails.items.map((item) =>
                    item.id === idItem ? { ...item, ...itemData } : item
                );
                const newDuracion = Math.max(...updatedItems.map(item => item.dia), prevDetails.duracionDias, 1);
                saveLocalDurationOverride(idItinerary, newDuracion).catch(console.error);
                queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary], {
                    ...prevDetails,
                    items: updatedItems,
                    duracionDias: newDuracion
                });
            }

            if (prevActive?.idItinerarioUsuario === idItinerary) {
                const currentMaxDay = prevDetails ? Math.max(...prevDetails.items.map(item => item.id === idItem ? itemData.dia : item.dia), 1) : itemData.dia;
                const newDuracion = Math.max(prevActive.duracionDias, currentMaxDay);
                queryClient.setQueryData<ItinerarioEnCursoDTO>(['activeItinerary'], {
                    ...prevActive,
                    duracionDias: newDuracion
                });
            }

            if (prevItinerarios) {
                const currentMaxDay = prevDetails ? Math.max(...prevDetails.items.map(item => item.id === idItem ? itemData.dia : item.dia), 1) : itemData.dia;
                queryClient.setQueryData<ItinerarioResumen[]>(
                    ['misItinerarios'],
                    prevItinerarios.map(it => it.id === idItinerary ? { ...it, duracionDias: Math.max(it.duracionDias, currentMaxDay) } : it)
                );
            }

            return { prevDetails, prevActive, prevItinerarios };
        },
        onSuccess: (updatedItem, variables) => {
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary], (prev) => {
                if (!prev) return prev;
                const updatedItems = prev.items.map((item) => item.id === variables.idItem ? updatedItem : item);
                const newDuracion = Math.max(...updatedItems.map(item => item.dia), prev.duracionDias, 1);
                return {
                    ...prev,
                    items: updatedItems,
                    duracionDias: newDuracion
                };
            });
            queryClient.setQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary'], (prev) => {
                if (!prev || prev.idItinerarioUsuario !== variables.idItinerary) return prev;
                const details = queryClient.getQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary]);
                const newDuracion = details ? details.duracionDias : prev.duracionDias;
                return {
                    ...prev,
                    duracionDias: newDuracion
                };
            });
            queryClient.setQueryData<ItinerarioResumen[]>(['misItinerarios'], (prev) => {
                if (!prev) return prev;
                const details = queryClient.getQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary]);
                const newDuracion = details ? details.duracionDias : 1;
                return prev.map(it => it.id === variables.idItinerary ? { ...it, duracionDias: newDuracion } : it);
            });
        },
        onError: (err, variables, context) => {
            restoreItinerarioCaches(queryClient, variables.idItinerary, context);
            Alert.alert("Error", getErrorMessage(err, "No se pudo modificar la actividad"));
        },
        onSettled: (data, error, variables) => {
            invalidateItinerarioCaches(queryClient, variables.idItinerary);
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
            // Borrar una actividad no cambia la duración ni renumera los días:
            // los días vacíos se siguen mostrando según duracionDias. Solo
            // quitamos el item de la lista.
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary], (prev) =>
                prev ? { ...prev, items: prev.items.filter((item) => item.id !== variables.idItem) } : prev
            );
            invalidateItinerarioCaches(queryClient, variables.idItinerary);
        },
        onError: (err) => {
            Alert.alert("Error", getErrorMessage(err, "No se pudo eliminar la actividad"));
        }
    });

    const quitItem = async (idItinerary: number, idItem: number) => {
        await quitItemMutation.mutateAsync({ idItinerary, idItem });
    };

    // Mutation: add photo URL to an itinerary
    const addPhotoMutation = useMutation({
        mutationFn: ({ idItinerary, url }: { idItinerary: number; url: string }) =>
            postFoto(idItinerary, url),
        onSuccess: (createdPhoto, variables) => {
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', variables.idItinerary], (prev) => {
                if (!prev) return prev;
                const fotos = [...(prev.fotos ?? []), createdPhoto]
                    .sort((a, b) => a.orden - b.orden || a.id - b.id);
                return { ...prev, fotos };
            });
        },
        onError: (err) => {
            Alert.alert('Error', getErrorMessage(err, 'No se pudo agregar la foto.'));
        },
        onSettled: (_data, _error, variables) => {
            invalidateItinerarioCaches(queryClient, variables.idItinerary);
        },
    });

    const addPhoto = async (idItinerary: number, url: string) => {
        return await addPhotoMutation.mutateAsync({ idItinerary, url });
    };

    // Mutation: delete a photo. El backend recalcula la portada al borrar, así
    // que en vez de confirmar con un GET extra dejamos que las invalidaciones
    // refresquen detalle + lista con los datos ya actualizados del servidor.
    const quitPhotoMutation = useMutation({
        mutationFn: ({ idItinerary, idPhoto }: { idItinerary: number; idPhoto: number }) =>
            deleteFoto(idItinerary, idPhoto),
        onError: (err) => {
            Alert.alert('Error', getErrorMessage(err, 'No se pudo eliminar la foto.'));
        },
        onSettled: (_data, _error, variables) => {
            invalidateItinerarioCaches(queryClient, variables.idItinerary);
        },
    });

    const quitPhoto = async (idItinerary: number, idPhoto: number) => {
        await quitPhotoMutation.mutateAsync({ idItinerary, idPhoto });
    };

    // Mutation: completar itinerario
    const completarMutation = useMutation({
        mutationFn: (idItinerary: number) => completarItinerario(idItinerary),
        onMutate: async (idItinerary) => {
            await queryClient.cancelQueries({ queryKey: ['itineraryDetails', idItinerary] });
            await queryClient.cancelQueries({ queryKey: ['misItinerarios'] });
            const prevDetails = queryClient.getQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary]);
            if (prevDetails) {
                queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary], { ...prevDetails, completado: true });
            }
            const prevItinerarios = queryClient.getQueryData<ItinerarioResumen[]>(['misItinerarios']);
            if (prevItinerarios) {
                queryClient.setQueryData<ItinerarioResumen[]>(['misItinerarios'], prevItinerarios.map(it => it.id === idItinerary ? { ...it, completado: true } : it));
            }
            return { prevDetails, prevItinerarios };
        },
        onError: (_err, idItinerary, context) => {
            // Solo revertimos el optimistic update. El mensaje al usuario lo
            // muestra la pantalla con un Toast cross-platform (Alert queda mudo
            // en Expo web), evitando además un doble aviso en nativo.
            if (context?.prevDetails) queryClient.setQueryData(['itineraryDetails', idItinerary], context.prevDetails);
            if (context?.prevItinerarios) queryClient.setQueryData(['misItinerarios'], context.prevItinerarios);
        },
        onSettled: (data, error, idItinerary) => {
            queryClient.invalidateQueries({ queryKey: ['itineraryDetails', idItinerary] });
            queryClient.invalidateQueries({ queryKey: ['misItinerarios'] });
            queryClient.invalidateQueries({ queryKey: ['estadisticas'] });
        },
    });

    const completarViaje = async (idItinerary: number) => {
        await completarMutation.mutateAsync(idItinerary);
    };

    const reduceDurationMutation = useMutation({
        mutationFn: async (idItinerary: number) => {
            const currentDetails = queryClient.getQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary]);
            if (!currentDetails) return;
            const newDuracion = Math.max(currentDetails.duracionDias - 1, 1);
            await saveLocalDurationOverride(idItinerary, newDuracion);
            return newDuracion;
        },
        onSuccess: (newDuracion, idItinerary) => {
            if (newDuracion === undefined) return;
            queryClient.setQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary], (prev) => 
                prev ? { ...prev, duracionDias: newDuracion } : prev
            );
            queryClient.setQueryData<ItinerarioResumen[]>(['misItinerarios'], (prev) => 
                prev ? prev.map(it => it.id === idItinerary ? { ...it, duracionDias: newDuracion } : it) : prev
            );
            queryClient.setQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary'], (prev) => 
                prev?.idItinerarioUsuario === idItinerary ? { ...prev, duracionDias: newDuracion } : prev
            );
        }
    });

    const reduceItineraryDuration = async (idItinerary: number) => {
        await reduceDurationMutation.mutateAsync(idItinerary);
    };

    const errorString = toErrorString(error);

    return {
        error: errorString,
        isMutating: reduceDurationMutation.isPending || fechaInicioMutation.isPending || putTitleMutation.isPending || newItemMutation.isPending || editItemMutation.isPending || quitItemMutation.isPending || addPhotoMutation.isPending || quitPhotoMutation.isPending || completarMutation.isPending,
        isLoading,
        itineraryDetails,
        quitItem,
        editItem,
        newItem,
        putItineraryFechaInicio,
        putItineraryTitle,
        loadItineraryInfo,
        completarViaje,
        isCompletando: completarMutation.isPending,
        addPhoto,
        quitPhoto,
        isMutatingPhotos: addPhotoMutation.isPending || quitPhotoMutation.isPending,
        reduceItineraryDuration,
    };
};
