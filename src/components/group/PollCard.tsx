import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { PollStatus, PollSummary } from '@/types/poll';

interface PollCardProps {
  poll: PollSummary;
  onPress: () => void;
}

const STATUS_LABEL: Record<PollStatus, string> = {
  ABIERTA: 'Abierta',
  EMPATE: 'Empate',
  FINALIZADA: 'Finalizada',
};

const STATUS_COLOR: Record<PollStatus, string> = {
  ABIERTA: '#2563eb',
  EMPATE: '#FFC107',
  FINALIZADA: '#57A773',
};

export const PollCard: React.FC<PollCardProps> = ({ poll, onPress }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        pressed && { opacity: 0.8 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Encuesta ${poll.nombre ?? poll.idEncuesta}`}
    >
      <View style={styles.header}>
        {poll.nombre ? (
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {poll.nombre}
          </Text>
        ) : null}
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[poll.estado] + '20' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLOR[poll.estado] }]}>
            {STATUS_LABEL[poll.estado]}
          </Text>
        </View>
      </View>

      {poll.ganadorTitulo && (
        <View style={styles.winnerRow}>
          {poll.ganadorFotoPortada ? (
            <Image source={{ uri: poll.ganadorFotoPortada }} style={styles.winnerCover} contentFit="cover" />
          ) : (
            <View style={[styles.winnerCoverPlaceholder, { backgroundColor: theme.surfaceHighlight }]}>
              <MaterialIcons name={icons.Star} size={16} color={theme.primary} />
            </View>
          )}
          <View style={styles.winnerInfo}>
            <Text style={[styles.winnerLabel, { color: theme.textSecondary }]}>Ganadora</Text>
            <Text style={[styles.winnerTitle, { color: theme.text }]} numberOfLines={1}>
              {poll.ganadorTitulo}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.row}>
          <MaterialIcons name={icons.Poll} size={16} color={theme.textSecondary} />
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {poll.totalOpciones} opciones
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name={icons.People} size={16} color={theme.textSecondary} />
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {poll.cantidadVotos} votos
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: paddings.spacing.md,
    borderRadius: paddings.radius.md,
    borderWidth: 1,
    marginBottom: paddings.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: paddings.spacing.sm,
    gap: paddings.spacing.sm,
  },
  title: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.md,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: paddings.radius.sm,
  },
  statusText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.xs,
  },
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: paddings.spacing.md,
  },
  winnerCover: {
    width: 48,
    height: 48,
    borderRadius: paddings.radius.sm,
  },
  winnerCoverPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: paddings.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerInfo: {
    flex: 1,
    marginLeft: paddings.spacing.md,
  },
  winnerLabel: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.xs,
  },
  winnerTitle: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: paddings.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginLeft: 4,
  },
});
