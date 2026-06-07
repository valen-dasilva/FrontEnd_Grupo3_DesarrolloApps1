import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import { styles } from './Button.styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '../../../../constants/colors';

export interface ButtonProps {
  /** The text label displayed inside the button */
  label: string;
  /** Callback triggered when the button is pressed */
  onPress: () => void;
  /** Disables interaction and changes background style */
  disabled?: boolean;
  /** Optional custom styles to override default button styles */
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary },
        disabled && { backgroundColor: theme.borderDark },
        pressed && !disabled && styles.pressedState,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.text, { color: theme.textInverse }]}>{label}</Text>
    </Pressable>
  );
};
