import { useEffect, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  confirmItem,
  deleteItem,
  getGroupItinerary,
  proposeItem,
  toggleAttendance,
  updateItem,
} from '@/services/groupItineraryService';
import { GroupItinerary, GroupItineraryItemRequest } from '@/types/itinerarioGrupo';
import { getErrorMessage, toErrorString } from '@/utils/errorUtils';

const GROUP_ITINERARY_KEY = 'groupItinerary';

/**
 * Itinerario compartido de un grupo. Como es colaborativo (varios miembros
 * mirando/editando lo mismo), la query hace polling mientras la pantalla está
 * montada y la app en primer plano — para acercarse a "en vivo" sin realtime.
 *
 * Optimizaciones de carga (Supabase tolera mal el spam de requests):
 *  - Intervalo de 15s (antes 7s) y sin polling en background.
 *  - Se pausa cuando la app pasa a segundo plano (AppState).
 *  - Solo se invalida esta query tras cada mutación (no cachés ajenas).
 */
const POLL_INTERVAL_MS = 15000;

export const useGroupItineraryHook = (idGrupo: number | null) => {
  const queryClient = useQueryClient();
  const key = [GROUP_ITINERARY_KEY, idGrupo];

  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => setAppActive(state === 'active'));
    return () => sub.remove();
  }, []);

  const {
    data: itinerary,
    isLoading,
    error,
    refetch: loadItinerary,
  } = useQuery({
    queryKey: key,
    queryFn: async () => {
      if (!idGrupo) return undefined;
      return await getGroupItinerary(idGrupo);
    },
    enabled: idGrupo !== null,
    refetchInterval: appActive ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });

  const invalidate = () => {
    if (idGrupo) queryClient.invalidateQueries({ queryKey: key });
  };

  const proposeMutation = useMutation({
    mutationFn: (request: GroupItineraryItemRequest) => {
      if (!idGrupo) throw new Error('Grupo no especificado');
      return proposeItem(idGrupo, request);
    },
    onSuccess: invalidate,
    onError: (err) => Alert.alert('Error', getErrorMessage(err, 'No se pudo agregar la actividad.')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ idItem, request }: { idItem: number; request: GroupItineraryItemRequest }) => {
      if (!idGrupo) throw new Error('Grupo no especificado');
      return updateItem(idGrupo, idItem, request);
    },
    onSuccess: invalidate,
    onError: (err) => Alert.alert('Error', getErrorMessage(err, 'No se pudo modificar la actividad.')),
  });

  const confirmMutation = useMutation({
    mutationFn: (idItem: number) => {
      if (!idGrupo) throw new Error('Grupo no especificado');
      return confirmItem(idGrupo, idItem);
    },
    onSuccess: invalidate,
    onError: (err) => Alert.alert('Error', getErrorMessage(err, 'No se pudo confirmar la actividad.')),
  });

  const deleteMutation = useMutation({
    mutationFn: (idItem: number) => {
      if (!idGrupo) throw new Error('Grupo no especificado');
      return deleteItem(idGrupo, idItem);
    },
    onSuccess: invalidate,
    onError: (err) => Alert.alert('Error', getErrorMessage(err, 'No se pudo eliminar la actividad.')),
  });

  const attendanceMutation = useMutation({
    mutationFn: ({ idItem, asiste }: { idItem: number; asiste: boolean }) => {
      if (!idGrupo) throw new Error('Grupo no especificado');
      return toggleAttendance(idGrupo, idItem, asiste);
    },
    // Optimista: la asistencia es la acción más frecuente, conviene feedback inmediato.
    onMutate: async ({ idItem, asiste }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<GroupItinerary>(key);
      if (previous) {
        queryClient.setQueryData<GroupItinerary>(key, {
          ...previous,
          items: previous.items.map((item) =>
            item.id === idItem ? { ...item, miAsistencia: asiste } : item,
          ),
        });
      }
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      Alert.alert('Error', getErrorMessage(err, 'No se pudo registrar tu asistencia.'));
    },
    onSettled: invalidate,
  });

  return {
    itinerary: itinerary as GroupItinerary | undefined,
    isLoading,
    error: toErrorString(error),
    loadItinerary,
    proposeItem: (request: GroupItineraryItemRequest) => proposeMutation.mutateAsync(request),
    isProposing: proposeMutation.isPending,
    updateItem: (idItem: number, request: GroupItineraryItemRequest) =>
      updateMutation.mutateAsync({ idItem, request }),
    isUpdating: updateMutation.isPending,
    confirmItem: (idItem: number) => confirmMutation.mutateAsync(idItem),
    isConfirming: confirmMutation.isPending,
    removeItem: (idItem: number) => deleteMutation.mutateAsync(idItem),
    isDeleting: deleteMutation.isPending,
    toggleAttendance: (idItem: number, asiste: boolean) =>
      attendanceMutation.mutateAsync({ idItem, asiste }),
    isTogglingAttendance: attendanceMutation.isPending,
  };
};
