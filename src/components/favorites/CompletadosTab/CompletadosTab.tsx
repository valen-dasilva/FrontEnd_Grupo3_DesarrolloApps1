import React from 'react';
import { ItinerarioListTab } from '@/components/favorites/ItinerarioListTab/ItinerarioListTab';
import { ItinerarioResumen } from '@/services/itinerariosService';

// Predicado estable a nivel módulo: evita recrear la función en cada render
// (mantiene memoizado el filtrado/orden dentro de ItinerarioListTab).
const soloCompletados = (it: ItinerarioResumen) => it.completado;

interface Props {
  /** Header compartido (título + toggle de vista) que scrollea con la lista */
  header: React.ReactElement;
  /** Cambiar a la tab "Mis viajes" (desde el empty state) */
  onVerMisViajes: () => void;
}

/** Tab "Completados": historial de copias marcadas como viaje realizado. */
export function CompletadosTab({ header, onVerMisViajes }: Props) {
  return (
    <ItinerarioListTab
      header={header}
      filter={soloCompletados}
      keyPrefix="completed-itin"
      confirmDeleteMessage="¿Estás seguro de que deseas eliminar este itinerario completado?"
      emptyState={{
        title: 'Todavía no completaste viajes',
        description: 'Cuando marques un itinerario como completado, lo vas a encontrar en este historial.',
        actionLabel: 'Ver mis viajes',
        onActionPress: onVerMisViajes,
      }}
    />
  );
}
