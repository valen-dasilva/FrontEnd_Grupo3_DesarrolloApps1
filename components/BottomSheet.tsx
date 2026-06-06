import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

interface BottomSheetProps extends ViewProps {
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ children, style, ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    width: '100%',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    paddingBottom: 40, // Espacio extra para que no quede pegado al borde inferior
  },
});
