import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import { paddings } from '@/constants/paddings';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  time: string;
  title: string;
  subtitle: string;
  location: string;
  isLast?: boolean;
};

export function ActivityCard({ time, title, subtitle, location, isLast = false }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={[styles.activityItem, isLast && styles.activityItemLast]}>
      <Text style={[styles.activityTime, { color: theme.primary }]}>{time}</Text>
      <Text style={[styles.activityTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.activitySubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      <View style={styles.locationRow}>
        <MaterialIcons name={icons.AddItinerary} size={fonts.size.sm} color={theme.textSecondary} />
        <Text style={[styles.locationText, { color: theme.textSecondary }]}>{location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    marginBottom: paddings.spacing.xxl,
  },
  activityItemLast: {
    marginBottom: 0,
  },
  activityTime: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.headingBold,
    color: colors.primary,
    marginBottom: paddings.spacing.xs,
  },
  activityTitle: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.headingBold,
    color: colors.text,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodyRegular,
    color: colors.textSecondary,
    marginBottom: paddings.spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.xs,
  },
  locationText: {
    fontSize: fonts.size.sm - 1,
    fontFamily: fonts.family.bodyRegular,
    color: colors.textSecondary,
  },
});
