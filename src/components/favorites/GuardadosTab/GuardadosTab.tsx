import React, { useCallback, useState } from 'react';
import { FlatList, View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useColorScheme';
import { useFavoritosHook } from '@/hooks/useFavoritos';
import { useItinerariosHook } from '@/hooks/useItinerarios';
import { BookmarkCard } from '@/components/favorites/BookmarkCard/BookmarkCard';
import { EmptyState } from '@/components/favorites/favorite_principal/EmptyState/EmptyState';
import { StatusModal } from '@/components/common/StatusModal/StatusModal';
import { ItinerarioSistemaResumenDTO, PROVINCIA_LABEL, CATEGORIA_LABEL } from '@/types/itinerario';
import { paddings } from '@/constants/paddings';

interface Props {
  /** Header compartido (título + toggle de vista) que scrollea con la lista */
  header: React.ReactElement;
  /** Cambiar a la tab "Mis viajes" (desde el modal de copia creada) */
  onVerMisViajes: () => void;
}

/** Tab "Guardados": bookmarks de templates del sistema + flujo de crear copia. */
export function GuardadosTab({ header, onVerMisViajes }: Props) {
  const router = useRouter();
  const { theme } = useTheme();

  const { favoritos, isLoading, loadFavoritos, quitarFavorito } = useFavoritosHook();
  const { crearCopiaDesdeFavorito } = useItinerariosHook();

  // Modal loading -> success al crear copia. Vive acá porque solo se dispara
  // desde un bookmark de esta tab.
  const [copiaModal, setCopiaModal] = useState<{ visible: boolean; state: 'loading' | 'success' }>({
    visible: false,
    state: 'loading',
  });

  // Refresca los bookmarks cada vez que la pantalla recupera foco
  useFocusEffect(
    useCallback(() => {
      loadFavoritos();
    }, [loadFavoritos])
  );

  const handleCrearCopia = useCallback(async (idSistema: number) => {
    setCopiaModal({ visible: true, state: 'loading' });
    try {
      await crearCopiaDesdeFavorito(idSistema);
      setCopiaModal({ visible: true, state: 'success' });
    } catch {
      setCopiaModal({ visible: false, state: 'loading' });
      // el hook ya muestra el Alert de error
    }
  }, [crearCopiaDesdeFavorito]);

  const renderBookmark = useCallback(({ item }: { item: ItinerarioSistemaResumenDTO }) => (
    <BookmarkCard
      title={item.titulo}
      location={PROVINCIA_LABEL[item.provincia] ?? item.provincia}
      duration={`${item.duracionDias} Días`}
      imageUrl={item.fotoPortada}
      onCrearCopia={() => handleCrearCopia(item.idItinerario)}
      onQuitar={() => quitarFavorito(item.idItinerario)}
      onVerDetalle={() => router.push({
        pathname: '/(tabs)/explorarApp/itinerarioInfo',
        params: {
          idItinerario: String(item.idItinerario),
          title: item.titulo,
          description: item.descripcion,
          category: item.etiquetas?.length > 0 ? CATEGORIA_LABEL[item.etiquetas[0]] : 'General',
          image: item.fotoPortada,
          startDate: item.fechaInicio,
          endDate: item.fechaFin,
          isFavorite: 'true',
          idFavorito: '',
        },
      })}
    />
  ), [handleCrearCopia, quitarFavorito, router]);

  const renderEmpty = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />;
    }
    return (
      <View style={local.emptyStateContainer}>
        <EmptyState
          title="Aún no tienes favoritos"
          description="Explorá destinos y guardá los itinerarios que más te gusten para crear tus propias copias."
          actionLabel="Ir a Explorar"
          onActionPress={() => router.push('/explorar')}
        />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={isLoading ? [] : favoritos}
        renderItem={renderBookmark}
        keyExtractor={(item) => `fav-${item.idItinerario}`}
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

      <StatusModal
        visible={copiaModal.visible}
        state={copiaModal.state}
        title={copiaModal.state === 'loading' ? 'Copiando itinerario...' : '¡Copia creada!'}
        message={copiaModal.state === 'loading'
          ? 'Estamos creando tu copia editable.'
          : 'La encontrás en "Mis viajes" para personalizarla.'}
        actionLabel="Ver mis viajes"
        onAction={() => {
          setCopiaModal({ visible: false, state: 'loading' });
          onVerMisViajes();
        }}
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
