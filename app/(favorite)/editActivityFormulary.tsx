import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header/Header';
import { EditActivityFormulary } from '../../components/favorites_components/editActivityFormulary/EditActivityFormulary';

import { styles } from './editActivityFormulary.styles';
import { useTheme } from '@/hooks/use-color-scheme';
import { useFavoritosDetailsHook } from '../../src/hooks/useFavoritos';

export default function EditActivityFormularyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const params = useLocalSearchParams<{
    idItinerario: string;
    idItem?: string;
    day: string;
    time: string;
    title: string;
    description: string;
    location: string;
  }>();

  const { editItem, newItem } = useFavoritosDetailsHook();

  const initialValues = {
    title: params.title || '',
    description: params.description || '',
    time: params.time || '',
    location: params.location || '',
  };

  const handleSave = async (updatedValues: typeof initialValues) => {
    const itemData = {
        nombreActividad: updatedValues.title,
        descripcion: updatedValues.description,
        localidad: updatedValues.location,
        direccion: updatedValues.location,
        dia: Number(params.day || '1'),
        hora: updatedValues.time,
    };

    if (params.idItem) {
        await editItem(Number(params.idItinerario), Number(params.idItem), itemData);
    } else {
        await newItem(Number(params.idItinerario), itemData);
    }

    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Editar Itinerario"
        showBackButton={false}
        onThemeTogglePress={toggleColorScheme}
        onAvatarPress={() => router.push('/(tabs)/perfil')}
      />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EditActivityFormulary
          initialValues={initialValues}
          onSave={handleSave}
          onCancel={() => router.back()}
        />
      </ScrollView>
    </View>
  );
}
