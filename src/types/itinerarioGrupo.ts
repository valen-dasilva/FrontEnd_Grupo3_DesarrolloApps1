export type GroupItineraryItemStatus = 'PROPUESTO' | 'CONFIRMADO';

/**
 * Asistencia de un miembro a una actividad. `asiste`:
 * `true` = va, `false` = no va, `null` = todavía no respondió.
 */
export interface GroupItineraryAttendance {
  usuarioId: number;
  nombreUsuario: string;
  fotoPerfil: string | null;
  asiste: boolean | null;
}

export interface GroupItineraryItem {
  id: number;
  nombreActividad: string;
  descripcion: string | null;
  localidad: string | null;
  direccion: string | null;
  dia: number;
  hora: string | null;
  estado: GroupItineraryItemStatus;
  propuestoPorId: number;
  nombrePropuestoPor: string;
  /** Todos los miembros del grupo con su estado (solo si el item está CONFIRMADO). */
  asistencias: GroupItineraryAttendance[];
  /** Mi respuesta a esta actividad, o null si no respondí. */
  miAsistencia: boolean | null;
  cantidadConfirmados: number;
}

export interface GroupItinerary {
  idItinerarioGrupo: number;
  titulo: string;
  descripcion: string | null;
  provincia: string;
  fechaInicio: string;
  fechaFin: string;
  fotoPortada: string | null;
  duracionDias: number;
  /** Creador del grupo al generarse el itinerario (trazabilidad, no el líder actual). */
  creadorOriginalId: number;
  nombreCreadorOriginal: string;
  idEncuestaOrigen: number | null;
  items: GroupItineraryItem[];
}

export interface GroupItineraryItemRequest {
  nombreActividad: string;
  descripcion: string;
  localidad: string;
  direccion: string;
  dia: number;
  hora: string;
}
