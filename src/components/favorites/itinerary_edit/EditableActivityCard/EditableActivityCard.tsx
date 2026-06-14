import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { icons } from '@/constants/icons';
import { styles } from './EditableActivityCard.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { formatHora } from '@/utils/dateUtils';

export interface EditableActivityCardProps {
  /** The time of the activity (e.g., '09:00') */
  time: string;
  /** The title of the activity */
  title: string;
  /** Description of the activity */
  description: string;
  /** Location/Address of the activity */
  location: string;
  /** Callback triggered when the edit button is pressed */
  onEditPress?: () => void;
  /** Callback triggered when the delete button is pressed */
  onDeletePress?: () => void;
}

export const EditableActivityCard: React.FC<EditableActivityCardProps> = ({
  time,
  title,
  description,
  location,
  onEditPress,
  onDeletePress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.timeText, { color: theme.primary }]}>{formatHora(time)}</Text>

      <View style={styles.bottomInfoRow}>
        <View style={styles.detailsColumn}>
          <Text style={[styles.titleText, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.descriptionText, { color: theme.textSecondary }]} numberOfLines={1}>
            {description}
          </Text>
          <View style={styles.locationRow}>
            <MaterialIcons
              name={icons.Location}
              size={12}
              color={theme.textSecondary}
            />
            <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={onEditPress}
            style={({ pressed }) => [
              styles.actionButton,
              styles.editButton,
              pressed && styles.pressedState
            ]}
            accessibilityRole="button"
            accessibilityLabel="Editar actividad"
          >
            <MaterialIcons
              name={icons.Edit}
              size={20}
              color={theme.primary}
            />
          </Pressable>

          <Pressable
            onPress={onDeletePress}
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.pressedState
            ]}
            accessibilityRole="button"
            accessibilityLabel="Eliminar actividad"
          >
            <MaterialIcons
              name={icons.Delete}
              size={20}
              color={theme.danger}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
