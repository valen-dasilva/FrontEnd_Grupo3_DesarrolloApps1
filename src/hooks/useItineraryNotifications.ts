import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ItinerarioEnCursoDTO } from '@/types/itinerario';

const CHANNEL_ID = 'itinerary-activities';
const NOTIF_PREFIX = 'activity-'; // Para identificar y cancelar solo las nuestras

async function setupAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Actividades del itinerario',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}


// Construye la Date real de una actividad: fechaInicio + offset de día + hora
function buildActivityDate(fechaInicio: string, dia: number, hora: string): Date {
  const date = new Date(`${fechaInicio}T00:00:00`);
  date.setDate(date.getDate() + (dia - 1));
  const [h, m] = hora.split(':').map(Number);
  date.setHours(h, m, 0, 0);
  return date;
}

export function useItineraryNotifications(itinerario: ItinerarioEnCursoDTO | null) {
    const itemsKey = itinerario?.items
        ?.map(i => `${i.id}:${i.hora ?? ''}`)
        .join('|') ?? '';

    useEffect(() => {
        if (!itinerario) return;

        let cancelled = false;

        const scheduleAll = async () => {
        await setupAndroidChannel();

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        // Cancelar notificaciones previas del itinerario (sin tocar otras de la app)
        const existing = await Notifications.getAllScheduledNotificationsAsync();
        await Promise.all(
            existing
            .filter(n => n.identifier.startsWith(NOTIF_PREFIX))
            .map(n => Notifications.cancelScheduledNotificationAsync(n.identifier))
        );

        if (cancelled) return;

        const now = new Date();

        for (const item of itinerario.items) {
            if (!item.hora) continue; // Sin hora no podemos programar

            const activityStart = buildActivityDate(itinerario.fechaInicio, item.dia, item.hora);
            const triggerAt = new Date(activityStart.getTime() - 60 * 60 * 1000); // 1h antes

            if (triggerAt <= now) continue; // Ya pasó, no la programamos

            await Notifications.scheduleNotificationAsync({
            identifier: `${NOTIF_PREFIX}${item.id}`,
            content: {
                title: '⏰ Próxima actividad en 1 hora',
                body: item.nombreActividad,
                data: {
                idItinerario: itinerario.idItinerarioUsuario,
                idItem: item.id,
                },
                ...(Platform.OS === 'android' && { channelId: CHANNEL_ID }),
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerAt,
            },
            });
        }
        };

        scheduleAll().catch(console.error);

        return () => { cancelled = true; }; // Cleanup si el componente se desmonta
  }, [itinerario?.idItinerarioUsuario, itemsKey]); // Solo re-programa si cambia el itinerario
}