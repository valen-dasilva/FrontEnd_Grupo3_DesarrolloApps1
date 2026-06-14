import { useEffect, useState } from "react";
import { ItinerarioSistemaDTO } from '@/types/itinerario';
import { obtenerItinerarioPorId } from '@/services/itinerarioService';

export function useItinerarioDetalle(id: number | null) {
  const [itinerario, setItinerario] = useState<ItinerarioSistemaDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    obtenerItinerarioPorId(id)
      .then((data) => {
        if (isMounted) setItinerario(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message ?? "Error al cargar el itinerario");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { itinerario, loading, error };
}
