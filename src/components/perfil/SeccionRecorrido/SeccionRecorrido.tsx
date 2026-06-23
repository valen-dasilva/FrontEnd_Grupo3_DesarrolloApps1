import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { MapaArgentina } from '@/components/perfil/MapaArgentina/MapaArgentina';
import { MapaInteractivoModal } from '@/components/perfil/MapaArgentina/MapaInteractivoModal';
import { EstadisticasUsuario } from '@/services/userService';
import { ItinerarioResumen } from '@/services/itinerariosService';

interface Props {
  estadisticas: EstadisticasUsuario | undefined;
  itinerarios: ItinerarioResumen[];
}

export function SeccionRecorrido({ estadisticas, itinerarios }: Props) {
  const { theme } = useTheme();
  const [mapaVisible, setMapaVisible] = useState(false);

  const provinciaFavorita = estadisticas?.provinciaFavorita
    ?.replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>
            {estadisticas?.totalProvincias ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Provincias</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>
            {estadisticas?.diasTotalesViajados ?? 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Días viajados</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>
            {estadisticas?.porcentajeArgentina ?? 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.gray }]}>De Argentina</Text>
        </View>
      </View>

      {provinciaFavorita && (
        <View style={[styles.favCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.favLabel, { color: theme.gray }]}>Provincia favorita</Text>
          <Text style={[styles.favValue, { color: theme.text }]}>{provinciaFavorita}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.mapaCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => setMapaVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.mapaTitleRow}>
          <Text style={[styles.mapaTitle, { color: theme.text }]}>Provincias visitadas</Text>
          <MaterialIcons name="open-in-full" size={16} color={theme.gray} />
        </View>
        <MapaArgentina
          provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []}
          colorVisitada={theme.primary}
          colorNoVisitada={theme.border}
          strokeColor={theme.background}
          height={300}
        />
        {!estadisticas?.totalProvincias && (
          <Text style={[styles.mapaEmpty, { color: theme.gray }]}>
            Completá tus primeros viajes para ver el mapa
          </Text>
        )}
      </TouchableOpacity>

      <MapaInteractivoModal
        visible={mapaVisible}
        onClose={() => setMapaVisible(false)}
        provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []}
        itinerarios={itinerarios}
      />
    </>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  favCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginBottom: 12,
  },
  favLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  favValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  mapaCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  mapaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  mapaTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapaEmpty: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
