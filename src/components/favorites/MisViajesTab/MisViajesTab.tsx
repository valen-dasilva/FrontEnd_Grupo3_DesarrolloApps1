import React from 'react';
import { ItinerarioListTab } from '@/components/favorites/ItinerarioListTab/ItinerarioListTab';
import { ItinerarioResumen } from '@/services/itinerariosService';

// Predicado estable a nivel módulo: evita recrear la función en cada render
// (mantiene memoizado el filtrado/orden dentro de ItinerarioListTab).
const soloNoCompletados = (it: ItinerarioResumen) => !it.completado;

interface Props {
  /** Header compartido (título + toggle de vista) que scrollea con la lista */
  header: React.ReactElement;
  /** Cambiar a la tab "Guardados" (desde el empty state) */
  onVerGuardados: () => void;
}

/** Tab "Mis viajes": copias propias del usuario sin completar. */
export function MisViajesTab({ header, onVerGuardados }: Props) {
  return (
    <ItinerarioListTab
      header={header}
      filter={soloNoCompletados}
      keyPrefix="itin"
      confirmDeleteMessage="¿Estás seguro de que deseas eliminar este itinerario de tus viajes?"
      emptyState={{
        title: 'No tenés viajes sin completar',
        description: 'Los itinerarios que todavía no completes van a aparecer acá.',
        actionLabel: 'Ver guardados',
        onActionPress: onVerGuardados,
      }}
    />
  );
}
