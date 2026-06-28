import React from 'react';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { PollOption, PollStatus } from '@/types/poll';
import { styles } from './OptionCard.styles';

interface OptionCardProps {
  option: PollOption;
  status: PollStatus;
  totalVotes: number;
  hasVotedThis?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onVotePress?: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  status,
  totalVotes,
  hasVotedThis,
  onPress,
  onVotePress,
  disabled,
}) => {
  const { theme } = useTheme();

  const isWinner = option.esGanadora;
  const voteDisabled = status !== 'ABIERTA' || disabled;
  const progress = totalVotes > 0 ? (option.cantidadVotos / totalVotes) * 100 : 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: hasVotedThis || isWinner ? theme.primary : theme.border,
        },
        (hasVotedThis || isWinner) && styles.cardSelected,
        pressed && { opacity: 0.9 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Opción ${option.tituloSnapshot}`}
    >
      <View style={styles.imageContainer}>
        {option.fotoPortadaSnapshot ? (
          <Image source={{ uri: option.fotoPortadaSnapshot }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: theme.surfaceHighlight, justifyContent: 'center', alignItems: 'center' }]}>
            <MaterialIcons name={icons.Location} size={48} color={theme.primary} />
          </View>
        )}

        {isWinner && (
          <View style={[styles.winnerBadge, { backgroundColor: theme.primary }]}>
            <MaterialIcons name={icons.EmojiEvents} size={14} color={theme.textInverse} />
            <Text style={[styles.winnerText, { color: theme.textInverse }]}>Ganadora</Text>
          </View>
        )}

        {onVotePress && (
          <Pressable
            onPress={(e: GestureResponderEvent) => {
              e.stopPropagation();
              onVotePress();
            }}
            disabled={voteDisabled}
            style={({ pressed }) => [
              styles.voteButton,
              {
                backgroundColor: theme.surface,
                shadowColor: theme.black,
              },
              pressed && { opacity: 0.8 },
              voteDisabled && { opacity: 0.5 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={hasVotedThis ? 'Cambiar voto' : 'Votar'}
          >
            <MaterialIcons
              name={hasVotedThis ? icons.ThumbUp : icons.ThumbUpOffAlt}
              size={24}
              color={hasVotedThis ? theme.primary : theme.button_gray}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {option.tituloSnapshot}
        </Text>

        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.fill,
                { width: `${progress}%`, backgroundColor: isWinner ? theme.lightgreen : theme.primary },
              ]}
            />
          </View>
          <Text style={[styles.votes, { color: theme.textSecondary }]}>
            {option.cantidadVotos} votos
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
