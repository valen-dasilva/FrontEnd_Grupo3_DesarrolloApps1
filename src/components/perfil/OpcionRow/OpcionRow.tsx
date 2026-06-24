import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';

interface Props {
  icono: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}

export function OpcionRow({ icono, label, onPress }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <MaterialIcons name={icono} size={20} color={theme.text} />
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={theme.gray} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
});
