import { paddings } from '@/constants/paddings';
import { useTheme } from '@/hooks/useColorScheme';
import { useItinerarioDetalle } from '@/hooks/useItinerarioDetalle';
import { ItemItinerarioSistemaDTO, Provincia, CATEGORIA_LABEL } from '@/types/itinerario';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View, Platform } from 'react-native';
import { ActivityCard } from '@/components/common/ActivityCard/ActivityCard';
import { Header } from '@/components/common/Header/Header';
import { ItineraryInfoCard } from '@/components/Explorar/CardItinerarioInfo';
import { styles } from './ExploreItineraryDetailScreen.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WeatherStrip } from '@/components/common/WeatherStrip/WeatherStrip';
import { PROVINCIA_COORDS } from '@/utils/provinciaCoords';
import { formatHora } from '@/utils/dateUtils';

export default function ItinerarioInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    idItinerario: string;
    title?: string;
    image?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    isFavorite?: string;
    idFavorito?: string;
  }>();

  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const itinerarioId = params.idItinerario ? Number(params.idItinerario) : null;
  const { itinerario, loading, error } = useItinerarioDetalle(itinerarioId);

  // Agrupa los items por día: { 1: [...], 2: [...], ... }
  const itemsPorDia = useMemo(() => {
    if (!itinerario?.items) return {};
    return itinerario.items.reduce<Record<number, ItemItinerarioSistemaDTO[]>>((acc, item) => {
      const dia = item.dia;
      if (!acc[dia]) acc[dia] = [];
      acc[dia].push(item);
      return acc;
    }, {});
  }, [itinerario]);

  const dias = Object.keys(itemsPorDia)
    .map(Number)
    .sort((a, b) => a - b);

  const weatherCoords = useMemo(() => {
    const prov = itinerario?.provincia as Provincia | undefined;
    return prov ? PROVINCIA_COORDS[prov] ?? null : null;
  }, [itinerario?.provincia]);

  const detailCategories = useMemo(() => {
    if (itinerario?.etiquetas) {
      return itinerario.etiquetas.map((e) => CATEGORIA_LABEL[e] || e);
    }
    return params.category ? [params.category] : [];
  }, [itinerario?.etiquetas, params.category]);

  const renderHeader = useCallback(() => (
    <>
      <ItineraryInfoCard
        idItinerario={params.idItinerario ? Number(params.idItinerario) : undefined}
        title={params.title}
        category={params.category}
        categories={detailCategories}
        startDate={params.startDate}
        endDate={params.endDate}
        description={params.description}
        image={params.image}
        isFavorite={params.isFavorite === 'true'}
        idFavorito={params.idFavorito ? Number(params.idFavorito) : undefined}
        onBackPress={() => router.back()}
      />
      {weatherCoords && params.startDate && params.endDate && (
        <WeatherStrip
          coords={weatherCoords}
          fechaInicio={params.startDate}
          fechaFin={params.endDate}
        />
      )}
    </>
  ), [params, router, weatherCoords, detailCategories]);

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.emptyLoadingText, { color: theme.textSecondary }]}>
            Cargando actividades...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.danger }]}>{error}</Text>
        </View>
      );
    }

    if (itinerario && dias.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Este itinerario no tiene actividades cargadas.
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderItem = useCallback(({ item: dia, index }: { item: number; index: number }) => {
    const items = itemsPorDia[dia] || [];
    const isLastDay = index === dias.length - 1;
    return (
      <View
        style={[
          styles.dayCard,
          { backgroundColor: theme.surface },
          isLastDay && { marginBottom: paddings.spacing.huge },
        ]}
      >
        <Text style={[styles.dayTitle, { color: theme.text }]}>Día {dia}</Text>

        {items.map((item, idx) => (
          <ActivityCard
            key={item.id}
            time={formatHora(item.hora)}
            title={item.actividad.nombre}
            subtitle={item.actividad.localidad}
            location={item.actividad.direccion}
            isLast={idx === items.length - 1}
          />
        ))}
      </View>
    );
  }, [itemsPorDia, dias, theme]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.surfaceNeutral }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Header title="Explorar" />

      <FlatList
        data={loading || error ? [] : dias}
        renderItem={renderItem}
        keyExtractor={(dia) => `day-${dia}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        style={{ backgroundColor: theme.surfaceNeutral }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}
