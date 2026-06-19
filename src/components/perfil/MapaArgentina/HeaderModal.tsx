import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  titulo: string;
  onCerrar: () => void;
  theme: Record<string, string>;
}

export function HeaderModal({ titulo, onCerrar, theme }: Props) {
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
