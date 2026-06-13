import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/use-color-scheme';
import { categoryIconMap } from '@/constants/categories';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

interface CategoryBadgeProps {
  category: string;
  style?: ViewStyle;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, style }) => {
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  const categoryIconName = categoryIconMap[category] || 'Museum';
  const iconName = icons[categoryIconName] || icons.Museum;

  // Filter out style keys that could override our design system values
  const {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    paddingHorizontal,
    paddingVertical,
    flexDirection,
    alignItems,
    gap,
    ...layoutStyle
  } = (style as any) || {};

  return (
    <View style={[
      styles.badge, 
      { 
        backgroundColor: theme.surface, 
        borderColor: theme.border, 
        borderWidth: 1,
        // Design system shadow tokens to elevate the badge over images
        shadowColor: theme.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 3,
        elevation: 3,
      },
      layoutStyle
    ]}>
      <MaterialIcons 
        name={iconName as any} 
        size={fonts.size.md + 1} 
        color={theme.primary} 
        style={styles.icon} 
      />
      <Text style={[styles.text, { color: theme.text }]}>
        {category}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: paddings.radius.lg,
    paddingHorizontal: paddings.spacing.md,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: fonts.size.sm - 1,
    fontFamily: fonts.family.bodySemiBold,
    marginLeft: 2,
  },
});
