// Estado vacío de la pantalla de recomendaciones cuando no hay resultados para los filtros.
// Se extrae de recomendaciones.tsx para que el condicional de la lista sea más limpio.
// No reutiliza el EmptyState de favoritos porque ese tiene ícono hardcodeado (bookmark)
// y no soporta dark mode — este es más simple y específico para el contexto de búsqueda.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ResultadosEmptyStateProps {
  /** Vuelve a la pantalla de preferencias para que el usuario ajuste los filtros */
  onBack: () => void;
}

export function ResultadosEmptyState({ onBack }: ResultadosEmptyStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.contenedor}>
      <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
      <Text style={[styles.titulo, { color: theme.text }]}>Sin resultados</Text>
      <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
        Probá con otros filtros o fechas distintas.
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
