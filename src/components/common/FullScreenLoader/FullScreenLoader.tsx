import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { fonts } from '@/constants/fonts';

interface FullScreenLoaderProps {
  message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ message }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      {message ? (
        <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
  },
});
