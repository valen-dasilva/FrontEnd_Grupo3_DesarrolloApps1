import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '../../../../constants/colors';
import { styles } from './InputTitulo.styles';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface InputTituloProps {
  /** The value of the input */
  value: string;
  /** Callback triggered when the text changes */
  onChangeText: (text: string) => void;
  /** Label text (defaults to 'Título') */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
}

export const InputTitulo: React.FC<InputTituloProps> = ({
  value,
  onChangeText,
  label = 'Título',
  placeholder = 'Escribe el título aquí...',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }, isFocused && { borderColor: theme.primary }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
        />
      </View>
    </View>
  );
};
