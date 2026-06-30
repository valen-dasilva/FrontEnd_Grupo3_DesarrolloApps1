import { ItinerarioSistemaDTO } from './itinerario';
import { ItinerarioUsuario } from '@/services/itinerariosService';

export type PollStatus = 'ABIERTA' | 'EMPATE' | 'FINALIZADA';

export interface PollOption {
  id: number;
  tituloSnapshot: string;
  fotoPortadaSnapshot: string | null;
  cantidadVotos: number;
  propietarioId: number | null;
  esGanadora: boolean;
}

export interface PollSummary {
  idEncuesta: number;
  nombre: string | null;
  estado: PollStatus;
  cantidadVotos: number;
  cantidadMiembros: number;
  ganadorTitulo: string | null;
  ganadorFotoPortada: string | null;
  totalOpciones: number;
}

export interface Poll {
  idEncuesta: number;
  nombre: string | null;
  estado: PollStatus;
  creadorId: number;
  nombreCreador: string;
  fechaCreacion: string;
  fechaCierre: string | null;
  opcionGanadora: PollOption | null;
  opciones: PollOption[];
  yaVote: boolean;
  puedeFinalizar: boolean;
  idOpcionVotada: number | null;
  cantidadMiembros: number;
}

export interface PollResult {
  ganador: PollOption | null;
  empate: boolean;
  opcionesEmpatadas: PollOption[];
}

export interface VoteRequest {
  idOpcion: number;
}

export interface CreatePollOptionRequest {
  idItinerarioSistema: number | null;
  idItinerarioUsuario: number | null;
}

export interface CreatePollRequest {
  nombre?: string;
  opciones: CreatePollOptionRequest[];
}

export interface SelectableItineraryOption {
  id: number;
  type: 'system' | 'user';
  titulo: string;
  fotoPortada: string | null;
  provincia?: string;
  duracionDias?: number;
}

export type ItineraryOptionDetail = ItinerarioSistemaDTO | ItinerarioUsuario;
