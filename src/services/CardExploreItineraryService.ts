import { apiClient } from "./api";

import {
  CategoriaItinerario,
  ItinerarioSistemaResumenDTO,
} from "../types/itinerario";

export interface ItineraryCardParams {
  tags?: CategoriaItinerario[];
}

export async function getItineraryCards(params: ItineraryCardParams): Promise<ItinerarioSistemaResumenDTO[]> {
  const query = new URLSearchParams();
  params.tags?.forEach((t) => query.append("tags", t));
  const qs = query.toString();
  return apiClient
    .get<ItinerarioSistemaResumenDTO[]>(`/itinerario/explorar${qs ? `?${qs}` : ""}`)
    .then((r) => r.data);

}
