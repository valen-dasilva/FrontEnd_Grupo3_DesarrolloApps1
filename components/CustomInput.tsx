import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-color-scheme';

interface CustomInputProps extends TextInputProps {
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const CustomInput: React.FC<CustomInputProps> = ({ iconName, style, ...props }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
      {iconName && (
        <Ionicons name={iconName} size={20} color={theme.textSecondary} style={styles.icon} />
      )}
      <TextInput
        style={[styles.input, iconName ? styles.inputWithIcon : undefined, { color: theme.text }, style]}
        placeholderTextColor={theme.textSecondary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  icon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
});
