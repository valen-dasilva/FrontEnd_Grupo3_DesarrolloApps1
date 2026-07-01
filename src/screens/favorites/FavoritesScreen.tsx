import { Stack, useRouter, useLocalSearchParams, type Href } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { GuardadosTab } from '@/components/favorites/GuardadosTab/GuardadosTab';
import { MisViajesTab } from '@/components/favorites/MisViajesTab/MisViajesTab';
import { CompletadosTab } from '@/components/favorites/CompletadosTab/CompletadosTab';
import { FavoritosHeader, type Vista } from '@/components/favorites/FavoritosHeader/FavoritosHeader';
import { useTheme } from '@/hooks/useColorScheme';

const isVista = (vista?: string): vista is Vista =>
  vista === 'guardados' || vista === 'misViajes' || vista === 'completados';

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { vista: requestedVista } = useLocalSearchParams<{ vista?: string }>();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const [vista, setVista] = useState<Vista>(isVista(requestedVista) ? requestedVista : 'guardados');

  // Permite abrir la pantalla en una tab concreta vía parámetro de navegación
  useEffect(() => {
    if (isVista(requestedVista)) {
      setVista(requestedVista);
    }
  }, [requestedVista]);

  // El header se pasa a cada tab como ListHeaderComponent para que scrollee
  // junto con la lista. Su estado (vista) y acciones viven acá, en el coordinador.
  const header = (
    <FavoritosHeader
      vista={vista}
      onChangeVista={setVista}
      onCrearDesdeCero={() => router.push('/(tabs)/(favorite)/crearItinerario' as Href)}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Favoritos" onThemeTogglePress={toggleColorScheme} />

        {vista === 'guardados' && (
          <GuardadosTab header={header} onVerMisViajes={() => setVista('misViajes')} />
        )}
        {vista === 'misViajes' && (
          <MisViajesTab header={header} onVerGuardados={() => setVista('guardados')} />
        )}
        {vista === 'completados' && (
          <CompletadosTab header={header} onVerMisViajes={() => setVista('misViajes')} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
