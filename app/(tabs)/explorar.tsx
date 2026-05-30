import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExploreItineraryCard } from '@/components/Explorar/Card-Itinerario-Explorar';
import { CategoriesCarousel } from '@/components/Explorar/Filtro-Categorias-Carrusel';
import { FiltrosDeBusqueda } from '@/components/Filtros-de-busqueda';
import { Header } from '@/components/common/Header/Header';
import TeatroColonIcon from '../../assets/images/Imagen-Teatro-Colon.svg';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';
import { styles } from './explorar.styles';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Explorar" />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        <FiltrosDeBusqueda />
        <CategoriesCarousel />

        <ExploreItineraryCard
          title="Teatro Colón"
          description="Visita guiada por el emblemático Teatro Colón, descubriendo su historia, arquitectura y secretos detrás del escenario."
          category="Cultura"
          image={<TeatroColonIcon width="100%" height={180} preserveAspectRatio="xMidYMid slice" />}
          rating="5.0k"
          duration="3 dias"
        />
      </ScrollView>
    </View>
  );
}
