import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../../../constants/colors';
import { icons } from '../../../../constants/icons';
import { styles } from './EmptyState.styles';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface EmptyStateProps {
  /** The main title for the empty state */
  title: string;
  /** Detailed description explaining the empty state */
  description: string;
  /** Label for the Call-To-Action button */
  actionLabel: string;
  /** Callback triggered when the CTA button is pressed */
  onActionPress: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onActionPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.surfaceHighlight }]}>
        <MaterialIcons
          name={icons.Save}
          size={32}
          color={theme.primary}
        />
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {description}
      </Text>

      <Pressable
        onPress={onActionPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.warning },
          pressed && styles.pressedState
        ]}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
      >
        <MaterialIcons
          name={icons.Explore}
          size={16}
          color={isDark ? theme.black : colors.black}
        />
        <Text style={[styles.buttonText, { color: isDark ? theme.black : colors.black }]}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
};
