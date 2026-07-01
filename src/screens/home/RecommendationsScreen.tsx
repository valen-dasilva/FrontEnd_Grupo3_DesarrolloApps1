// Pantalla de resultados de búsqueda de itinerarios.
// Recibe los resultados como parámetro de ruta (JSON serializado desde preferencias.tsx)
// y delega la presentación a los componentes de components/Recomendaciones/.

import { ExploreItineraryCard } from '@/components/Explorar/CardItinerarioExplorar';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CATEGORIA_LABEL,
  CategoriaItinerario,
  ItinerarioSistemaResumenDTO,
  Provincia,
  PROVINCIA_LABEL,
} from '@/types/itinerario';
import { useTheme } from '@/hooks/useColorScheme';

import { ResultadosHeader } from '@/components/Recomendaciones/ResultadosHeader';
import { ResultadosEmptyState } from '@/components/Recomendaciones/ResultadosEmptyState';

export default function RecomendacionesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();


  // Los datos vienen serializados como JSON desde preferencias.tsx vía router.push params
  const params = useLocalSearchParams<{
    resultados: string;
    provincia: string;
    etiquetas: string;
    fechaInicio: string;
    fechaFin: string;
    duracion: '1' | '2-3' | '4+' | '';
  }>();

  const resultados: ItinerarioSistemaResumenDTO[] = useMemo(
    () => (params.resultados ? JSON.parse(params.resultados) : []),
    [params.resultados]
  );

  const etiquetas: CategoriaItinerario[] = useMemo(
    () => (params.etiquetas ? JSON.parse(params.etiquetas) : []),
    [params.etiquetas]
  );

  const provinciaLabel = params.provincia
    ? PROVINCIA_LABEL[params.provincia as Provincia] ?? params.provincia
    : null;

  const renderResultado = useCallback(({ item }: { item: ItinerarioSistemaResumenDTO }) => (
    <ExploreItineraryCard
      idItinerario={item.idItinerario}
      title={item.titulo}
      description={item.descripcion}
      category={item.etiquetas?.length > 0 ? CATEGORIA_LABEL[item.etiquetas[0]] : 'General'}
      categories={item.etiquetas}
      image={item.fotoPortada}
      rating={item.likes.toString()}
      duration={`${item.duracionDias} ${item.duracionDias === 1 ? 'día' : 'días'}`}
      startDate={item.fechaInicio}
      endDate={item.fechaFin}
    />
  ), []);

  const renderHeader = useCallback(() => (
    <ResultadosHeader
      provinciaLabel={provinciaLabel}
      fechaInicio={params.fechaInicio}
      fechaFin={params.fechaFin}
      etiquetas={etiquetas}
      primeraResultadoDuracion={resultados[0]?.duracionDias}
      onBack={() => router.back()}
    />
  ), [provinciaLabel, params.fechaInicio, params.fechaFin, etiquetas, resultados, router]);

  const renderEmpty = useCallback(() => (
    <ResultadosEmptyState
      onBack={() => router.back()}
      duracion={params.duracion || undefined}
    />
  ), [router, params.duracion]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={resultados}
        renderItem={renderResultado}
        keyExtractor={(item) => String(item.idItinerario)}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        style={[styles.lista, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.listaContenido}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  lista: {
    flex: 1,
  },
  listaContenido: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
});
