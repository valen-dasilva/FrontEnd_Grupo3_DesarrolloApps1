import { useState } from 'react';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import { ItinerarioEnCursoDTO } from '@/types/itinerario';
import { PROVINCIA_LABEL, Provincia } from '@/types/itinerario';

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

function buildEventDates(fechaInicio: string, dia: number, hora?: string) {
  const startDate = new Date(`${fechaInicio}T00:00:00`);
  startDate.setDate(startDate.getDate() + (dia - 1));

  if (hora) {
    const [h, m] = hora.split(':').map(Number);
    startDate.setHours(h, m, 0, 0);
  } else {
    startDate.setHours(9, 0, 0, 0); // Sin hora → 9am por defecto
  }

  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1h de duración
  return { startDate, endDate };
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
      let added = 0;

      for (const item of itinerario.items) {
        const { startDate, endDate } = buildEventDates(
          itinerario.fechaInicio,
          item.dia,
          item.hora,
        );

        const notes = [
          item.descripcion,
          item.localidad && `📍 ${item.localidad}`,
          item.direccion && `🗺️ ${item.direccion}`,
        ]
          .filter(Boolean)
          .join('\n');

        await Calendar.createEventAsync(calendarId, {
          title: item.nombreActividad,
          startDate,
          endDate,
          notes: notes || undefined,
          location: item.direccion ?? item.localidad,
          alarms: [{ relativeOffset: -60 }], // Recordatorio 60 min antes (nativo del calendario)
        });

        added++;
      }

      return added;
    } finally {
      setIsAdding(false);
    }
  };

  return { addToCalendar, isAdding };
}