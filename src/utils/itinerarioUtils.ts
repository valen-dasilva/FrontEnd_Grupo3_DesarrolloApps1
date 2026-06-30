import { ItinerarioResumen } from '@/services/itinerariosService';
import { PROVINCIA_LABEL, Provincia } from '@/types/itinerario';

/**
 * Arma los params de navegación hacia el detalle de un itinerario propio.
 * Centraliza el objeto que estaba duplicado en MisViajesTab y CompletadosTab.
 */
export function buildItinerarioParams(itinerary: ItinerarioResumen) {
  return {
    pathname: '/(tabs)/(favorite)/itinerarioInfoFav' as const,
    params: {
      id: String(itinerary.id),
      titulo: itinerary.titulo,
      provincia: itinerary.provincia,
      duracionDias: String(itinerary.duracionDias),
      fotoPortada: itinerary.fotoPortada,
      fechaInicio: itinerary.fechaInicio,
      fechaFin: itinerary.fechaFin,
      completado: itinerary.completado ? 'true' : 'false',
      etiquetas: itinerary.etiquetas?.join(','),
      description: itinerary.descripcion || '',
    },
  };
}

/**
 * Ordena los itinerarios dejando el fijado (pin) primero y, dentro de cada
 * grupo, por fecha de inicio ascendente. No muta el array original.
 */
export function ordenarConPinPrimero(itinerarios: ItinerarioResumen[]): ItinerarioResumen[] {
  return [...itinerarios].sort((a, b) => {
    if (a.esPinned !== b.esPinned) return a.esPinned ? -1 : 1;
    return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
  });
}

/** Devuelve el nombre legible de una provincia, o el código tal cual si no está mapeado. */
export function getProvinciaLabel(provincia: string): string {
  return PROVINCIA_LABEL[provincia as Provincia] ?? provincia;
}
