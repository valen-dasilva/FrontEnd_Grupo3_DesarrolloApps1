import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  showArrow?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ title, variant = 'primary', showArrow = false, style, ...props }) => {
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  const getBackgroundStyle = () => {
    switch (variant) {
      case 'primary': 
        return { backgroundColor: theme.primary };
      case 'secondary': 
        return { 
          backgroundColor: isDark ? theme.surfaceHighlight : theme.surface,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? theme.borderDark : 'transparent',
        };
      case 'outline': 
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.primary,
        };
      default: 
        return { backgroundColor: theme.primary };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': 
        return { color: theme.textInverse };
      case 'secondary': 
        return { color: isDark ? theme.text : theme.primary };
      case 'outline': 
        return { color: theme.primary };
      default: 
        return { color: theme.textInverse };
    }
  };

  const textStyle = getTextStyle();

  return (
    <TouchableOpacity style={[styles.button, getBackgroundStyle(), style]} activeOpacity={0.8} {...props}>
      <View style={styles.contentContainer}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
        {showArrow && (
          <Ionicons name="arrow-forward" size={20} color={textStyle.color} style={styles.arrowIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});
