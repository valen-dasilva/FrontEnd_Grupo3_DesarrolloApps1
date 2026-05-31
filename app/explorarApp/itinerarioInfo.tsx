import { paddings } from '@/constants/paddings';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header/Header';
import { ItineraryInfoCard } from '../../components/Explorar/Card-Itinerario-Info';
import { ActivityCard } from '../../components/common/ActivityCard/ActivityCard';
import { styles } from './itinerarioInfo.styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

export default function ItineraryInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.surfaceNeutral }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Header title="Explorar" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Card de la Imagen Principal */}
        <ItineraryInfoCard onBackPress={() => router.back()} />

        {/* Card del Día 1 */}
        <View style={[styles.dayCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.dayTitle, { color: theme.text }]}>Dia 1</Text>

          <ActivityCard
            time="00:00"
            title="Llegada y Check-in"
            subtitle="Restaurante Local"
            location="Ubicacion"
          />
          <ActivityCard
            time="00:00"
            title="Llegada y Check-in"
            subtitle="Restaurante Local"
            location="Ubicacion"
          />
          <ActivityCard
            time="00:00"
            title="Llegada y Check-in"
            subtitle="Restaurante Local"
            location="Ubicacion"
            isLast={true}
          />
        </View>

        {/* Day 2 card */}
        <View style={[styles.dayCard, { backgroundColor: theme.surface, marginBottom: paddings.spacing.huge }]}>
          <Text style={[styles.dayTitle, { color: theme.text }]}>Dia 2</Text>

          <ActivityCard
            time="00:00"
            title="Llegada y Check-in"
            subtitle="Restaurante Local"
            location="Ubicacion"
          />
          <ActivityCard
            time="00:00"
            title="Llegada y Check-in"
            subtitle="Restaurante Local"
            location="Ubicacion"
          />
          <ActivityCard
            time="00:00"
            title="Llegada y Check-in"
            subtitle="Restaurante Local"
            location="Ubicacion"
            isLast={true}
          />
        </View>

      </ScrollView>
    </View>
  );
}
