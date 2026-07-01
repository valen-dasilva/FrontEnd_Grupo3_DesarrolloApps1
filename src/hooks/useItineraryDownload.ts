import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { ItinerarioResumen } from '@/services/itinerariosService';

interface Params {
  downloadedIds: number[];
  itinerarios: ItinerarioResumen[];
  downloadItinerary: (summary: ItinerarioResumen) => Promise<void>;
  removeDownload: (id: number) => Promise<void>;
}

/**
 * Encapsula el toggle de descarga offline + sus toasts. Estaba duplicado
 * idéntico en MisViajesTab y CompletadosTab. Recibe las piezas de
 * useItinerariosHook ya resueltas (en vez de volver a invocarlo) para no
 * duplicar las queries/mutations subyacentes.
 *
 * @returns `toggleDownload(id)` — descarga o elimina la copia offline según el estado actual.
 */
export function useItineraryDownload({ downloadedIds, itinerarios, downloadItinerary, removeDownload }: Params) {
  return useCallback(
    (id: number) => {
      const isDownloaded = downloadedIds.includes(id);
      const itinerary = itinerarios.find((i) => i.id === id);
      if (!itinerary) return;

      if (isDownloaded) {
        removeDownload(id).then(() => {
          Toast.show({ type: 'info', text1: 'Descarga eliminada', text2: 'El itinerario ya no estará disponible offline.' });
        });
      } else {
        downloadItinerary(itinerary).then(() => {
          Toast.show({ type: 'success', text1: '¡Descarga completa!', text2: 'El itinerario ya está disponible offline.' });
        });
      }
    },
    [downloadedIds, itinerarios, downloadItinerary, removeDownload],
  );
}
