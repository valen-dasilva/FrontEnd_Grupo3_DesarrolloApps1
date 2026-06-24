import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { useWeather } from '@/hooks/useWeather';
import { Coords } from '@/utils/provinciaCoords';
import { WeatherDay } from '@/utils/weatherUtils';
import { styles } from './WeatherStrip.styles';
import { colors } from '@/constants/colors';

interface WeatherStripProps {
  coords: Coords;
  fechaInicio: string;
  fechaFin: string;
}

type Theme = typeof colors.light;

function WeatherDayItem({ item, theme }: { item: WeatherDay; theme: Theme }) {
  return (
    <View style={[styles.dayItem, { backgroundColor: theme.surfaceNeutral }]}>
      <Text style={[styles.dayName, { color: theme.text }]}>{item.dayName}</Text>
      <Text style={[styles.dayMonth, { color: theme.textSecondary }]}>{item.dayMonth}</Text>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={[styles.temps, { color: theme.text }]}>{item.maxTemp}°</Text>
      <Text style={[styles.tempsMin, { color: theme.textSecondary }]}>{item.minTemp}°</Text>
    </View>
  );
}

export function WeatherStrip({ coords, fechaInicio, fechaFin }: WeatherStripProps) {
  const { theme } = useTheme();
  const { data, isLoading, isError } = useWeather({ coords, fechaInicio, fechaFin });

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      );
    }

    if (isError || !data?.available) {
      return (
        <View style={styles.unavailableContainer}>
          <Text style={[styles.unavailableText, { color: theme.textSecondary }]}>
            Clima no disponible para las fechas de este itinerario.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={data.days}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => <WeatherDayItem item={item} theme={theme} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Text style={{ fontSize: 14 }}>🌡️</Text>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Clima del viaje</Text>
      </View>
      {renderContent()}
    </View>
  );
}
