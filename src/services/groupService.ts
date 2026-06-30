import { apiClient } from './api';
import { Group, GroupFormValues, GroupSummary, InvitationCode } from '@/types/grupo';

const GROUPS_PATH = '/grupos';

export const getGroups = async (): Promise<GroupSummary[]> => {
  const response = await apiClient.get<GroupSummary[]>(`${GROUPS_PATH}`);
  return response.data;
};

export const createGroup = async (values: GroupFormValues): Promise<Group> => {
  const response = await apiClient.post<Group>(`${GROUPS_PATH}`, values);
  return response.data;
};

export const getGroup = async (id: number): Promise<Group> => {
  const response = await apiClient.get<Group>(`${GROUPS_PATH}/${id}`);
  return response.data;
};

export const joinGroup = async (code: string): Promise<Group> => {
  const response = await apiClient.post<Group>(`${GROUPS_PATH}/unirse/${code}`);
  return response.data;
};

export const getInvitationCode = async (id: number): Promise<InvitationCode> => {
  const response = await apiClient.get<InvitationCode>(`${GROUPS_PATH}/${id}/codigo-activo`);
  return response.data;
};

export const generateInvitationCode = async (id: number): Promise<InvitationCode> => {
  const response = await apiClient.post<InvitationCode>(`${GROUPS_PATH}/${id}/codigo`);
  return response.data;
};

export const leaveGroup = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`${GROUPS_PATH}/${id}/salir`);
};

export const updateGroup = async (id: number, values: GroupFormValues): Promise<Group> => {
  const response = await apiClient.put<Group>(`${GROUPS_PATH}/${id}`, values);
  return response.data;
};

/**
 * Sube una foto de portada para un grupo al bucket público de fotos de usuarios.
 * El filename usa prefijo "grupo_" para distinguirlo de avatares.
 */
export const uploadGroupCover = async (uri: string): Promise<string> => {
  const supabaseUrl = 'https://qwkqhlpwwpjjqcbztbcl.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3FobHB3d3BqanFjYnp0YmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzAzMTgsImV4cCI6MjA4OTUwNjMxOH0.PVQjAPvwRvEVolQhQnG1hSmKdeywTzgYnvw6Bd-eScg';
  const filename = `grupo_${Date.now()}.jpg`;
  const localResponse = await fetch(uri);
  const blob = await localResponse.blob();
  const response = await fetch(`${supabaseUrl}/storage/v1/object/fotos-usuarios/${filename}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
      'Content-Type': blob.type || 'image/jpeg',
    },
    body: blob,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload group cover: ${errorText}`);
  }
  return `${supabaseUrl}/storage/v1/object/public/fotos-usuarios/${filename}`;
};
