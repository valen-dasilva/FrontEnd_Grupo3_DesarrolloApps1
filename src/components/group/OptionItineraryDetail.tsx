import React, { useCallback, useMemo } from 'react';
import { FlatList, Platform, Text, View } from 'react-native';
import { styles } from './OptionItineraryDetail.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { ActivityCard } from '@/components/common/ActivityCard/ActivityCard';
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

  const renderHeader = useCallback(
    () => (
      <ItineraryInfoCard
        title={title}
        categories={tagLabels}
        startDate={itinerary.fechaInicio}
        endDate={itinerary.fechaFin}
        description={description}
        image={cover}
        showBackButton={false}
        showFavoriteButton={false}
        showCategoryBadge={tagLabels.length > 0}
      />
    ),
    [title, tagLabels, itinerary.fechaInicio, itinerary.fechaFin, description, cover],
  );

  const renderItem = useCallback(
    ({ item: { day, items }, index }: { item: { day: number; items: DayItem[] }; index: number }) => {
      const isLastDay = index === itemsByDay.length - 1;
      return (
        <View
          key={day}
          style={[
            styles.dayCard,
            { backgroundColor: theme.surface },
            isLastDay && { marginBottom: 0 },
          ]}
        >
          <Text style={[styles.dayTitle, { color: theme.text }]}>Día {day}</Text>
          {items.length === 0 ? (
            <Text style={[styles.emptyDay, { color: theme.textSecondary }]}>
              Sin actividades
            </Text>
          ) : (
            items.map((item, idx) => (
              <ActivityCard
                key={item.id}
                time={item.hora ?? ''}
                title={getActivityTitle(item)}
                subtitle={getActivitySubtitle(item)}
                location={getActivityLocation(item)}
                isLast={idx === items.length - 1}
              />
            ))
          )}
        </View>
      );
    },
    [itemsByDay.length, theme.surface, theme.text, theme.textSecondary],
  );

  const keyExtractor = useCallback((item: { day: number }) => `day-${item.day}`, []);

  return (
    <FlatList
      data={itemsByDay}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      initialNumToRender={2}
      maxToRenderPerBatch={3}
      windowSize={3}
      removeClippedSubviews={Platform.OS === 'android'}
    />
  );
};
