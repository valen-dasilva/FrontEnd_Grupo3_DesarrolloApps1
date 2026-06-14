import { useQuery } from "@tanstack/react-query";
import { ItinerarioSistemaDTO } from '@/types/itinerario';
import { obtenerItinerarioPorId } from '@/services/itinerarioService';

export function useItinerarioDetalle(id: number | null) {
  const {
    data: itinerario = null,
    isLoading: loading,
    error,
  } = useQuery<ItinerarioSistemaDTO, Error>({
    queryKey: ["exploreItineraryDetails", id],
    queryFn: () => obtenerItinerarioPorId(id!),
    enabled: id !== null,
  });

  const errorString = error ? error.message : null;

  return { itinerario, loading, error: errorString };
}
