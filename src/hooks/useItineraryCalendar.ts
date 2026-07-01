import { useState } from 'react';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import type { ItinerarioEnCursoDTO } from '@/types/itinerario';

async function getCalendarId(): Promise<string> {
  if (Platform.OS === 'ios') {
    const defaultCal = await Calendar.getDefaultCalendarAsync();
    return defaultCal.id;
  }

  // Android — puede tener múltiples calendarios: Google, Samsung, Exchange, local, etc.
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writables = calendars.filter(c => c.allowsModifications);

  if (writables.length === 0) {
    throw new Error('No se encontró un calendario editable en tu dispositivo.');
  }

  // 1. Preferencia máxima: Google Calendar principal (el más usado en Android)
  const googlePrimary = writables.find(
    c => c.isPrimary && c.source?.type === 'com.google'
  );
  if (googlePrimary) return googlePrimary.id;

  // 2. Cualquier cuenta de Google editable (puede no estar marcada como primary)
  const googleAny = writables.find(
    c => c.source?.type === 'com.google'
  );
  if (googleAny) return googleAny.id;

  // 3. Cualquier calendario primario editable (Samsung, Exchange, etc.)
  const anyPrimary = writables.find(c => c.isPrimary);
  if (anyPrimary) return anyPrimary.id;

  // 4. Último recurso: el primer calendario editable que exista
  return writables[0].id;
}

function buildItineraryEventDates(fechaInicio: string, fechaFin: string) {
  const startDate = new Date(`${fechaInicio}T00:00:00`);
  const endDate = new Date(`${fechaFin}T23:59:59`);
  return { startDate, endDate };
}

function buildActivitiesNotes(items: ItinerarioEnCursoDTO['items']): string {
  if (!items || items.length === 0) {
    return 'Sin actividades registradas.';
  }

  const lines = items
    .slice()
    .sort((a, b) => a.dia - b.dia || (a.hora ?? '').localeCompare(b.hora ?? ''))
    .map((item) => {
      const header = `• Día ${item.dia}${item.hora ? ` · ${item.hora.substring(0, 5)}` : ''} — ${item.nombreActividad}`;
      const details = [
        item.descripcion,
        item.localidad && `📍 ${item.localidad}`,
        item.direccion && `🗺️ ${item.direccion}`,
      ].filter(Boolean);
      return details.length > 0 ? [header, ...details.map((d) => `  ${d}`)].join('\n') : header;
    });

  return ['Actividades:', ...lines].join('\n');
}

export function useItineraryCalendar() {
  const [isAdding, setIsAdding] = useState(false);

  const addToCalendar = async (itinerario: ItinerarioEnCursoDTO): Promise<number> => {
    setIsAdding(true);
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Se necesita permiso para acceder al calendario.');
      }

      const calendarId = await getCalendarId();
      const { startDate, endDate } = buildItineraryEventDates(
        itinerario.fechaInicio,
        itinerario.fechaFin,
      );

      await Calendar.createEventAsync(calendarId, {
        title: itinerario.titulo,
        startDate,
        endDate,
        notes: buildActivitiesNotes(itinerario.items),
        location: itinerario.provincia,
        alarms: [{ relativeOffset: -60 }], // Recordatorio 60 min antes (nativo del calendario)
      });

      return 1;
    } finally {
      setIsAdding(false);
    }
  };

  return { addToCalendar, isAdding };
}
