import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useColorScheme';

interface Props {
  uri?: string;
  nombre?: string;
  apellido?: string;
  size?: number;
  loading?: boolean;
}

export function UserAvatar({ uri, nombre = '', apellido = '', size = 90, loading = false }: Props) {
  const { theme } = useTheme();

  const getInitials = () => {
    const n = nombre.trim();
    const a = apellido.trim();
    if (n && a) {
      return (n[0] + a[0]).toUpperCase();
    }
    if (n) {
      const parts = n.split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const styles = StyleSheet.create({
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: theme.avatarBg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    initials: {
      fontSize: size * 0.31,
      fontWeight: '700',
      color: theme.primary,
    },
  });

  if (loading) {
    return (
      <View style={styles.circle}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.circle}>
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.image}
          cachePolicy="memory-disk"
          transition={200}
        />
      ) : (
        <Text style={styles.initials}>{getInitials()}</Text>
      )}
    </View>
  );
}
