import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';

export type DuracionRango = '1' | '2-3' | '4+' | undefined;

export interface DuracionOption {
  label: string;
  value: DuracionRango;
}

const OPCIONES_DURACION: DuracionOption[] = [
  { label: '🤷', value: undefined },
  { label: '1 Día', value: '1' },
  { label: '2-3 Días', value: '2-3' },
  { label: '4+ Días', value: '4+' },
];

interface DuracionCarouselProps {
  seleccionada: DuracionRango;
  onSelect: (value: DuracionRango) => void;
  titulo?: string;
  subtitulo?: string;
}

export function DuracionCarousel({
  seleccionada,
  onSelect,
  titulo = '¿Cuántos días?',
  subtitulo = 'Selecciona la duración ideal para tu viaje',
}: DuracionCarouselProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.seccion}>
      <Text style={[styles.pregunta, { color: theme.text }]}>{titulo}</Text>
      {subtitulo && (
        <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
          {subtitulo}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {OPCIONES_DURACION.map((opcion, index) => {
          const esActiva = seleccionada === opcion.value;
          const cardBg = esActiva ? theme.categorySelected : theme.surface;
          const cardBorder = esActiva ? theme.primary : theme.border;
          const labelColor = esActiva ? theme.primary : theme.text;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
              onPress={() => onSelect(opcion.value)}
              activeOpacity={0.75}
            >
              <Text style={[styles.label, { color: labelColor }]}>
                {opcion.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  seccion: {
    marginTop: 28,
  },
  pregunta: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 13,
    marginTop: -6,
    marginBottom: 14,
  },
  scrollContainer: {
    paddingRight: 20,
    gap: 10,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
