import { colors } from '@/constants/colors';
import { paddings } from '@/constants/paddings';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useItinerarioDetalle } from '@/hooks/useItinerarioDetalle';
import { ItemItinerarioSistemaDTO } from '@/src/types/itinerario';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityCard } from '../../components/common/ActivityCard/ActivityCard';
import { Header } from '../../components/common/Header/Header';
import { ItineraryInfoCard } from '../../components/Explorar/Card-Itinerario-Info';
import { styles } from './itinerarioInfo.styles';

/** Convierte "HH:mm:ss" → "HH:mm" */
function formatHora(hora: string): string {
  if (!hora) return '';
  return hora.substring(0, 5);
}

export default function ItineraryInfoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    idItinerario?: string;
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

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

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.surfaceNeutral }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Header title="Explorar" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Card de la Imagen Principal */}
        <ItineraryInfoCard
          idItinerario={params.idItinerario ? Number(params.idItinerario) : undefined}
          title={params.title}
          category={params.category}
          startDate={params.startDate}
          endDate={params.endDate}
          description={params.description}
          image={params.image}
          isFavorite={params.isFavorite === 'true'}
          idFavorito={params.idFavorito ? Number(params.idFavorito) : undefined}
          onBackPress={() => router.back()}
        />

        {/* Estado de carga / error */}
        {loading && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={{ color: theme.textSecondary, marginTop: 12 }}>
              Cargando actividades...
            </Text>
          </View>
        )}

        {!loading && error && (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: theme.danger, textAlign: 'center' }}>{error}</Text>
          </View>
        )}

        {/* Cards de actividades por día */}
        {!loading && !error && dias.map((dia, diaIdx) => {
          const items = itemsPorDia[dia];
          const isLastDay = diaIdx === dias.length - 1;
          return (
            <View
              key={dia}
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
        })}

        {/* Mensaje cuando no hay actividades y la carga terminó */}
        {!loading && !error && itinerario && dias.length === 0 && (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: theme.textSecondary }}>
              Este itinerario no tiene actividades cargadas.
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}
