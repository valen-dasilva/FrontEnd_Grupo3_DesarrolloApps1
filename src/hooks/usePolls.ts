import { Alert } from 'react-native';
import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/api';
import {
  breakTie,
  copyWinner,
  createPoll,
  deletePoll,
  finalizePoll,
  getOptionDetail,
  getPoll,
  getPolls,
  vote,
} from '@/services/pollService';
import { CreatePollRequest, Poll, PollSummary } from '@/types/poll';

const POLLS_QUERY_KEY = 'polls';
const POLL_QUERY_KEY = 'poll';
const POLL_OPTION_DETAIL_KEY = 'pollOptionDetail';

export const usePollsHook = (idGrupo: number | null) => {
  const queryClient = useQueryClient();

  const {
    data: polls = [],
    isLoading,
    error,
    refetch: loadPolls,
  } = useQuery({
    queryKey: [POLLS_QUERY_KEY, idGrupo],
    queryFn: async () => {
      if (!idGrupo) return [];
      return await getPolls(idGrupo);
    },
    enabled: idGrupo !== null,
  });

  const createPollMutation = useMutation({
    mutationFn: (request: CreatePollRequest) => {
      if (!idGrupo) throw new Error('Grupo no especificado');
      return createPoll(idGrupo, request);
    },
    onSuccess: async () => {
      if (idGrupo) {
        await queryClient.invalidateQueries({ queryKey: [POLLS_QUERY_KEY, idGrupo] });
        await queryClient.invalidateQueries({ queryKey: ['groups'] });
      }
    },
    onError: (err) => {
      Alert.alert('Error', err instanceof ApiError ? err.message : 'No se pudo crear la encuesta.');
    },
  });

  const createNewPoll = async (request: CreatePollRequest) => {
    return await createPollMutation.mutateAsync(request);
  };

  let errorString: string | null = null;
  if (error instanceof Error) {
    errorString = error.message;
  } else if (error) {
    errorString = String(error);
  }

  return {
    polls: polls as PollSummary[],
    isLoading,
    error: errorString,
    loadPolls,
    createPoll: createNewPoll,
    isCreating: createPollMutation.isPending,
  };
};

