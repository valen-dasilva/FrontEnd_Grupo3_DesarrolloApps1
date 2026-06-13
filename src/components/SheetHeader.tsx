import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';


interface SheetHeaderProps {
  title?: string;
  subtitle?: string;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ title, subtitle }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.sheetHeader}>
      {title && <Text style={[styles.sheetTitle, { color: theme.text }]}>{title}</Text>}
      {subtitle && <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  sheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
