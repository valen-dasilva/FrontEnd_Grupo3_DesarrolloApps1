import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';

interface Props {
  titulo: string;
  onCerrar: () => void;
}

export function HeaderModal({ titulo, onCerrar }: Props) {
  const { theme } = useTheme();

  return (
    <View style={[styles.barraHeader, { borderBottomColor: theme.border }]}>
      <Text style={[styles.tituloHeader, { color: theme.text }]}>{titulo}</Text>
      <TouchableOpacity onPress={onCerrar} style={styles.botonCerrar}>
        <MaterialIcons name="close" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  barraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  tituloHeader: { fontSize: 17, fontWeight: '700' },
  botonCerrar: { padding: 4 },
});
