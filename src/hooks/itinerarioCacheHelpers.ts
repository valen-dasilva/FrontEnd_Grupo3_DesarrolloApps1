import { QueryClient } from '@tanstack/react-query';
import { ItinerarioResumen, ItinerarioUsuario } from '@/services/itinerariosService';
import { ItinerarioEnCursoDTO } from '@/types/itinerario';

/**
 * Helpers para las actualizaciones optimistas de los itinerarios de usuario.
 * Centralizan el patrón que estaba copiado en casi todas las mutaciones de
 * useItinerariosDetailsHook: tocar las 3 cachés relacionadas
 * (`itineraryDetails`, `activeItinerary`, `misItinerarios`).
 */

export interface ItinerarioCacheSnapshot {
  prevDetails?: ItinerarioUsuario;
  prevActive?: ItinerarioEnCursoDTO | null;
  prevItinerarios?: ItinerarioResumen[];
}

/** Cancela queries en vuelo de las 3 cachés antes de un optimistic update. */
export async function cancelItinerarioCaches(qc: QueryClient, idItinerary: number): Promise<void> {
  await qc.cancelQueries({ queryKey: ['itineraryDetails', idItinerary] });
  await qc.cancelQueries({ queryKey: ['activeItinerary'] });
  await qc.cancelQueries({ queryKey: ['misItinerarios'] });
}

/** Invalida las 3 cachés para que vuelvan a traer datos frescos del servidor. */
export function invalidateItinerarioCaches(qc: QueryClient, idItinerary: number): void {
  qc.invalidateQueries({ queryKey: ['itineraryDetails', idItinerary] });
  qc.invalidateQueries({ queryKey: ['misItinerarios'] });
  qc.invalidateQueries({ queryKey: ['activeItinerary'] });
}

/** Toma una foto del estado actual de las 3 cachés (para poder revertir). */
export function snapshotItinerarioCaches(qc: QueryClient, idItinerary: number): ItinerarioCacheSnapshot {
  return {
    prevDetails: qc.getQueryData<ItinerarioUsuario>(['itineraryDetails', idItinerary]),
    prevActive: qc.getQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary']),
    prevItinerarios: qc.getQueryData<ItinerarioResumen[]>(['misItinerarios']),
  };
}

/** Restaura las 3 cachés a partir de un snapshot (rollback en onError). */
export function restoreItinerarioCaches(
  qc: QueryClient,
  idItinerary: number,
  ctx?: ItinerarioCacheSnapshot,
): void {
  if (ctx?.prevDetails) qc.setQueryData(['itineraryDetails', idItinerary], ctx.prevDetails);
  if (ctx?.prevActive !== undefined) qc.setQueryData(['activeItinerary'], ctx.prevActive);
  if (ctx?.prevItinerarios) qc.setQueryData(['misItinerarios'], ctx.prevItinerarios);
}
