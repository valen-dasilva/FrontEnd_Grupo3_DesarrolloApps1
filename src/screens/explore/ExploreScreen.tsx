import { ExploreItineraryCard } from '@/components/Explorar/CardItinerarioExplorar';
import { CategoriesCarousel } from '@/components/Explorar/FiltroCategoriasCarrusel';
import { FiltrosDeBusqueda } from '@/components/FiltrosBusqueda';
import { Header } from '@/components/common/Header/Header';

import { useTheme } from '@/hooks/useColorScheme';
import { buscarPorPreferencias } from '@/services/itinerarioService';
import { CATEGORIA_LABEL, CategoriaItinerario, ItinerarioSistemaResumenDTO, Provincia } from '@/types/itinerario';
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './ExploreScreen.styles';
import { useFavoritosHook } from '@/hooks/useFavoritos';
import { useFocusEffect } from 'expo-router';

function calculateDurationDays(startStr: string, endStr: string): number {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  } catch {
    return 0;
  }
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [provincia, setProvincia] = useState<Provincia | undefined>();
  const [categoria, setCategoria] = useState<CategoriaItinerario | undefined>();

  const { listItinerarioResumen, loadItinerarios } = useFavoritosHook();

  useFocusEffect(
    useCallback(() => {
      loadItinerarios();
    }, [loadItinerarios])
  );

  const {
    data: itineraries = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['exploreSearch', { provincia, categoria }],
    queryFn: () => {
      const tags = categoria ? [categoria] : undefined;
      return buscarPorPreferencias({ provincia, tags });
    },
  });

  const error = queryError instanceof Error ? queryError.message : (queryError ? String(queryError) : null);

  const renderHeader = useCallback(() => (
    <View>
      <FiltrosDeBusqueda
        selectedProvincia={provincia}
        onProvinciaChange={setProvincia}
      />
      <CategoriesCarousel
        selectedCategory={categoria}
        onCategorySelect={setCategoria}
      />
    </View>
  ), [provincia, categoria]);

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary, marginTop: 12 }}>Cargando itinerarios...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <Text style={{ color: theme.danger, textAlign: 'center' }}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={{ paddingVertical: 40, alignItems: 'center' }}>
        <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
          No se encontraron itinerarios para tu búsqueda.
        </Text>
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: ItinerarioSistemaResumenDTO }) => {
    const days = calculateDurationDays(item.fechaInicio, item.fechaFin);
    const durationText = `${days} ${days === 1 ? 'día' : 'días'}`;

    const matchingFav = listItinerarioResumen.find(fav => fav.idItinerarioSistema === item.idItinerario);
    const isFavorite = !!matchingFav;
    const idFavorito = matchingFav?.id;

    return (
      <ExploreItineraryCard
        idItinerario={item.idItinerario}
        title={item.titulo}
        description={item.descripcion}
        category={
          item.etiquetas && item.etiquetas.length > 0
            ? CATEGORIA_LABEL[item.etiquetas[0]]
            : 'General'
        }
        image={item.fotoPortada}
        rating={item.likes.toString()}
        duration={durationText}
        startDate={item.fechaInicio}
        endDate={item.fechaFin}
        isFavorite={isFavorite}
        idFavorito={idFavorito}
      />
    );
  }, [listItinerarioResumen]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Explorar" />
      <FlatList
        data={loading || error ? [] : itineraries}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.idItinerario)}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4} // Carga sólo 4 inicialmente
        maxToRenderPerBatch={5} // Carga en lotes de 5
        windowSize={3} // Mantiene poca memoria activa en la ventana virtual
        removeClippedSubviews={Platform.OS === 'android'} // Remueve vistas invisibles en Android para liberar recursos
      />
    </View>
  );
}
