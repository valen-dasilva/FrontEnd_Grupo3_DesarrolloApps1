import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavoritos, guardarFavorito, quitarFavorito } from '@/services/favoritosService';
import { getErrorMessage, toErrorString } from '@/utils/errorUtils';

/**
 * Hook de FAVORITOS = bookmarks de itinerarios del sistema.
 * Lista los templates guardados y permite guardar/quitar el bookmark.
 * La creación de una copia editable vive en useItinerarios
 * (crearCopiaDesdeFavorito).
 */
export const useFavoritosHook = () => {
    const queryClient = useQueryClient();

    const {
        data: favoritos = [],
        isLoading,
        error,
        refetch: loadFavoritos,
    } = useQuery({
        queryKey: ['favoritos'],
        queryFn: getFavoritos,
    });

    // Mutation: guardar bookmark
    const guardarMutation = useMutation({
        mutationFn: (idSistema: number) => guardarFavorito(idSistema),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favoritos'] }),
        onError: (err) => {
            Alert.alert("Error", getErrorMessage(err, "No se pudo guardar en favoritos."));
        }
    });

    const guardarFavoritoItinerario = async (idSistema: number) => {
        await guardarMutation.mutateAsync(idSistema);
    };

    // Mutation: quitar bookmark
    const quitarMutation = useMutation({
        mutationFn: (idSistema: number) => quitarFavorito(idSistema),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favoritos'] }),
        onError: (err) => {
            Alert.alert("Error", getErrorMessage(err, "No se pudo quitar de favoritos."));
        }
    });

    const quitarFavoritoItinerario = async (idSistema: number) => {
        await quitarMutation.mutateAsync(idSistema);
    };

    const errorString = toErrorString(error);

    return {
        favoritos,
        listFavoritos: favoritos,
        isLoading,
        error: errorString,
        loadFavoritos,
        guardarFavorito: guardarFavoritoItinerario,
        quitarFavorito: quitarFavoritoItinerario,
        isMutating: guardarMutation.isPending || quitarMutation.isPending,
    };
};