export const usePollDetailsHook = (idGrupo: number | null, idEncuesta: number | null) => {
  const queryClient = useQueryClient();

  const {
    data: poll,
    isLoading,
    error,
    refetch: loadPoll,
  } = useQuery({
    queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta],
    queryFn: async () => {
      if (!idGrupo || !idEncuesta) return undefined;
      return await getPoll(idGrupo, idEncuesta);
    },
    enabled: idGrupo !== null && idEncuesta !== null,
    refetchInterval: (query) => {
      const data = query.state.data as Poll | undefined;
      return data?.estado === 'ABIERTA' ? 7000 : false;
    },
  });

  const pendingVoteRef = useRef<Promise<unknown> | null>(null);

  const voteMutation = useMutation({
    mutationFn: (idOpcion: number) => {
      if (!idGrupo || !idEncuesta) throw new Error('Encuesta no especificada');
      return vote(idGrupo, idEncuesta, { idOpcion });
    },
    onMutate: async (newIdOpcion) => {
      if (!idGrupo || !idEncuesta) return;
      await queryClient.cancelQueries({ queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta] });

      const previousPoll = queryClient.getQueryData<Poll>([POLL_QUERY_KEY, idGrupo, idEncuesta]);
      if (!previousPoll) return { previousPoll };

      const oldVotedId = previousPoll.idOpcionVotada;
      const newOpciones = previousPoll.opciones.map((opcion) => {
        let count = opcion.cantidadVotos;
        if (oldVotedId === opcion.id) {
          count = Math.max(0, count - 1);
        }
        if (newIdOpcion === opcion.id) {
          count = count + 1;
        }
        return { ...opcion, cantidadVotos: count };
      });

      const optimisticPoll: Poll = {
        ...previousPoll,
        opciones: newOpciones,
        idOpcionVotada: newIdOpcion,
        yaVote: true,
      };
      queryClient.setQueryData([POLL_QUERY_KEY, idGrupo, idEncuesta], optimisticPoll);

      return { previousPoll };
    },
    onError: (err, _newIdOpcion, context) => {
      if (context?.previousPoll) {
        queryClient.setQueryData(
          [POLL_QUERY_KEY, idGrupo, idEncuesta],
          context.previousPoll,
        );
      }
      Alert.alert('Error', err instanceof ApiError ? err.message : 'No se pudo registrar el voto.');
    },
    onSettled: async () => {
      if (idGrupo && idEncuesta) {
        await queryClient.invalidateQueries({ queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta] });
        await queryClient.invalidateQueries({ queryKey: [POLLS_QUERY_KEY, idGrupo] });
      }
    },
  });

  const castVote = (idOpcion: number) => {
    const promise = voteMutation.mutateAsync(idOpcion);
    pendingVoteRef.current = promise;
    promise.finally(() => {
      if (pendingVoteRef.current === promise) {
        pendingVoteRef.current = null;
      }
    });
    return promise;
  };

  const awaitPendingVote = async () => {
    const pending = pendingVoteRef.current;
    if (pending) {
      await pending;
    }
  };

  const finalizeMutation = useMutation({
    mutationFn: async () => {
      if (!idGrupo || !idEncuesta) throw new Error('Encuesta no especificada');
      await awaitPendingVote();
      return await finalizePoll(idGrupo, idEncuesta);
    },
    onSuccess: async () => {
      if (idGrupo && idEncuesta) {
        await queryClient.invalidateQueries({ queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta] });
        await queryClient.invalidateQueries({ queryKey: [POLLS_QUERY_KEY, idGrupo] });
        await queryClient.invalidateQueries({ queryKey: ['groups'] });
        await queryClient.invalidateQueries({ queryKey: ['group', idGrupo] });
      }
    },
  });

  const finalize = async () => {
    return await finalizeMutation.mutateAsync();
  };

  const breakTieMutation = useMutation({
    mutationFn: (idOpcionGanadora: number) => {
      if (!idGrupo || !idEncuesta) throw new Error('Encuesta no especificada');
      return breakTie(idGrupo, idEncuesta, idOpcionGanadora);
    },
    onMutate: async (idOpcionGanadora) => {
      if (!idGrupo || !idEncuesta) return;
      await queryClient.cancelQueries({ queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta] });

      const previousPoll = queryClient.getQueryData<Poll>([POLL_QUERY_KEY, idGrupo, idEncuesta]);
      if (!previousPoll) return { previousPoll };

      const ganadora = previousPoll.opciones.find((o) => o.id === idOpcionGanadora) ?? null;
      const optimisticPoll: Poll = {
        ...previousPoll,
        estado: 'FINALIZADA',
        fechaCierre: new Date().toISOString(),
        opcionGanadora: ganadora ? { ...ganadora, esGanadora: true } : null,
        opciones: previousPoll.opciones.map((o) => ({
          ...o,
          esGanadora: o.id === idOpcionGanadora,
        })),
      };
      queryClient.setQueryData([POLL_QUERY_KEY, idGrupo, idEncuesta], optimisticPoll);

      return { previousPoll };
    },
    onSuccess: () => {
      if (!idGrupo || !idEncuesta) return;
      // Invalidaciones en background: no se esperan para que isPending baje rápido.
      queryClient.invalidateQueries({ queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta] });
      queryClient.invalidateQueries({ queryKey: [POLLS_QUERY_KEY, idGrupo] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['group', idGrupo] });
    },
    onError: (err, _idOpcionGanadora, context) => {
      if (context?.previousPoll) {
        queryClient.setQueryData([POLL_QUERY_KEY, idGrupo, idEncuesta], context.previousPoll);
      }
    },
    onSettled: () => {
      if (!idGrupo || !idEncuesta) return;
      queryClient.invalidateQueries({ queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta] });
      queryClient.invalidateQueries({ queryKey: [POLLS_QUERY_KEY, idGrupo] });
    },
  });

  const resolveTie = async (idOpcionGanadora: number) => {
    return await breakTieMutation.mutateAsync(idOpcionGanadora);
  };

  const copyMutation = useMutation({
    mutationFn: () => {
      if (!idGrupo || !idEncuesta) throw new Error('Encuesta no especificada');
      return copyWinner(idGrupo, idEncuesta);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['misItinerarios'] });
    },
    onError: () => {
      // El error se muestra en el contexto de la pantalla si es necesario.
    },
  });

  const copyToMyTrips = async () => {
    return await copyMutation.mutateAsync();
  };

  const deletePollMutation = useMutation({
    mutationFn: () => {
      if (!idGrupo || !idEncuesta) throw new Error('Encuesta no especificada');
      return deletePoll(idGrupo, idEncuesta);
    },
    onSuccess: async () => {
      if (idGrupo && idEncuesta) {
        queryClient.removeQueries({ queryKey: [POLL_QUERY_KEY, idGrupo, idEncuesta] });
        await queryClient.invalidateQueries({ queryKey: [POLLS_QUERY_KEY, idGrupo] });
        await queryClient.invalidateQueries({ queryKey: ['groups'] });
      }
    },
    onError: () => {
      // El error se muestra en el contexto de la pantalla si es necesario.
    },
  });

  const removePoll = async () => {
    await deletePollMutation.mutateAsync();
  };

  let errorString: string | null = null;
  if (error instanceof Error) {
    errorString = error.message;
  } else if (error) {
    errorString = String(error);
  }

  return {
    poll: poll as Poll | undefined,
    isLoading,
    error: errorString,
    rawError: error,
    loadPoll,
    castVote,
    isVoting: voteMutation.isPending,
    finalize,
    isFinalizing: finalizeMutation.isPending,
    finalizeError: finalizeMutation.error,
    resetFinalizeError: finalizeMutation.reset,
    resolveTie,
    isResolvingTie: breakTieMutation.isPending,
    breakTieError: breakTieMutation.error,
    resetBreakTieError: breakTieMutation.reset,
    copyToMyTrips,
    isCopying: copyMutation.isPending,
    removePoll,
    isDeleting: deletePollMutation.isPending,
  };
};

export const usePollOptionDetailHook = (
  idGrupo: number | null,
  idEncuesta: number | null,
  idOpcion: number | null,
) => {
  const {
    data: detail,
    isLoading,
    error,
    refetch: loadDetail,
  } = useQuery({
    queryKey: [POLL_OPTION_DETAIL_KEY, idGrupo, idEncuesta, idOpcion],
    queryFn: async () => {
      if (!idGrupo || !idEncuesta || !idOpcion) return undefined;
      return await getOptionDetail(idGrupo, idEncuesta, idOpcion);
    },
    enabled: idGrupo !== null && idEncuesta !== null && idOpcion !== null,
  });

  let errorString: string | null = null;
  if (error instanceof Error) {
    errorString = error.message;
  } else if (error) {
    errorString = String(error);
  }

  return {
    detail,
    isLoading,
    error: errorString,
    loadDetail,
  };
};
