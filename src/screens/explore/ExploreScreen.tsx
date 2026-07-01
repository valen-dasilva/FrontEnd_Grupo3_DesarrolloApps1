import { ExploreItineraryCard } from '@/components/Explorar/CardItinerarioExplorar';
import { CategoriesCarousel } from '@/components/Explorar/FiltroCategoriasCarrusel';
import { FiltrosDeBusqueda } from '@/components/FiltrosBusqueda';
import { Header } from '@/components/common/Header/Header';

import { useTheme } from '@/hooks/useColorScheme';
import { buscarPorPreferencias } from '@/services/itinerarioService';
import { CATEGORIA_LABEL, CategoriaItinerario, ItinerarioSistemaResumenDTO, Provincia } from '@/types/itinerario';
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './ExploreScreen.styles';
import { useFavoritosHook } from '@/hooks/useFavoritos';
import { useFocusEffect } from 'expo-router';
import { AnimatedListItem } from '@/components/common/AnimatedListItem/AnimatedListItem';
import { calculateDurationDays, formatDuracion } from '@/utils/dateUtils';
import { LIST_PERF_PROPS } from '@/constants/listConfig';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [provincia, setProvincia] = useState<Provincia | undefined>();
  const [categoria, setCategoria] = useState<CategoriaItinerario | undefined>();

  const { favoritos, loadFavoritos } = useFavoritosHook();

  useFocusEffect(
    useCallback(() => {
      loadFavoritos();
    }, [loadFavoritos])
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

  let error: string | null = null;
  if (queryError instanceof Error) {
    error = queryError.message;
  } else if (queryError) {
    error = String(queryError);
  }

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

  const renderItem = useCallback(({ item, index }: { item: ItinerarioSistemaResumenDTO; index: number }) => {
    const durationText = formatDuracion(calculateDurationDays(item.fechaInicio, item.fechaFin));

    const isFavorite = favoritos.some(fav => fav.idItinerario === item.idItinerario);
    const idFavorito = undefined; // los bookmarks se operan por idItinerario del sistema

    return (
      <AnimatedListItem index={index}>
        <ExploreItineraryCard
          idItinerario={item.idItinerario}
          title={item.titulo}
          description={item.descripcion}
          category={
            item.etiquetas && item.etiquetas.length > 0
              ? CATEGORIA_LABEL[item.etiquetas[0]]
              : 'General'
          }
          categories={item.etiquetas}
          image={item.fotoPortada}
          rating={item.likes.toString()}
          duration={durationText}
          startDate={item.fechaInicio}
          endDate={item.fechaFin}
          isFavorite={isFavorite}
          idFavorito={idFavorito}
        />
      </AnimatedListItem>
    );
  }, [favoritos]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Explorar" />
      <FlatList
        data={loading || error ? [] : itineraries}
        renderItem={renderItem} //Función que recibe cada item y devuelve el componente a renderizar
        keyExtractor={(item) => String(item.idItinerario)}  //Convierte el ID del itinerario en string para usarlo como key única.
        ListHeaderComponent={renderHeader} //Componente que se renderiza al inicio de la lista
        ListEmptyComponent={renderEmptyComponent} //Se muestra cuando data está vacía
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        {...LIST_PERF_PROPS}
        initialNumToRender={4} // Explorar arranca con 4 (override del default compartido)
      />
    </View>
  );
}
