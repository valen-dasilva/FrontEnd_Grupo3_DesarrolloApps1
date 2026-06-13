// Tarjeta individual de categoría en la pantalla de preferencias.
// Se extrae de preferencias.tsx para que CategoriaGrid sea más legible
// y para mantener la lógica de colores activo/inactivo en un solo lugar.

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '@/hooks/useColorScheme';
import { CategoriaItinerario, CATEGORIA_LABEL } from '@/types/itinerario';

interface CategoriaCardProps {
  value: CategoriaItinerario;
  /** Función que recibe el color del ícono y devuelve el nodo React */
  icon: (color: string) => React.ReactNode;
  activa: boolean;
  onPress: () => void;
}

export function CategoriaCard({ value, icon, activa, onPress }: CategoriaCardProps) {
  const { theme } = useTheme();

  // Colores que cambian según si la categoría está seleccionada y el modo de color
  const cardBg = activa ? theme.categorySelected : theme.surface;
  const cardBorder = activa ? theme.primary : theme.border;
  const labelColor = activa ? theme.primary : theme.text;
  const iconColor = activa ? theme.primary : theme.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon(iconColor)}
      <Text style={[styles.label, { color: labelColor }]}>
        {CATEGORIA_LABEL[value]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
