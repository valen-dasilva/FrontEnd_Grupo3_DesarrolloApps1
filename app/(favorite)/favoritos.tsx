import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header/Header';
import { ItineraryCard } from '../../components/favorites_components/favorite_principal/ItineraryCard/ItineraryCard';
import { EmptyState } from '../../components/favorites_components/favorite_principal/EmptyState/EmptyState';
import { ConfirmAlert } from '../../components/common/ConfirmAlert/ConfirmAlert';
import { colors } from '../../constants/colors';
import { styles } from './favoritos.styles';
import { useTheme } from '@/hooks/use-color-scheme';
import { useFavoritosHook } from '../../src/hooks/favoritosHook';

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const {
    listItinerarioResumen,
    isLoading,
    quitItineraryFromFavs
  } = useFavoritosHook();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleToggleFavorite = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      quitItineraryFromFavs(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleTogglePin = (_id: number) => {
    // por ahora no implementado
  };

  const handleToggleDownload = (_id: number) => {
    // por ahora no implementado
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title="Favoritos"
          onThemeTogglePress={toggleColorScheme}
          onAvatarPress={() => console.log('Navigate to profile settings')}
        />

        <ScrollView
          style={[styles.scrollView, { backgroundColor: theme.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageHeader}>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Mis Favoritos</Text>
            <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
              Tus itinerarios guardados para futuras aventuras.
            </Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
          ) : listItinerarioResumen.length > 0 ? (
            <View style={styles.itinerariesContainer}>
              {listItinerarioResumen.map(itinerary => (
                <ItineraryCard
                  key={itinerary.id}
                  title={itinerary.titulo}
                  location={itinerary.provincia}
                  duration={`${itinerary.duracionDias} Días`}
                  imageUrl={itinerary.fotoPortada}
                  isOfflineAvailable={false}
                  isFavorite={true}
                  isPinned={false}
                  onPressDetail={() => router.push({ pathname: '/itinerarioInfoFav', params: { id: itinerary.id } })}
                  onFavoriteToggle={() => handleToggleFavorite(itinerary.id)}
                  onPinPress={() => handleTogglePin(itinerary.id)}
                  onDownloadPress={() => handleToggleDownload(itinerary.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <EmptyState
                title="Aún no tienes favoritos"
                description="Explora destinos increíbles y guarda los itinerarios que más te gusten para tenerlos siempre a mano."
                actionLabel="Ir a Explorar"
                onActionPress={() => router.push('/explorarApp')}
              />
            </View>
          )}
        </ScrollView>
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
