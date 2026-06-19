import { useState, useEffect } from 'react';
import { guardarFavorito, quitarFavorito } from '@/services/favoritosService';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Toggle del "corazón" en Explorar: guarda o quita un itinerario del
 * sistema de favoritos (bookmark). Se identifica solo por el id del
 * template del sistema — ya no maneja id de copia (ese tercer argumento
 * se mantiene por compatibilidad pero se ignora).
 */
export function useFavoriteToggle(
  idSistema: number | undefined,
  initialIsFavorite: boolean,
  _legacyFavId?: number | undefined
) {
  const queryClient = useQueryClient();
  const [isFav, setIsFav] = useState(initialIsFavorite);

  useEffect(() => {
    setIsFav(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async () => {
    if (idSistema === undefined) {
      console.warn("Cannot toggle favorite: idSistema is undefined");
      return;
    }
    const nextFav = !isFav;
    setIsFav(nextFav); // optimista
    try {
      if (nextFav) {
        await guardarFavorito(idSistema);
      } else {
        await quitarFavorito(idSistema);
      }
      queryClient.invalidateQueries({ queryKey: ['favoritos'] });
    } catch (error) {
      setIsFav(!nextFav); // revertir si falla
      console.error("Error toggling favorite:", error);
    }
  };

  return { isFav, favId: undefined as number | undefined, toggleFavorite };
}
