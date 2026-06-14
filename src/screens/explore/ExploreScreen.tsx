import { ExploreItineraryCard } from '@/components/Explorar/CardItinerarioExplorar';
import { CategoriesCarousel } from '@/components/Explorar/FiltroCategoriasCarrusel';
import { FiltrosDeBusqueda } from '@/components/FiltrosBusqueda';
import { Header } from '@/components/common/Header/Header';

import { useTheme } from '@/hooks/useColorScheme';
import { buscarPorPreferencias } from '@/services/itinerarioService';
import { CATEGORIA_LABEL, CategoriaItinerario, ItinerarioSistemaResumenDTO, Provincia } from '@/types/itinerario';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
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
  const [itineraries, setItineraries] = useState<ItinerarioSistemaResumenDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { listItinerarioResumen, loadItinerarios } = useFavoritosHook();

  useFocusEffect(
    useCallback(() => {
      loadItinerarios();
    }, [loadItinerarios])
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const tags = categoria ? [categoria] : undefined;

    buscarPorPreferencias({ provincia, tags })
      .then((data) => {
        if (isMounted) {
          setItineraries(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error al buscar itinerarios');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [provincia, categoria]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Explorar" />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <FiltrosDeBusqueda
          selectedProvincia={provincia}
          onProvinciaChange={setProvincia}
        />
        <CategoriesCarousel
          selectedCategory={categoria}
          onCategorySelect={setCategoria}
        />

        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ color: theme.textSecondary, marginTop: 12 }}>Cargando itinerarios...</Text>
          </View>
        ) : error ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.danger, textAlign: 'center' }}>{error}</Text>
          </View>
        ) : itineraries.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
              No se encontraron itinerarios para tu búsqueda.
            </Text>
          </View>
        ) : (
          itineraries.map((itinerary) => {
            const days = calculateDurationDays(itinerary.fechaInicio, itinerary.fechaFin);
            const durationText = `${days} ${days === 1 ? 'día' : 'días'}`;

            const matchingFav = listItinerarioResumen.find(fav => fav.idItinerarioSistema === itinerary.idItinerario);
            const isFavorite = !!matchingFav;
            const idFavorito = matchingFav?.id;

            return (
              <ExploreItineraryCard
                key={itinerary.idItinerario}
                idItinerario={itinerary.idItinerario}
                title={itinerary.titulo}
                description={itinerary.descripcion}
                category={
                  itinerary.etiquetas && itinerary.etiquetas.length > 0
                    ? CATEGORIA_LABEL[itinerary.etiquetas[0]]
                    : 'General'
                }
                image={itinerary.fotoPortada}
                rating={itinerary.likes.toString()}
                duration={durationText}
                startDate={itinerary.fechaInicio}
                endDate={itinerary.fechaFin}
                isFavorite={isFavorite}
                idFavorito={idFavorito}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
