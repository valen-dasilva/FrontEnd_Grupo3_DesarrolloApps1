// Estado vacío de la pantalla de recomendaciones cuando no hay resultados para los filtros.
// Se extrae de recomendaciones.tsx para que el condicional de la lista sea más limpio.
// No reutiliza el EmptyState de favoritos porque ese tiene ícono hardcodeado (bookmark)
// y no soporta dark mode — este es más simple y específico para el contexto de búsqueda.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/useColorScheme';

export interface ResultadosEmptyStateProps {
  /** Vuelve a la pantalla de preferencias para que el usuario ajuste los filtros */
  onBack: () => void;
  /** Duración seleccionada en preferencias, para personalizar el mensaje */
  duracion?: '1' | '2-3' | '4+';
}

export function ResultadosEmptyState({ onBack, duracion }: ResultadosEmptyStateProps) {
  const { theme } = useTheme();

  const subtitulo = (() => {
    if (duracion === '1') {
      return 'No hay itinerarios de 1 día. Probá con otra duración.';
    }
    if (duracion === '2-3') {
      return 'No hay itinerarios de 2-3 días. Probá con otra duración.';
    }
    if (duracion === '4+') {
      return 'No hay itinerarios de 4 o más días. Probá con otra duración.';
    }
    return 'Probá con otros filtros o fechas distintas.';
  })();

  return (
    <View style={styles.contenedor}>
      <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
      <Text style={[styles.titulo, { color: theme.text }]}>Sin resultados</Text>
      <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
        {subtitulo}
      </Text>
      <TouchableOpacity
        style={[styles.boton, { backgroundColor: theme.primary }]}
        onPress={onBack}
      >
        <Text style={styles.botonTexto}>Volver a preferencias</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
  },
  boton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
