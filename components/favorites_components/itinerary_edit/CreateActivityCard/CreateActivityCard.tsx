import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './CreateActivityCard.styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '../../../../constants/colors';

export interface CreateActivityCardProps {
  /** Callback triggered when the card is pressed to create/add a new activity */
  onPress: () => void;
}

export const CreateActivityCard: React.FC<CreateActivityCardProps> = ({ onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && styles.pressedState
      ]}
      accessibilityRole="button"
      accessibilityLabel="Agregar nueva actividad"
    >
      <View style={[styles.contentContainer, { backgroundColor: theme.surfaceHighlight }]}>
        <Text style={[styles.label, { color: theme.primary }]}>Agregar actividad +</Text>
      </View>
    </Pressable>
  );
};
