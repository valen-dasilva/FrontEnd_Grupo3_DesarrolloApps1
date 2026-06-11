import {
  CategoriaItinerario,
  ItinerarioEnCursoDTO,
  ItinerarioSistemaDTO,
  ItinerarioSistemaResumenDTO,
  Provincia,
} from "../types/itinerario";
import { apiClient } from "./api";

export interface BuscarParams {
  provincia?: Provincia;
  tags?: CategoriaItinerario[];
  fechaInicio?: string;
  fechaFin?: string;
}

export async function buscarPorPreferencias(
  params: BuscarParams,
): Promise<ItinerarioSistemaResumenDTO[]> {
  const query = new URLSearchParams();
  if (params.provincia) query.append("provincia", params.provincia);
  params.tags?.forEach((t) => query.append("tags", t));
  if (params.fechaInicio) query.append("fechaInicio", params.fechaInicio);
  if (params.fechaFin) query.append("fechaFin", params.fechaFin);
  const qs = query.toString();
  return apiClient
    .get<ItinerarioSistemaResumenDTO[]>(`/itinerario/buscar${qs ? `?${qs}` : ""}`)
    .then((r) => r.data);
}

export async function obtenerItinerarioPorId(
  id: number,
): Promise<ItinerarioSistemaDTO> {
  return apiClient
    .get<ItinerarioSistemaDTO>(`/itinerario/${id}`)
    .then((r) => r.data);
}

// Devuelve el itinerario activo del usuario (fecha_inicio <= hoy <= fecha_fin),
// o null si no tiene ninguno en curso. Nunca lanza — los errores se tragan silenciosamente
// para que la pantalla de inicio no rompa si el backend no responde.
export async function getItinerarioEnCurso(
  userId: number,
): Promise<ItinerarioEnCursoDTO | null> {
  return apiClient
    .get<ItinerarioEnCursoDTO>(`/itinerario-usuario/activo/${userId}`)
    .then((r) => r.data)
    .catch(() => null);
}
