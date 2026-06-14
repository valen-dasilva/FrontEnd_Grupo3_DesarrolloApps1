import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { icons } from '@/constants/icons';
import { styles } from './Header.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';

export interface HeaderProps {
  /** The main title displayed on the left side of the header */
  title: string;
  /** Callback triggered when the theme toggle is pressed */
  onThemeTogglePress?: () => void;
  /** URL for the user's avatar. If not provided, a default or placeholder could be used */
  userAvatarUrl?: string;
  /** Callback triggered when the user avatar is pressed */
  onAvatarPress?: () => void;
  /** Callback triggered when the back button is pressed */
  onBackPress?: () => void;
  /** Option to show back button instead of only title */
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onThemeTogglePress,
  userAvatarUrl,
  onAvatarPress,
  onBackPress,
  showBackButton = false,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const handleThemeToggle = onThemeTogglePress || toggleColorScheme;
  const handleAvatarPress = onAvatarPress || (() => router.push('/(tabs)/perfil'));

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const activeAvatarUrl = userAvatarUrl || user?.fotoPerfil;

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.background,
        borderBottomColor: theme.border
      }
    ]}>
      <View style={styles.leftContainer}>
        {showBackButton && onBackPress && (
          <Pressable
            onPress={onBackPress}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressedState
            ]}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <MaterialIcons 
              name={icons.ArrowBack} 
              size={24} 
              color={theme.primary} 
            />
          </Pressable>
        )}
        <Text style={[
          styles.title,
          { color: isDark ? theme.text : '#2563eb' }
        ]}>{title}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable 
          onPress={handleThemeToggle} 
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: isDark ? theme.surface : '#FFFFFF',
              borderColor: theme.border
            },
            pressed && styles.pressedState
          ]}
          accessibilityRole="button"
          accessibilityLabel="Toggle Theme"
        >
          <MaterialIcons 
            name={icons.DarkMode}
            size={33}
            color={theme.primary}
          />
        </Pressable>

        <Pressable 
          onPress={handleAvatarPress}
          style={({ pressed }) => [
            styles.avatarContainer,
            pressed && styles.pressedState
          ]}
          accessibilityRole="button"
          accessibilityLabel="User Profile"
        >
          {activeAvatarUrl ? (
            <Image 
              source={{ uri: activeAvatarUrl }} 
              style={[styles.avatarImage, { backgroundColor: theme.borderDark }]} 
            />
          ) : (
            <View style={[styles.avatarImage, { backgroundColor: theme.avatarBg || theme.borderDark, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }]}>
              <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 16 }}>
                {user ? getInitials(user.nombre) : 'U'}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};
