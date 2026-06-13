
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './CreateActivityCard.styles';
import { useTheme } from '@/hooks/use-color-scheme';


export interface CreateActivityCardProps {
  /** Callback triggered when the card is pressed to create/add a new activity */
  onPress: () => void;
}

export const CreateActivityCard: React.FC<CreateActivityCardProps> = ({ onPress }) => {
  const { theme } = useTheme();

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
