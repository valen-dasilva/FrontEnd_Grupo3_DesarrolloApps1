import { ExploreItineraryCard } from '@/components/Explorar/Card-Itinerario-Explorar';
import { CategoriesCarousel } from '@/components/Explorar/Filtro-Categorias-Carrusel';
import { FiltrosDeBusqueda } from '@/components/Filtros-de-busqueda';
import { Header } from '@/components/common/Header/Header';
import { useItinerariesCards } from '@/hooks/useCardExploreItineraryService';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './explorar.styles';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { itineraries, loading, error } = useItinerariesCards();

  if (loading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Header title="Explorar" />
        <MaterialIcons
          name="hourglass-empty"
          size={40}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Header title="Explorar" />
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header title="Explorar" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <FiltrosDeBusqueda />
        <CategoriesCarousel />

        {itineraries.map((itinerary) => (
          <ExploreItineraryCard
            title={itinerary.title}
            description={itinerary.description}
            category={itinerary.tags?.[0] ?? "General"}
            image={itinerary.photo}
            rating="5.0k"
            duration={"3 dias"}
          />
        ))}
      </ScrollView>
    </View>
  );
}