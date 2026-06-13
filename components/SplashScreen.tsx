import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-color-scheme';

import { HeaderLogo } from './HeaderLogo';

// La navegación inicial (a /login o /(tabs)) la decide el guard del layout
// según haya o no sesión guardada. Esta pantalla solo muestra el branding con el tema adecuado.
export const SplashScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      <HeaderLogo largeLogo />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
