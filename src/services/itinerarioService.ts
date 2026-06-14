import {
  CategoriaItinerario,
  ItinerarioEnCursoDTO,
  ItinerarioSistemaDTO,
  ItinerarioSistemaResumenDTO,
  Provincia,
} from '@/types/itinerario';

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

// Devuelve el itinerario activo del usuario (fechaFin >= hoy, el más próximo),
// o null si no tiene ninguno en curso o próximo.
// El backend lo identifica por el JWT — no hace falta pasar el userId.
export async function getItinerarioEnCurso(): Promise<ItinerarioEnCursoDTO | null> {
  return apiClient
    .get<ItinerarioEnCursoDTO>("/favoritos/activo")
    .then((r) => r.data)
    .catch(() => null);
}

export interface ItineraryCard {
  id: number;
  title: string;
  description: string;
  province: string;
  startDate: string;
  endDate: string;
  photo: string;
  durationDays: number;
  tags: string[];
}

export async function getItineraryCards(): Promise<ItineraryCard[]> {
  return apiClient
    .get("/itinerario/explorar")
    .then((r) => r.data);
}
