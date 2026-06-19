import {
  CategoriaItinerario,
  ItinerarioEnCursoDTO,
  ItinerarioSistemaDTO,
  ItinerarioSistemaResumenDTO,
  Provincia,
} from '@/types/itinerario';

import { apiClient, ApiError } from "./api";

export interface BuscarParams {
  provincia?: Provincia;
  tags?: CategoriaItinerario[];
  fechaInicio?: string;
  fechaFin?: string;
}

export async function buscarPorPreferencias( params: BuscarParams ): Promise<ItinerarioSistemaResumenDTO[]> {
  const query = new URLSearchParams();
  if (params.provincia) query.append("provincia", params.provincia);
  params.tags?.forEach((t) => query.append("tags", t));
  if (params.fechaInicio) query.append("fechaInicio", params.fechaInicio);
  if (params.fechaFin) query.append("fechaFin", params.fechaFin);
  const qs = query.toString();
  const url = qs ? `/itinerario/buscar?${qs}` : '/itinerario/buscar';
  return apiClient
    .get<ItinerarioSistemaResumenDTO[]>(url)
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
  try {
    const r = await apiClient.get<ItinerarioEnCursoDTO>("/itinerarios/activo");
    return r.data;
  } catch (error) {
    // 404 = el usuario no tiene viaje activo: caso normal, devolvemos null.
    if (error instanceof ApiError && error.status === 404) return null;
    // Red, 500, etc.: lo propagamos para que React Query lo marque como error.
    throw error;
  }
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
