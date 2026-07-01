import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AnimatedListItem } from '@/components/common/AnimatedListItem/AnimatedListItem';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { EmptyState } from '@/components/favorites/favorite_principal/EmptyState/EmptyState';
import { ItineraryCard } from '@/components/favorites/favorite_principal/ItineraryCard/ItineraryCard';
import { paddings } from '@/constants/paddings';
import { LIST_PERF_PROPS } from '@/constants/listConfig';
import { useTheme } from '@/hooks/useColorScheme';
import { useItinerariosHook } from '@/hooks/useItinerarios';
import { useItineraryDownload } from '@/hooks/useItineraryDownload';
import { ItinerarioResumen } from '@/services/itinerariosService';
import { buildItinerarioParams, getProvinciaLabel, ordenarConPinPrimero } from '@/utils/itinerarioUtils';

export interface ItinerarioListTabEmptyState {
  title: string;
  description: string;
  actionLabel: string;
  onActionPress: () => void;
}

interface Props {
  /** Header compartido (título + toggle de vista) que scrollea con la lista */
  header: React.ReactElement;
  /** Predicado para filtrar qué copias muestra esta tab (debe ser estable entre renders) */
  filter: (it: ItinerarioResumen) => boolean;
  /** Prefijo para las keys de la lista (evita colisiones entre tabs montadas a la vez) */
  keyPrefix: string;
  /** Contenido del estado vacío */
  emptyState: ItinerarioListTabEmptyState;
  /** Mensaje del modal de confirmación de borrado */
  confirmDeleteMessage: string;
}

/**
 * Lista de copias propias del usuario con las acciones comunes (ver detalle,
 * borrar, fijar, descargar offline). Es la base compartida de las tabs
 * "Mis viajes" y "Completados", que antes eran dos componentes casi idénticos.
 */
export function ItinerarioListTab({ header, filter, keyPrefix, emptyState, confirmDeleteMessage }: Props) {
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
  const [isDeleting, setIsDeleting] = useState(false);

  const items = useMemo(
    () => ordenarConPinPrimero(listItinerarioResumen.filter(filter)),
    [listItinerarioResumen, filter],
  );

  // Refresca las copias cada vez que la pantalla recupera foco
  useFocusEffect(
    useCallback(() => {
      loadItinerarios();
    }, [loadItinerarios]),
  );

  const handleToggleDownload = useItineraryDownload({
    downloadedIds,
    itinerarios: listItinerarioResumen,
    downloadItinerary,
    removeDownload,
  });

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      setIsDeleting(true);
      await quitItinerary(confirmDeleteId);
      setConfirmDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCopia = useCallback(({ item: itinerary, index }: { item: ItinerarioResumen; index: number }) => (
    <AnimatedListItem index={index}>
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
    </AnimatedListItem>
  ), [downloadedIds, router, togglePin, handleToggleDownload]);

  const renderEmpty = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />;
    }
    return (
      <View style={local.emptyStateContainer}>
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          actionLabel={emptyState.actionLabel}
          onActionPress={emptyState.onActionPress}
        />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={isLoading ? [] : items}
        renderItem={renderCopia}
        keyExtractor={(item) => `${keyPrefix}-${item.id}`}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmpty}
        style={[local.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={local.scrollContent}
        {...LIST_PERF_PROPS}
      />

      <ConfirmAlert
        visible={confirmDeleteId !== null}
        title="Eliminar itinerario"
        message={confirmDeleteMessage}
        loading={isDeleting}
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
