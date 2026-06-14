import { Stack, useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { FlatList, StatusBar, Text, View, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Header } from '@/components/common/Header/Header';
import { ItineraryCard } from '@/components/favorites/favorite_principal/ItineraryCard/ItineraryCard';
import { EmptyState } from '@/components/favorites/favorite_principal/EmptyState/EmptyState';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';

import { styles } from './FavoritesScreen.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { useFavoritosHook } from '@/hooks/useFavoritos';
import { ItinerarioResumen } from '@/services/favoritosService';

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const {
    listItinerarioResumen,
    isLoading,
    quitItineraryFromFavs,
    togglePin,
    downloadedIds,
    downloadItinerary,
    removeDownload,
    loadItinerarios
  } = useFavoritosHook();

  useFocusEffect(
    useCallback(() => {
      loadItinerarios();
    }, [loadItinerarios])
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleToggleFavorite = useCallback((id: number) => {
    setConfirmDeleteId(id);
  }, []);

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      quitItineraryFromFavs(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleTogglePin = useCallback((id: number) => {
    togglePin(id);
  }, [togglePin]);

  const handleToggleDownload = useCallback((id: number) => {
    const isDownloaded = downloadedIds.includes(id);
    const itinerary = listItinerarioResumen.find(i => i.id === id);
    if (!itinerary) return;

    if (isDownloaded) {
      removeDownload(id).then(() => {
        Toast.show({
          type: 'info',
          text1: 'Descarga eliminada',
          text2: 'El itinerario ya no estará disponible offline.',
        });
      });
    } else {
      downloadItinerary(itinerary).then(() => {
        Toast.show({
          type: 'success',
          text1: '¡Descarga completa!',
          text2: 'El itinerario ya está disponible offline.',
        });
      });
    }
  }, [downloadedIds, listItinerarioResumen, downloadItinerary, removeDownload]);

  const renderHeader = useCallback(() => (
    <View style={styles.pageHeader}>
      <Text style={[styles.pageTitle, { color: theme.text }]}>Mis Favoritos</Text>
      <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
        Tus itinerarios guardados para futuras aventuras.
      </Text>
    </View>
  ), [theme]);

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />;
    }
    return (
      <View style={styles.emptyStateContainer}>
        <EmptyState
          title="Aún no tienes favoritos"
          description="Explora destinos increíbles y guarda los itinerarios que más te gusten para tenerlos siempre a mano."
          actionLabel="Ir a Explorar"
          onActionPress={() => router.push('/explorar')}
        />
      </View>
    );
  };

  const renderItem = useCallback(({ item: itinerary }: { item: ItinerarioResumen }) => (
    <ItineraryCard
      title={itinerary.titulo}
      location={itinerary.provincia}
      duration={`${itinerary.duracionDias} Días`}
      imageUrl={itinerary.fotoPortada}
      isOfflineAvailable={downloadedIds.includes(itinerary.id)}
      isFavorite={true}
      isPinned={itinerary.esPinned}
      onPressDetail={() => router.push({
        pathname: '/(tabs)/(favorite)/itinerarioInfoFav',
        params: {
          id: String(itinerary.id),
          titulo: itinerary.titulo,
          provincia: itinerary.provincia,
          duracionDias: String(itinerary.duracionDias),
          fotoPortada: itinerary.fotoPortada,
          fechaInicio: itinerary.fechaInicio,
          fechaFin: itinerary.fechaFin,
          etiquetas: itinerary.etiquetas?.join(','),
        }
      })}
      onFavoriteToggle={() => handleToggleFavorite(itinerary.id)}
      onPinPress={() => handleTogglePin(itinerary.id)}
      onDownloadPress={() => handleToggleDownload(itinerary.id)}
    />
  ), [downloadedIds, router, handleToggleFavorite, handleTogglePin, handleToggleDownload]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Favoritos"
          onThemeTogglePress={toggleColorScheme}
        />

        <FlatList
          data={isLoading ? [] : listItinerarioResumen}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          style={[styles.scrollView, { backgroundColor: theme.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={3}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      </View>

      <ConfirmAlert
        visible={confirmDeleteId !== null}
        title="Quitar de favoritos"
        message="¿Estás seguro de que deseas quitar este itinerario de tus favoritos?"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        confirmText="Quitar"
      />
    </View>
  );
}
