import { useMemo } from 'react';
import { ItinerarioResumen } from '@/services/itinerariosService';
import { Provincia } from '@/types/itinerario';

// Color de highlight al tocar una provincia en el mapa
const COLOR_RESALTADO_VISITADA = '#F59E0B';    // ámbar
const COLOR_RESALTADO_NO_VISITADA = '#94A3B8'; // gris slate

interface ProvinciaStats {
  /** Set para O(1) lookup en vez de array.includes() */
  provinciasVisitadasSet: Set<string>;
  /** Itinerarios completados en la provincia seleccionada */
  itinerariosEnProvincia: ItinerarioResumen[];
  diasTotales: number;
  cantidadViajes: number;
  fueVisitada: boolean;
  /** Color de highlight según si fue visitada o no */
  colorResaltado: string;
}

export function useProvinciaStats(
  provinciasVisitadas: string[],
  itinerarios: ItinerarioResumen[],
  provinciaSeleccionada: Provincia | null,
): ProvinciaStats {
  // Set reconstruido solo cuando cambia el array de provincias visitadas
  const provinciasVisitadasSet = useMemo(
    () => new Set(provinciasVisitadas),
    [provinciasVisitadas],
  );

  const itinerariosEnProvincia = useMemo(
    () =>
      provinciaSeleccionada
        ? itinerarios.filter(it => it.completado && it.provincia === provinciaSeleccionada)
        : [],
    [itinerarios, provinciaSeleccionada],
  );

  const diasTotales = useMemo(
    () => itinerariosEnProvincia.reduce((acc, it) => acc + it.duracionDias, 0),
    [itinerariosEnProvincia],
  );

  const cantidadViajes = itinerariosEnProvincia.length;

  // ?? '' evita buscar null en el Set cuando no hay selección activa
  const fueVisitada = provinciasVisitadasSet.has(provinciaSeleccionada ?? '');

  const colorResaltado = fueVisitada ? COLOR_RESALTADO_VISITADA : COLOR_RESALTADO_NO_VISITADA;

  return {
    provinciasVisitadasSet,
    itinerariosEnProvincia,
    diasTotales,
    cantidadViajes,
    fueVisitada,
    colorResaltado,
  };
}
