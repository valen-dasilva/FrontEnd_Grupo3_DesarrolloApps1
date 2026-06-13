// Selector de rango de fechas para la pantalla de preferencias.
// Muestra dos tabs (INICIO / FINAL) que al presionar abren el modal CalendarioViaje.
// Se extrae de preferencias.tsx para que la sección de fechas sea una unidad independiente.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/useColorScheme';
import { formatFecha } from '@/utils/dateUtils';

interface FechaRangeSelectorProps {
  fechaInicio?: string;
  fechaFin?: string;
  /** Abre el modal de calendario */
  onPress: () => void;
  /** Limpia ambas fechas seleccionadas */
  onClear: () => void;
}

export function FechaRangeSelector({ fechaInicio, fechaFin, onPress, onClear }: FechaRangeSelectorProps) {
  const { theme } = useTheme();

  const hayFechas = Boolean(fechaInicio || fechaFin);

  return (
    <View style={styles.contenedor}>
      {/* Las dos tabs comparten el mismo TouchableOpacity para abrir el calendario */}
      <TouchableOpacity
        style={[styles.fechasRow, { backgroundColor: theme.primary }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Tab de fecha de inicio */}
        <View style={[styles.tab, { backgroundColor: theme.primary }]}>
          <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
          <Text style={styles.tabTexto}>
            {fechaInicio ? formatFecha(fechaInicio) : 'INICIO'}
          </Text>
        </View>

        {/* Tab de fecha de fin */}
        <View style={[styles.tab, { backgroundColor: theme.primary }]}>
          <Text style={styles.tabTexto}>
            {fechaFin ? formatFecha(fechaFin) : 'FINAL'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* El link de limpiar solo aparece si hay al menos una fecha cargada */}
      {hayFechas && (
        <TouchableOpacity onPress={onClear}>
          <Text style={[styles.limpiar, { color: theme.primary }]}>Limpiar fechas</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 0,
  },
  fechasRow: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  tabTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  limpiar: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'right',
  },
});
