import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export const AuthFooterLink: React.FC<AuthFooterLinkProps> = ({ text, linkText, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.registerContainer}>
      <Text style={[styles.registerText, { color: theme.textSecondary }]}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.registerLink, { color: theme.primary }]}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
