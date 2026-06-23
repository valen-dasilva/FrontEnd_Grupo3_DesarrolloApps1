import { Stack, useRouter, useLocalSearchParams, type Href } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StatusBar, Text, View, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { GuardadosTab } from '@/components/favorites/GuardadosTab/GuardadosTab';
import { MisViajesTab } from '@/components/favorites/MisViajesTab/MisViajesTab';

import { styles } from './FavoritesScreen.styles';
import { useTheme } from '@/hooks/useColorScheme';

type Vista = 'guardados' | 'misViajes';

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { vista: requestedVista } = useLocalSearchParams<{ vista?: string }>();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const [vista, setVista] = useState<Vista>(requestedVista === 'misViajes' ? 'misViajes' : 'guardados');

  // Permite abrir la pantalla en una tab concreta vía parámetro de navegación
  useEffect(() => {
    if (requestedVista === 'guardados' || requestedVista === 'misViajes') {
      setVista(requestedVista);
    }
  }, [requestedVista]);

  // Header compartido por ambas tabs: título/subtítulo según la vista, el
  // toggle de tabs y (solo en "Mis viajes") el botón de crear desde cero.
  const header = (
    <View style={styles.pageHeader}>
      <Text style={[styles.pageTitle, { color: theme.text }]}>
        {vista === 'guardados' ? 'Favoritos guardados' : 'Mis viajes'}
      </Text>
      <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
        {vista === 'guardados'
          ? 'Plantillas que guardaste. Creá una copia para personalizarla.'
          : 'Tus itinerarios propios, listos para editar y completar.'}
      </Text>

      <View style={[local.toggleRow, { backgroundColor: theme.surfaceNeutral }]}>
        <Pressable
          onPress={() => setVista('guardados')}
          style={[local.toggleBtn, vista === 'guardados' && { backgroundColor: theme.primary }]}
        >
          <Text style={[local.toggleText, { color: vista === 'guardados' ? theme.textInverse : theme.textSecondary }]}>
            Guardados
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setVista('misViajes')}
          style={[local.toggleBtn, vista === 'misViajes' && { backgroundColor: theme.primary }]}
        >
          <Text style={[local.toggleText, { color: vista === 'misViajes' ? theme.textInverse : theme.textSecondary }]}>
            Mis viajes
          </Text>
        </Pressable>
      </View>

      {vista === 'misViajes' && (
        <Pressable
          onPress={() => router.push('/(tabs)/(favorite)/crearItinerario' as Href)}
          style={[local.crearDesdeCeroBtn, { borderColor: theme.primary }]}
          accessibilityRole="button"
        >
          <MaterialIcons name="add" size={20} color={theme.primary} />
          <Text style={[local.crearDesdeCeroText, { color: theme.primary }]}>Crear itinerario desde cero</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Favoritos" onThemeTogglePress={toggleColorScheme} />

        {vista === 'guardados' ? (
          <GuardadosTab header={header} onVerMisViajes={() => setVista('misViajes')} />
        ) : (
          <MisViajesTab header={header} onVerGuardados={() => setVista('guardados')} />
        )}
      </View>
    </View>
  );
}

const local = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  crearDesdeCeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  crearDesdeCeroText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
