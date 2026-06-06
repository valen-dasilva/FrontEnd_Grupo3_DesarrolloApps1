import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../../constants/colors';
import { icons } from '../../../constants/icons';
import { styles } from './Header.styles';
import { useTheme } from '@/hooks/use-color-scheme';

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
  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const activeColors = isDark ? colors.dark : colors.light;

  const handleThemeToggle = onThemeTogglePress || toggleColorScheme;

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: activeColors.background,
        borderBottomColor: activeColors.border
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
              color={activeColors.primary} 
            />
          </Pressable>
        )}
        <Text style={[
          styles.title,
          { color: isDark ? activeColors.text : '#2563eb' }
        ]}>{title}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable 
          onPress={handleThemeToggle} 
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: isDark ? activeColors.surface : '#FFFFFF',
              borderColor: activeColors.border
            },
            pressed && styles.pressedState
          ]}
          accessibilityRole="button"
          accessibilityLabel="Toggle Theme"
        >
          <MaterialIcons 
            name={icons.DarkMode}
            size={33}
            color={activeColors.primary}
          />
        </Pressable>

        <Pressable 
          onPress={onAvatarPress}
          style={({ pressed }) => [
            styles.avatarContainer,
            pressed && styles.pressedState
          ]}
          accessibilityRole="button"
          accessibilityLabel="User Profile"
        >
          <Image 
            source={{ uri: userAvatarUrl || 'https://i.pravatar.cc/150' }} 
            style={[styles.avatarImage, { backgroundColor: activeColors.borderDark }]} 
          />
        </Pressable>
      </View>
    </View>
  );
};
