import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { EmptyState } from '@/components/favorites/favorite_principal/EmptyState/EmptyState';
import { ItineraryCard } from '@/components/favorites/favorite_principal/ItineraryCard/ItineraryCard';
import { paddings } from '@/constants/paddings';
import { useTheme } from '@/hooks/useColorScheme';
import { useItinerariosHook } from '@/hooks/useItinerarios';
import { ItinerarioResumen } from '@/services/itinerariosService';

function buildItinerarioParams(itinerary: ItinerarioResumen) {
  return {
    pathname: '/(tabs)/(favorite)/itinerarioInfoFav' as const,
    params: {
      id: String(itinerary.id),
      titulo: itinerary.titulo,
      provincia: itinerary.provincia,
      duracionDias: String(itinerary.duracionDias),
      fotoPortada: itinerary.fotoPortada,
      fechaInicio: itinerary.fechaInicio,
      fechaFin: itinerary.fechaFin,
      completado: itinerary.completado ? 'true' : 'false',
      etiquetas: itinerary.etiquetas?.join(','),
      description: itinerary.descripcion || '',
    },
  };
}

function ordenarConPinPrimero(itinerarios: ItinerarioResumen[]) {
  return [...itinerarios].sort((a, b) => {
    if (a.esPinned !== b.esPinned) return a.esPinned ? -1 : 1;
    return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
  });
}

interface Props {
  header: React.ReactElement;
  onVerMisViajes: () => void;
}

export function CompletadosTab({ header, onVerMisViajes }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const {
    listItinerarioResumen,
    isLoading,
    quitItinerary,
    togglePin,
    downloadedIds,
    downloadItinerary,
    removeDownload,
    loadItinerarios,
  } = useItinerariosHook();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadItinerarios();
    }, [loadItinerarios]),
  );

  const viajesCompletados = useMemo(
    () => ordenarConPinPrimero(listItinerarioResumen.filter(it => it.completado)),
    [listItinerarioResumen],
  );

  const confirmDelete = () => {
    if (confirmDeleteId !== null) {
      quitItinerary(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

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

  const renderCopia = useCallback(({ item: itinerary, index }: { item: ItinerarioResumen; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(300)}>
      <ItineraryCard
        title={itinerary.titulo}
        location={itinerary.provincia}
        duration={`${itinerary.duracionDias} Días`}
        imageUrl={itinerary.fotoPortada}
        isOfflineAvailable={downloadedIds.includes(itinerary.id)}
        isFavorite={true}
        isPinned={itinerary.esPinned}
        onPressDetail={() => router.push(buildItinerarioParams(itinerary))}
        onDeletePress={() => setConfirmDeleteId(itinerary.id)}
        onPinPress={() => togglePin(itinerary.id)}
        onDownloadPress={() => handleToggleDownload(itinerary.id)}
      />
    </Animated.View>
  ), [downloadedIds, router, togglePin, handleToggleDownload]);

  const renderEmpty = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />;
    }
    return (
      <View style={local.emptyStateContainer}>
        <EmptyState
          title="Todavía no completaste viajes"
          description="Cuando marques un itinerario como completado, lo vas a encontrar en este historial."
          actionLabel="Ver mis viajes"
          onActionPress={onVerMisViajes}
        />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={isLoading ? [] : viajesCompletados}
        renderItem={renderCopia}
        keyExtractor={(item) => `completed-itin-${item.id}`}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        style={[local.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={local.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
      />

      <ConfirmAlert
        visible={confirmDeleteId !== null}
        title="Eliminar itinerario"
        message="¿Estás seguro de que deseas eliminar este itinerario completado?"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
      />
    </>
  );
}

const local = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: paddings.spacing.xxl,
  },
  emptyStateContainer: {
    flex: 1,
    paddingHorizontal: paddings.spacing.lg,
    justifyContent: 'center',
    paddingTop: paddings.spacing.huge,
  },
});
