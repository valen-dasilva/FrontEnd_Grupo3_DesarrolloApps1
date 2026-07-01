import { useQuery } from '@tanstack/react-query';
import { getItinerarioEnCurso } from '@/services/itinerarioService';
import { getLocalTitleOverride } from '@/services/titleOverrideStorage';
import { ItinerarioEnCursoDTO } from '@/types/itinerario';

// Única queryKey de la app para el itinerario activo. Antes HomeScreen y
// useItinerarios definían la misma key con queryFn distintas, lo que hacía que
// el título override se aplicara de forma inconsistente (parpadeo en el Home).
export const ACTIVE_ITINERARY_KEY = ['activeItinerary'] as const;

/**
 * Fuente de verdad única para obtener el itinerario activo: trae el del backend
 * y le aplica el override de título local si existe. La comparten HomeScreen y
 * useItinerarios para que la misma queryKey use siempre esta misma queryFn.
 */
export async function fetchActiveItinerary(): Promise<ItinerarioEnCursoDTO | null> {
  const active = await getItinerarioEnCurso();
  if (active) {
    const localTitle = await getLocalTitleOverride(active.idItinerarioUsuario);
    if (localTitle) {
      return { ...active, titulo: localTitle };
    }
  }
  return active;
}

/**
 * Hook del itinerario activo (pin / próximo en curso).
 * @param options.enabled controla si la query corre (ej. solo con sesión activa).
 */
export function useActiveItinerary(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ACTIVE_ITINERARY_KEY,
    queryFn: fetchActiveItinerary,
    enabled: options?.enabled ?? true,
  });
}
