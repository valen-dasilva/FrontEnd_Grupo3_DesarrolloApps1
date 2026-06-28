import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Header } from '@/components/common/Header/Header';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { OptionCard } from '@/components/group/OptionCard';
import { useAuth } from '@/context/AuthContext';

import { usePollDetailsHook } from '@/hooks/usePolls';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { PollOption, PollResult, PollStatus } from '@/types/poll';

const STATUS_LABEL: Record<PollStatus, string> = {
  ABIERTA: 'Abierta',
  EMPATE: 'Empate',
  FINALIZADA: 'Finalizada',
};

export default function PollDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { idGrupo, idEncuesta } = useLocalSearchParams<{ idGrupo: string; idEncuesta: string }>();
  const groupId = Number(idGrupo);
  const pollId = Number(idEncuesta);
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();

  const {
    poll,
    isLoading,
    error,
    castVote,
    finalize,
    isFinalizing,
    resolveTie,
    isResolvingTie,
    copyToMyTrips,
    isCopying,
    removePoll,
    isDeleting,
  } = usePollDetailsHook(
    Number.isNaN(groupId) ? null : groupId,
    Number.isNaN(pollId) ? null : pollId,
  );

  const [result, setResult] = useState<PollResult | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCreator = useMemo(() => {
    if (!user || !poll) return false;
    return poll.creadorId === user.idUsuario;
  }, [user, poll]);

  useEffect(() => {
    if (poll?.estado === 'FINALIZADA' && poll.opcionGanadora) {
      setResult({
        ganador: poll.opcionGanadora,
        empate: false,
        opcionesEmpatadas: poll.opciones.filter((o) => o.esGanadora),
      });
    }
    if (poll?.estado === 'EMPATE') {
      const maxVotos = Math.max(...poll.opciones.map((o) => o.cantidadVotos));
      setResult({
        ganador: null,
        empate: true,
        opcionesEmpatadas: poll.opciones.filter((o) => o.cantidadVotos === maxVotos),
      });
    }
  }, [poll]);

  const handleVote = (option: PollOption) => {
    castVote(option.id);
  };

  const handleFinalize = async () => {
    if (!isCreator || !poll?.puedeFinalizar || isFinalizing) return;
    const res = await finalize();
    if (res) setResult(res);
  };

  const handleBreakTie = async (option: PollOption) => {
    if (!isCreator || isResolvingTie) return;
    const res = await resolveTie(option.id);
    if (res) setResult(res);
  };

  const handleCopy = async () => {
    await copyToMyTrips();
    Alert.alert('Listo', 'El itinerario ganador se copió a tus viajes.');
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    await removePoll();
    setShowDeleteConfirm(false);
    router.back();
  };

  const handleOptionPress = (option: PollOption) => {
    router.push(
      `/(tabs)/(group)/detalleOpcion?idGrupo=${groupId}&idEncuesta=${pollId}&idOpcion=${option.id}` as Href,
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Encuesta" onThemeTogglePress={toggleColorScheme} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (error || !poll) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Encuesta" onThemeTogglePress={toggleColorScheme} />
        <View style={styles.centered}>
          <Text style={[styles.error, { color: theme.danger }]}>
            {error || 'No se pudo cargar la encuesta.'}
          </Text>
        </View>
      </View>
    );
  }

  const totalVotes = poll.opciones.reduce((sum, o) => sum + o.cantidadVotos, 0);
  const statusLabel = STATUS_LABEL[poll.estado];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Votación"
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: theme.surfaceHighlight }]}>
            <Text style={[styles.statusText, { color: theme.primary }]}>{statusLabel}</Text>
          </View>
          <Text style={[styles.votesTotal, { color: theme.textSecondary }]}>
            {totalVotes} votos
          </Text>
        </View>

        {poll.estado === 'ABIERTA' && (
          <>
            <Text style={[styles.pollName, { color: theme.text }]}>
              {poll.nombre ?? `Encuesta #${poll.idEncuesta}`}
            </Text>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              Tocá una opción para ver su detalle. Pulsá el pulgar para votar o cambiar tu voto.
            </Text>
            {poll.opciones.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                status={poll.estado}
                totalVotes={totalVotes}
                hasVotedThis={poll.idOpcionVotada === option.id}
                onPress={() => handleOptionPress(option)}
                onVotePress={() => handleVote(option)}
              />
            ))}
            {isCreator && poll.puedeFinalizar && (
              <Pressable
                onPress={handleFinalize}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: theme.primary },
                  pressed && { opacity: 0.8 },
                ]}
              >
                {isFinalizing ? (
                  <ActivityIndicator color={theme.textInverse} />
                ) : (
                  <>
                    <MaterialIcons name={icons.Poll} size={20} color={theme.textInverse} />
                    <Text style={[styles.primaryButtonText, { color: theme.textInverse }]}>
                      Finalizar encuesta
                    </Text>
                  </>
                )}
              </Pressable>
            )}
          </>
        )}

        {poll.estado === 'FINALIZADA' && (
          <>
            {result?.ganador ? (
              <View style={[styles.winnerCard, { backgroundColor: theme.surface, borderColor: theme.lightgreen }]}>
                <MaterialIcons name={icons.Star} size={28} color={theme.lightgreen} />
                <View style={styles.winnerInfo}>
                  <Text style={[styles.winnerLabel, { color: theme.lightgreen }]}>Ganadora</Text>
                  <Text style={[styles.winnerTitle, { color: theme.text }]}>
                    {result.ganador.tituloSnapshot}
                  </Text>
                  <Text style={[styles.winnerVotes, { color: theme.textSecondary }]}>
                    {result.ganador.cantidadVotos} votos
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={[styles.hint, { color: theme.textSecondary }]}>
                La encuesta finalizó sin opciones ganadoras.
              </Text>
            )}

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Resultados</Text>
            {poll.opciones.map((option) => (
              <OptionCard
                key={option.id}
                option={option}
                status={poll.estado}
                totalVotes={totalVotes}
                hasVotedThis={poll.idOpcionVotada === option.id}
                onPress={() => handleOptionPress(option)}
              />
            ))}

            <Pressable
              onPress={handleCopy}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              {isCopying ? (
                <ActivityIndicator color={theme.textInverse} />
              ) : (
                <>
                  <MaterialIcons name={icons.ContentCopy} size={20} color={theme.textInverse} />
                  <Text style={[styles.primaryButtonText, { color: theme.textInverse }]}>
                    Copiar a mis viajes
                  </Text>
                </>
              )}
            </Pressable>
          </>
        )}

        {poll.estado === 'EMPATE' && (
          <>
            <Text style={[styles.hint, { color: theme.textSecondary }]}>
              {isCreator
                ? 'Hay un empate. Elegí la opción ganadora.'
                : 'La encuesta está empatada. El creador debe elegir la opción ganadora.'}
            </Text>
            {poll.opciones.map((option) => {
              const isTied = result?.opcionesEmpatadas.some((g) => g.id === option.id) ?? false;
              return (
                <OptionCard
                  key={option.id}
                  option={option}
                  status={poll.estado}
                  totalVotes={totalVotes}
                  hasVotedThis={poll.idOpcionVotada === option.id}
                  onPress={() => (isCreator ? handleBreakTie(option) : handleOptionPress(option))}
                  disabled={!isCreator || isResolvingTie || !isTied}
                />
              );
            })}
          </>
        )}

        {isCreator && (
          <Pressable
            onPress={confirmDelete}
            disabled={isDeleting}
            style={({ pressed }) => [
              styles.deleteButton,
              { backgroundColor: theme.surface, borderColor: theme.danger },
              pressed && { opacity: 0.8 },
              isDeleting && { opacity: 0.6 },
            ]}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={theme.danger} />
            ) : (
              <>
                <MaterialIcons name={icons.Delete} size={20} color={theme.danger} />
                <Text style={[styles.deleteButtonText, { color: theme.danger }]}>
                  Eliminar encuesta
                </Text>
              </>
            )}
          </Pressable>
        )}
      </ScrollView>

      <ConfirmAlert
        visible={showDeleteConfirm}
        title="Eliminar encuesta"
        message="¿Estás seguro de que querés eliminar esta encuesta? Se borrarán todos los votos y opciones."
        cancelText="Cancelar"
        confirmText="Eliminar"
        loading={isDeleting}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    textAlign: 'center',
    paddingHorizontal: paddings.spacing.lg,
  },
  scroll: {
    padding: paddings.spacing.lg,
    paddingBottom: paddings.spacing.xxxl,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: paddings.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: paddings.radius.sm,
  },
  statusText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.sm,
  },
  votesTotal: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
  },
  hint: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    marginBottom: paddings.spacing.md,
  },
  pollName: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.xl,
    marginBottom: paddings.spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.lg,
    marginTop: paddings.spacing.md,
    marginBottom: paddings.spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: paddings.radius.md,
    marginTop: paddings.spacing.lg,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: paddings.spacing.lg,
    borderRadius: paddings.radius.md,
    borderWidth: 2,
    marginBottom: paddings.spacing.lg,
  },
  winnerInfo: {
    marginLeft: paddings.spacing.md,
  },
  winnerLabel: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
  },
  winnerTitle: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.lg,
    marginTop: 2,
  },
  winnerVotes: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginTop: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: paddings.radius.md,
    marginTop: paddings.spacing.lg,
    borderWidth: 1,
    gap: 8,
  },
  deleteButtonText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
