// Pantalla de resultados de búsqueda de itinerarios.
// Recibe los resultados como parámetro de ruta (JSON serializado desde preferencias.tsx)
// y delega la presentación a los componentes de components/Recomendaciones/.

import { ExploreItineraryCard } from '@/components/Explorar/CardItinerarioExplorar';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  }>();

  const resultados: ItinerarioSistemaResumenDTO[] = params.resultados
    ? JSON.parse(params.resultados)
    : [];

  const etiquetas: CategoriaItinerario[] = params.etiquetas
    ? JSON.parse(params.etiquetas)
    : [];

  const provinciaLabel = params.provincia
    ? PROVINCIA_LABEL[params.provincia as Provincia] ?? params.provincia
    : null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header azul con destino, chips de fecha y categorías */}
      <ResultadosHeader
        provinciaLabel={provinciaLabel}
        fechaInicio={params.fechaInicio}
        fechaFin={params.fechaFin}
        etiquetas={etiquetas}
        primeraResultadoDuracion={resultados[0]?.duracionDias}
        onBack={() => router.back()}
      />

      {/* Lista de resultados o estado vacío */}
      <ScrollView
        style={[styles.lista, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.listaContenido}
        showsVerticalScrollIndicator={false}
      >
        {resultados.length === 0 ? (
          <ResultadosEmptyState onBack={() => router.back()} />
        ) : (
          resultados.map((item) => (
            <ExploreItineraryCard
              key={item.idItinerario}
              idItinerario={item.idItinerario}
              title={item.titulo}
              description={item.descripcion}
              category={item.etiquetas?.length > 0 ? CATEGORIA_LABEL[item.etiquetas[0]] : 'General'}
              image={item.fotoPortada}
              rating={item.likes.toString()}
              duration={`${item.duracionDias} ${item.duracionDias === 1 ? 'día' : 'días'}`}
              startDate={item.fechaInicio}
              endDate={item.fechaFin}
            />
          ))
        )}
      </ScrollView>
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
