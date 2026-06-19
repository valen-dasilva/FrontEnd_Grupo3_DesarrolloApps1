import { Stack, useRouter, useFocusEffect, type Href } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { FlatList, StatusBar, Text, View, ActivityIndicator, Platform, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Header } from '@/components/common/Header/Header';
import { ItineraryCard } from '@/components/favorites/favorite_principal/ItineraryCard/ItineraryCard';
import { BookmarkCard } from '@/components/favorites/BookmarkCard/BookmarkCard';
import { EmptyState } from '@/components/favorites/favorite_principal/EmptyState/EmptyState';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';

import { styles } from './FavoritesScreen.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { useFavoritosHook } from '@/hooks/useFavoritos';
import { useItinerariosHook } from '@/hooks/useItinerarios';
import { ItinerarioResumen } from '@/services/itinerariosService';
import { ItinerarioSistemaResumenDTO, PROVINCIA_LABEL } from '@/types/itinerario';

type Vista = 'guardados' | 'misViajes';

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const [vista, setVista] = useState<Vista>('guardados');

  // Favoritos = bookmarks (templates del sistema guardados)
  const {
    favoritos,
    isLoading: isLoadingFavoritos,
    loadFavoritos,
    quitarFavorito,
  } = useFavoritosHook();

  // Mis itinerarios = copias propias
  const {
    listItinerarioResumen,
    isLoading: isLoadingItinerarios,
    quitItinerary,
    togglePin,
    downloadedIds,
    downloadItinerary,
    removeDownload,
    loadItinerarios,
    crearCopiaDesdeFavorito,
    isCreando,
  } = useItinerariosHook();

  useFocusEffect(
    useCallback(() => {
      loadFavoritos();
      loadItinerarios();
    }, [loadFavoritos, loadItinerarios])
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // ---- acciones vista "Guardados" (bookmarks) ----
  const handleCrearCopia = useCallback(async (idSistema: number) => {
    try {
      await crearCopiaDesdeFavorito(idSistema);
      Toast.show({
        type: 'success',
        text1: '¡Copia creada!',
        text2: 'La encontrás en "Mis viajes" para editarla.',
      });
      setVista('misViajes');
    } catch {
      // el hook ya muestra el Alert de error
    }
  }, [crearCopiaDesdeFavorito]);

  const handleQuitarFavorito = useCallback((idSistema: number) => {
    quitarFavorito(idSistema);
  }, [quitarFavorito]);

  // ---- acciones vista "Mis viajes" (copias) ----
  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      quitItinerary(confirmDeleteId);
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
        Toast.show({ type: 'info', text1: 'Descarga eliminada', text2: 'El itinerario ya no estará disponible offline.' });
      });
    } else {
      downloadItinerary(itinerary).then(() => {
        Toast.show({ type: 'success', text1: '¡Descarga completa!', text2: 'El itinerario ya está disponible offline.' });
      });
    }
  }, [downloadedIds, listItinerarioResumen, downloadItinerary, removeDownload]);

  // ---- toggle de vista ----
  const renderToggle = () => (
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
  );

  const renderHeader = useCallback(() => (
    <View style={styles.pageHeader}>
      <Text style={[styles.pageTitle, { color: theme.text }]}>
        {vista === 'guardados' ? 'Favoritos guardados' : 'Mis viajes'}
      </Text>
      <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
        {vista === 'guardados'
          ? 'Plantillas que guardaste. Creá una copia para personalizarla.'
          : 'Tus itinerarios propios, listos para editar y completar.'}
      </Text>
      {renderToggle()}
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
  ), [theme, vista, router]);

  const isLoading = vista === 'guardados' ? isLoadingFavoritos : isLoadingItinerarios;

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />;
    }
    if (vista === 'guardados') {
      return (
        <View style={styles.emptyStateContainer}>
          <EmptyState
            title="Aún no tienes favoritos"
            description="Explorá destinos y guardá los itinerarios que más te gusten para crear tus propias copias."
            actionLabel="Ir a Explorar"
            onActionPress={() => router.push('/explorar')}
          />
        </View>
      );
    }
    return (
      <View style={styles.emptyStateContainer}>
        <EmptyState
          title="Todavía no creaste viajes"
          description="Creá una copia desde un favorito guardado o armá un itinerario desde cero."
          actionLabel="Ver guardados"
          onActionPress={() => setVista('guardados')}
        />
      </View>
    );
  };

  // ---- render items por vista ----
  const renderBookmark = useCallback(({ item }: { item: ItinerarioSistemaResumenDTO }) => (
    <BookmarkCard
      title={item.titulo}
      location={PROVINCIA_LABEL[item.provincia] ?? item.provincia}
      duration={`${item.duracionDias} Días`}
      imageUrl={item.fotoPortada}
      isCreando={isCreando}
      onCrearCopia={() => handleCrearCopia(item.idItinerario)}
      onQuitar={() => handleQuitarFavorito(item.idItinerario)}
    />
  ), [isCreando, handleCrearCopia, handleQuitarFavorito]);

  const renderCopia = useCallback(({ item: itinerary }: { item: ItinerarioResumen }) => (
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
          description: itinerary.descripcion || '',
        }
      })}
      onFavoriteToggle={() => setConfirmDeleteId(itinerary.id)}
      onPinPress={() => handleTogglePin(itinerary.id)}
      onDownloadPress={() => handleToggleDownload(itinerary.id)}
    />
  ), [downloadedIds, router, handleTogglePin, handleToggleDownload]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Favoritos" onThemeTogglePress={toggleColorScheme} />

        {vista === 'guardados' ? (
          <FlatList
            key="guardados"
            data={isLoadingFavoritos ? [] : favoritos}
            renderItem={renderBookmark}
            keyExtractor={(item) => `fav-${item.idItinerario}`}
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
        ) : (
          <FlatList
            key="misViajes"
            data={isLoadingItinerarios ? [] : listItinerarioResumen}
            renderItem={renderCopia}
            keyExtractor={(item) => `itin-${item.id}`}
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
        )}
      </View>

      <ConfirmAlert
        visible={confirmDeleteId !== null}
        title="Eliminar itinerario"
        message="¿Estás seguro de que deseas eliminar este itinerario de tus viajes?"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
      />
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
