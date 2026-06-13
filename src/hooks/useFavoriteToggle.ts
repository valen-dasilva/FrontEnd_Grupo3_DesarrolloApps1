import { useState, useEffect } from 'react';
import { postItinerario, deleteItinerario } from '../services/favoritosService';

export function useFavoriteToggle(
  idItinerario: number | undefined,
  initialIsFavorite: boolean,
  initialFavId: number | undefined
) {
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [favId, setFavId] = useState<number | undefined>(initialFavId);

  useEffect(() => {
    setIsFav(initialIsFavorite);
  }, [initialIsFavorite]);

  useEffect(() => {
    setFavId(initialFavId);
  }, [initialFavId]);

  const toggleFavorite = async () => {
    if (idItinerario === undefined) {
      console.warn("Cannot toggle favorite: idItinerario is undefined");
      return;
    }
    const nextFav = !isFav;
    setIsFav(nextFav);
    try {
      if (nextFav) {
        const res = await postItinerario(idItinerario);
        setFavId(res.id);
      } else {
        if (favId !== undefined) {
          await deleteItinerario(favId);
          setFavId(undefined);
        } else {
          console.warn("Cannot delete favorite: favId is undefined");
        }
      }
    } catch (error) {
      setIsFav(!nextFav);
      console.error("Error toggling favorite:", error);
    }
  };

  return { isFav, favId, toggleFavorite };
}
