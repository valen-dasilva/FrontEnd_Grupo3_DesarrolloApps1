import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/api';
import {
  createGroup,
  generateInvitationCode,
  getGroup,
  getGroups,
  getInvitationCode,
  joinGroup,
  leaveGroup,
  updateGroup,
} from '@/services/groupService';
import { Group, GroupFormValues } from '@/types/grupo';

const GROUPS_QUERY_KEY = 'groups';
const GROUP_QUERY_KEY = 'group';
const INVITATION_QUERY_KEY = 'invitationCode';

export const useGroupsHook = () => {
  const queryClient = useQueryClient();

  const {
    data: groups = [],
    isLoading,
    error,
    refetch: loadGroups,
  } = useQuery({
    queryKey: [GROUPS_QUERY_KEY],
    queryFn: getGroups,
  });

  const createGroupMutation = useMutation({
    mutationFn: (values: GroupFormValues) => createGroup(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
    },
    onError: (err) => {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'No se pudo crear el grupo.');
    },
  });

  const createNewGroup = async (values: GroupFormValues) => {
    return await createGroupMutation.mutateAsync(values);
  };

  const joinGroupMutation = useMutation({
    mutationFn: (code: string) => joinGroup(code),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
    },
  });

  const joinGroupByCode = async (code: string) => {
    return await joinGroupMutation.mutateAsync(code);
  };

  const leaveGroupMutation = useMutation({
    mutationFn: (id: number) => leaveGroup(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [GROUP_QUERY_KEY, id] });
      queryClient.removeQueries({ queryKey: [INVITATION_QUERY_KEY, id] });
    },
    onError: (err) => {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'No se pudo abandonar el grupo.');
    },
  });

  const leaveGroupById = async (id: number) => {
    await leaveGroupMutation.mutateAsync(id);
  };

  let errorString: string | null = null;
  if (error instanceof Error) {
    errorString = error.message;
  } else if (error) {
    errorString = String(error);
  }

  return {
    groups,
    isLoading,
    error: errorString,
    loadGroups,
    createGroup: createNewGroup,
    isCreating: createGroupMutation.isPending,
    joinGroup: joinGroupByCode,
    isJoining: joinGroupMutation.isPending,
    leaveGroup: leaveGroupById,
    isLeaving: leaveGroupMutation.isPending,
  };
};

export const useGroupDetailsHook = (id: number | null) => {
  const queryClient = useQueryClient();

  const {
    data: group,
    isLoading,
    error,
    refetch: loadGroup,
  } = useQuery({
    queryKey: [GROUP_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return undefined;
      return await getGroup(id);
    },
    enabled: id !== null,
  });

  const {
    data: invitation,
    isLoading: isLoadingInvitation,
    error: errorInvitation,
    refetch: refreshInvitation,
  } = useQuery({
    queryKey: [INVITATION_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      try {
        return await getInvitationCode(id);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }
    },
    // El creador debe activar el código explícitamente; no se consulta al entrar.
    enabled: false,
  });

  const regenerateInvitationMutation = useMutation({
    mutationFn: (groupId: number) => generateInvitationCode(groupId),
    onSuccess: (data, groupId) => {
      queryClient.setQueryData([INVITATION_QUERY_KEY, groupId], data);
    },
    onError: (err) => {
      Alert.alert(
        'Error',
        err instanceof ApiError ? err.message : 'No se pudo generar el código de invitación.',
      );
    },
  });

  const regenerateInvitation = useCallback(async () => {
    if (!id) return;
    await regenerateInvitationMutation.mutateAsync(id);
  }, [id, regenerateInvitationMutation]);

  const updateGroupMutation = useMutation({
    mutationFn: ({ groupId, values }: { groupId: number; values: GroupFormValues }) =>
      updateGroup(groupId, values),
    onSuccess: async (_data, { groupId }) => {
      await queryClient.invalidateQueries({ queryKey: [GROUP_QUERY_KEY, groupId] });
      await queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
    },
    onError: (err) => {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'No se pudo actualizar el grupo.');
    },
  });

  const editGroup = async (groupId: number, values: GroupFormValues) => {
    return await updateGroupMutation.mutateAsync({ groupId, values });
  };

  let errorString: string | null = null;
  if (error instanceof Error) {
    errorString = error.message;
  } else if (error) {
    errorString = String(error);
  }

  let invitationErrorString: string | null = null;
  if (errorInvitation instanceof Error) {
    invitationErrorString = errorInvitation.message;
  } else if (errorInvitation) {
    invitationErrorString = String(errorInvitation);
  }

  return {
    group: group as Group | undefined,
    isLoading,
    error: errorString,
    loadGroup,
    invitation: invitation ?? undefined,
    isLoadingInvitation,
    invitationError: invitationErrorString,
    refreshInvitation,
    regenerateInvitation,
    isRegenerating: regenerateInvitationMutation.isPending,
    editGroup,
    isUpdating: updateGroupMutation.isPending,
  };
};
