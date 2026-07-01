import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { MapaArgentina } from '@/components/perfil/MapaArgentina/MapaArgentina';
import { MapaInteractivoModal } from '@/components/perfil/MapaArgentina/MapaInteractivoModal';
import { LogrosViajero } from './LogrosViajero';
import { BarraProgreso } from './BarraProgreso';
import { EstadisticasUsuario } from '@/services/userService';
import { ItinerarioResumen } from '@/services/itinerariosService';
import { CATEGORIA_LABEL, CategoriaItinerario, Provincia } from '@/types/itinerario';
import { COLOR_POR_PROVINCIA } from '@/data/logros';

interface Props {
  estadisticas: EstadisticasUsuario | undefined;
  itinerarios: ItinerarioResumen[];
  isLoading?: boolean;
}

// Humaniza el código de categoría (ej. "SANTIAGO_DEL_ESTERO" -> "Santiago Del Estero").
const humanizar = (valor: string) =>
  valor
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

export function SeccionRecorrido({ estadisticas, itinerarios, isLoading }: Props) {
  const { theme } = useTheme();
  const [mapaVisible, setMapaVisible] = useState(false);

  // "Cargando" mientras la query trae los datos (o aún no hay objeto de stats).
  const cargando = isLoading || !estadisticas;

  const viajesCompletados = useMemo(
    () => itinerarios.filter(it => it.completado).length,
    [itinerarios],
  );

  const provinciaFavorita = estadisticas?.provinciaFavorita
    ? humanizar(estadisticas.provinciaFavorita)
    : null;

  // etiquetaPredominante ya viene del backend pero antes no se mostraba.
  const estiloViaje = estadisticas?.etiquetaPredominante
    ? CATEGORIA_LABEL[estadisticas.etiquetaPredominante as CategoriaItinerario] ??
      humanizar(estadisticas.etiquetaPredominante)
    : null;

  const porcentaje = estadisticas?.porcentajeArgentina ?? 0;

  // Colores regionales para el mapa: visitadas → color de su región, no visitadas → borde.
  const coloresPorProvincia = useMemo(() => {
    const visitadasSet = new Set(estadisticas?.provinciasVisitadas ?? []);
    const result: Record<string, string> = {};
    for (const prov of Object.values(Provincia)) {
      result[prov] = visitadasSet.has(prov)
        ? (COLOR_POR_PROVINCIA[prov] ?? theme.primary)
        : theme.border;
    }
    return result;
  }, [estadisticas?.provinciasVisitadas, theme.primary, theme.border]);

  // Renderiza el número de una stat-card, o un spinner mientras carga.
  const renderNumero = (valor: number, sufijo = '') =>
    cargando ? (
      <ActivityIndicator size="small" color={theme.primary} />
    ) : (
      <Text style={[styles.statNumber, { color: theme.primary }]}>
        {valor}
        {sufijo}
      </Text>
    );

  return (
    <>
      {/* Fila de métricas numéricas */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {renderNumero(estadisticas?.totalProvincias ?? 0)}
          <Text style={[styles.statLabel, { color: theme.gray }]}>Provincias</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {renderNumero(estadisticas?.diasTotalesViajados ?? 0)}
          <Text style={[styles.statLabel, { color: theme.gray }]}>Días viajados</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {renderNumero(viajesCompletados)}
          <Text style={[styles.statLabel, { color: theme.gray }]}>Viajes</Text>
        </View>
      </View>

      {/* Barra de progreso: porcentaje de Argentina explorada */}
      <View style={[styles.progresoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.progresoHeader}>
          <Text style={[styles.progresoLabel, { color: theme.text }]}>Argentina explorada</Text>
          <Text style={[styles.progresoPct, { color: theme.primary }]}>{porcentaje}%</Text>
        </View>
        <BarraProgreso
          porcentaje={cargando ? 0 : porcentaje}
          color={theme.primary}
          trackColor={theme.surfaceNeutral}
        />
      </View>

      {/* Fila de info textual: provincia favorita + estilo de viaje */}
      {!cargando && (provinciaFavorita || estiloViaje) && (
        <View style={styles.infoRow}>
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.gray }]}>Provincia favorita</Text>
            <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
              {provinciaFavorita ?? '—'}
            </Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.gray }]}>Estilo de viaje</Text>
            <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
              {estiloViaje ?? '—'}
            </Text>
          </View>
        </View>
      )}

      {/* Logros por región */}
      <LogrosViajero provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []} />

      {/* Mapa de provincias visitadas */}
      <TouchableOpacity
        style={[styles.mapaCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => setMapaVisible(true)}
        activeOpacity={0.85}
        disabled={cargando}
      >
        <View style={styles.mapaTitleRow}>
          <Text style={[styles.mapaTitle, { color: theme.text }]}>Provincias visitadas</Text>
          <MaterialIcons name="open-in-full" size={16} color={theme.gray} />
        </View>

        {cargando ? (
          <View style={styles.mapaLoading}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.mapaLoadingText, { color: theme.gray }]}>
              Cargando tu recorrido...
            </Text>
          </View>
        ) : (
          <>
            <MapaArgentina
              provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []}
              coloresPorProvincia={coloresPorProvincia}
              colorNoVisitada={theme.border}
              strokeColor={theme.background}
              height={300}
              cabaLabelColor={theme.gray}
            />
            {!estadisticas?.totalProvincias && (
              <Text style={[styles.mapaEmpty, { color: theme.gray }]}>
                Completá tus primeros viajes para ver el mapa
              </Text>
            )}
          </>
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
    minHeight: 70,
    justifyContent: 'center',
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
  progresoCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  progresoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progresoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  progresoPct: {
    fontSize: 15,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
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
  mapaLoading: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  mapaLoadingText: {
    fontSize: 13,
  },
  mapaEmpty: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
