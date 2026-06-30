import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useColorScheme';
import { useItinerariosHook } from '@/hooks/useItinerarios';
import { ItineraryCard } from '@/components/favorites/favorite_principal/ItineraryCard/ItineraryCard';
import { EmptyState } from '@/components/favorites/favorite_principal/EmptyState/EmptyState';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { ItinerarioResumen } from '@/services/itinerariosService';
import { paddings } from '@/constants/paddings';
import { PROVINCIA_LABEL, Provincia } from '@/types/itinerario';

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

function getProvinciaLabel(provincia: string) {
  return PROVINCIA_LABEL[provincia as Provincia] ?? provincia;
}

interface Props {
  /** Header compartido (título + toggle de vista) que scrollea con la lista */
  header: React.ReactElement;
  /** Cambiar a la tab "Guardados" (desde el empty state) */
  onVerGuardados: () => void;
}

/** Tab "Mis viajes": copias propias del usuario + borrar / fijar / descargar. */
export function MisViajesTab({ header, onVerGuardados }: Props) {
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

  // id pendiente de confirmación de borrado (null = modal cerrado)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const viajesNoCompletados = useMemo(
    () => ordenarConPinPrimero(listItinerarioResumen.filter(it => !it.completado)),
    [listItinerarioResumen],
  );

  // Refresca las copias cada vez que la pantalla recupera foco
  useFocusEffect(
    useCallback(() => {
      loadItinerarios();
    }, [loadItinerarios])
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
        location={getProvinciaLabel(itinerary.provincia)}
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
          title="No tenés viajes sin completar"
          description="Los itinerarios que todavía no completes van a aparecer acá."
          actionLabel="Ver guardados"
          onActionPress={onVerGuardados}
        />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={isLoading ? [] : viajesNoCompletados}
        renderItem={renderCopia}
        keyExtractor={(item) => `itin-${item.id}`}
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
        message="¿Estás seguro de que deseas eliminar este itinerario de tus viajes?"
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
