import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './OptionItineraryDetail.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { ActivityCard } from '@/components/common/ActivityCard/ActivityCard';
import { CategoryBadge } from '@/components/common/CategoryBadge/CategoryBadge';
import { ItineraryInfoCard } from '@/components/Explorar/CardItinerarioInfo';
import {
  CATEGORIA_LABEL,
  ItemItinerarioSistemaDTO,
} from '@/types/itinerario';
import { ItemItinerarioUsuario } from '@/services/itinerariosService';
import { ItineraryOptionDetail } from '@/types/poll';
type SystemItem = ItemItinerarioSistemaDTO;
type UserItem = ItemItinerarioUsuario;
type DayItem = SystemItem | UserItem;

interface OptionItineraryDetailProps {
  itinerary: ItineraryOptionDetail;
}

function isSystemItem(item: DayItem): item is SystemItem {
  return 'actividad' in item && item.actividad !== undefined;
}

function getActivityTitle(item: DayItem): string {
  if (isSystemItem(item)) {
    return item.actividad.nombre;
  }
  return item.nombreActividad;
}

function getActivitySubtitle(item: DayItem): string {
  if (isSystemItem(item)) {
    return item.actividad.descripcion ?? '';
  }
  return item.descripcion ?? '';
}

function getActivityLocation(item: DayItem): string {
  if (isSystemItem(item)) {
    return item.actividad.localidad || item.actividad.direccion || '';
  }
  return item.localidad || item.direccion || '';
}

export const OptionItineraryDetail: React.FC<OptionItineraryDetailProps> = ({ itinerary }) => {
  const { theme } = useTheme();

  const title = itinerary.titulo;
  const description = itinerary.descripcion ?? '';
  const cover = itinerary.fotoPortada;
  const duration = itinerary.duracionDias;
  const tags = itinerary.etiquetas ?? [];

  const tagLabels = tags.map((tag) =>
    CATEGORIA_LABEL[tag as keyof typeof CATEGORIA_LABEL] ?? tag,
  );

  const itemsByDay = useMemo(() => {
    const items = itinerary.items ?? [];
    const map = new Map<number, DayItem[]>();
    items.forEach((item) => {
      const day = item.dia;
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(item as DayItem);
    });
    const totalDays = Math.max(duration ?? 1, ...Array.from(map.keys()), 1);
    return Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => ({
      day,
      items: (map.get(day) ?? []).sort((a, b) => (a.hora ?? '').localeCompare(b.hora ?? '')),
    }));
  }, [itinerary, duration]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {tagLabels.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
        >
          {tagLabels.map((label, index) => (
            <CategoryBadge key={index} category={label} />
          ))}
        </ScrollView>
      )}

      <ItineraryInfoCard
        title={title}
        startDate={itinerary.fechaInicio}
        endDate={itinerary.fechaFin}
        description={description}
        image={cover}
        showBackButton={false}
        showFavoriteButton={false}
        showCategoryBadge={false}
      />

      {itemsByDay.map(({ day, items }) => (
        <View
          key={day}
          style={[styles.dayCard, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.dayTitle, { color: theme.text }]}>Día {day}</Text>
          {items.length === 0 ? (
            <Text style={[styles.emptyDay, { color: theme.textSecondary }]}>
              Sin actividades
            </Text>
          ) : (
            items.map((item, index) => (
              <ActivityCard
                key={item.id}
                time={item.hora ?? ''}
                title={getActivityTitle(item)}
                subtitle={getActivitySubtitle(item)}
                location={getActivityLocation(item)}
                isLast={index === items.length - 1}
              />
            ))
          )}
        </View>
      ))}
    </ScrollView>
  );
};
