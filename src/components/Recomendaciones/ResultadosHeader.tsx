// Header azul de la pantalla de recomendaciones.
// Muestra el destino buscado, chips de fechas y categorías seleccionadas.
// Se extrae de recomendaciones.tsx porque tiene bastante lógica de presentación propia
// (adapta el estilo al modo oscuro, decide qué chips mostrar y qué texto usar para la duración).

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/useColorScheme';
import { CATEGORIA_LABEL, CategoriaItinerario } from '@/types/itinerario';

const DURACION_LABEL: Record<'1' | '2-3' | '4+', string> = {
  '1': '1 día',
  '2-3': '2-3 días',
  '4+': '4+ días',
};

interface ResultadosHeaderProps {
  /** Nombre de la provincia legible (ya traducido) o null para mostrar "Argentina" */
  provinciaLabel: string | null;
  fechaInicio: string;
  fechaFin: string;
  etiquetas: CategoriaItinerario[];
  /** Duración seleccionada en preferencias; se muestra en el chip de contexto. */
  duracion?: '1' | '2-3' | '4+';
  onBack: () => void;
}

export function ResultadosHeader({
  provinciaLabel,
  fechaInicio,
  fechaFin,
  etiquetas,
  duracion,
  onBack,
}: ResultadosHeaderProps) {
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  // En dark mode el header usa el color de superficie en lugar del azul fuerte
  const headerBg = isDark ? theme.surface : '#2F65E3';

  return (
    <View style={[
      styles.header,
      {
        backgroundColor: headerBg,
        borderBottomWidth: isDark ? 1 : 0,
        borderBottomColor: theme.border,
      },
    ]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="arrow-back" size={20} color={isDark ? theme.primary : '#FFFFFF'} />
      </TouchableOpacity>

      <View style={styles.contenido}>
        <Text style={[styles.labelSuperior, isDark && { color: theme.textSecondary }]}>
          RESULTADOS PARA
        </Text>
        <Text style={[styles.titulo, isDark && { color: theme.text }]}>
          {provinciaLabel ?? 'Argentina'}
        </Text>

        {/* Fila de chips de contexto (duración y/o categorías) */}
        <View style={styles.chipsRow}>
          {/* Chip de duración elegida en preferencias. */}
          {duracion && (
            <View style={[styles.chip, isDark && { backgroundColor: '#2A303D' }]}>
              <Ionicons name="calendar-outline" size={12} color="#FFFFFF" />
              <Text style={styles.chipTexto}>{DURACION_LABEL[duracion]}</Text>
            </View>
          )}

          {/* Chip de categorías, solo si el usuario seleccionó al menos una */}
          {etiquetas.length > 0 && (
            <View style={[styles.chip, isDark && { backgroundColor: '#2A303D' }]}>
              <Ionicons name="pricetag-outline" size={12} color="#FFFFFF" />
              <Text style={styles.chipTexto}>
                {etiquetas.map((e) => CATEGORIA_LABEL[e]).join(' y ')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backBtn: {
    marginTop: 4,
  },
  contenido: {
    flex: 1,
  },
  labelSuperior: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 2,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  chipTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
