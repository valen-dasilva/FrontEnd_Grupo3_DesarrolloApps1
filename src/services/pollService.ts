import { apiClient } from './api';
import {
  CreatePollRequest,
  ItineraryOptionDetail,
  Poll,
  PollResult,
  PollSummary,
  VoteRequest,
} from '@/types/poll';
import { ItinerarioUsuario } from '@/services/itinerariosService';

const GROUPS_PATH = '/grupos';

export const getPolls = async (idGrupo: number): Promise<PollSummary[]> => {
  const response = await apiClient.get<PollSummary[]>(`${GROUPS_PATH}/${idGrupo}/encuestas`);
  return response.data;
};

export const createPoll = async (idGrupo: number, request: CreatePollRequest): Promise<Poll> => {
  const response = await apiClient.post<Poll>(`${GROUPS_PATH}/${idGrupo}/encuestas`, request);
  return response.data;
};

export const getPoll = async (idGrupo: number, idEncuesta: number): Promise<Poll> => {
  const response = await apiClient.get<Poll>(`${GROUPS_PATH}/${idGrupo}/encuestas/${idEncuesta}`);
  return response.data;
};

export const vote = async (idGrupo: number, idEncuesta: number, request: VoteRequest): Promise<Poll> => {
  const response = await apiClient.post<Poll>(
    `${GROUPS_PATH}/${idGrupo}/encuestas/${idEncuesta}/votar`,
    request,
  );
  return response.data;
};

export const finalizePoll = async (idGrupo: number, idEncuesta: number): Promise<PollResult> => {
  const response = await apiClient.post<PollResult>(
    `${GROUPS_PATH}/${idGrupo}/encuestas/${idEncuesta}/finalizar`,
  );
  return response.data;
};

export const breakTie = async (
  idGrupo: number,
  idEncuesta: number,
  idOpcionGanadora: number,
): Promise<PollResult> => {
  const response = await apiClient.post<PollResult>(
    `${GROUPS_PATH}/${idGrupo}/encuestas/${idEncuesta}/desempatar`,
    { idOpcionGanadora },
  );
  return response.data;
};

export const copyWinner = async (idGrupo: number, idEncuesta: number): Promise<ItinerarioUsuario> => {
  const response = await apiClient.post<ItinerarioUsuario>(
    `${GROUPS_PATH}/${idGrupo}/encuestas/${idEncuesta}/copiar`,
  );
  return response.data;
};

export const deletePoll = async (idGrupo: number, idEncuesta: number): Promise<void> => {
  await apiClient.delete(`${GROUPS_PATH}/${idGrupo}/encuestas/${idEncuesta}`);
};

export const getOptionDetail = async (
  idGrupo: number,
  idEncuesta: number,
  idOpcion: number,
): Promise<ItineraryOptionDetail> => {
  const response = await apiClient.get<ItineraryOptionDetail>(
    `${GROUPS_PATH}/${idGrupo}/encuestas/${idEncuesta}/opciones/${idOpcion}/detalle`,
  );
  return response.data;
};
