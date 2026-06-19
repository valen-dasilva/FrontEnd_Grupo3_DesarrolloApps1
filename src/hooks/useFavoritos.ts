import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/api';
import { getFavoritos, guardarFavorito, quitarFavorito } from '@/services/favoritosService';

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
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo guardar en favoritos.");
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
            Alert.alert("Error", err instanceof ApiError ? err.message : "No se pudo quitar de favoritos.");
        }
    });

    const quitarFavoritoItinerario = async (idSistema: number) => {
        await quitarMutation.mutateAsync(idSistema);
    };

    let errorString: string | null = null;
    if (error instanceof Error) {
        errorString = error.message;
    } else if (error) {
        errorString = String(error);
    }

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
