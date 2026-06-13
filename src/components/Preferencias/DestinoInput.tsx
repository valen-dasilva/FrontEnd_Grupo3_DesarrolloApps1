// Fila de selección de provincia en la pantalla de preferencias.
// Parece un input de texto pero en realidad abre el modal ProvinciaSelector al presionar.
// Se extrae de preferencias.tsx para mantener cada sección del formulario como unidad independiente.

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '@/hooks/useColorScheme';

interface DestinoInputProps {
  /** Texto a mostrar cuando hay una provincia seleccionada */
  value: string | undefined;
  placeholder: string;
  onPress: () => void;
  /** Se llama cuando el usuario toca la X para limpiar la selección */
  onClear: () => void;
}

export function DestinoInput({ value, placeholder, onPress, onClear }: DestinoInputProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
      <Text style={[styles.texto, { color: value ? theme.text : theme.textSecondary }]}>
        {value ?? placeholder}
      </Text>
      {value && (
        // Botón independiente para no propagar el press al TouchableOpacity padre
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  texto: {
    flex: 1,
    fontSize: 15,
  },
});
