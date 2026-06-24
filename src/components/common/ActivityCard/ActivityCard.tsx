import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import { paddings } from '@/constants/paddings';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { formatHora } from '@/utils/dateUtils';

type Props = {
  time: string;
  title: string;
  subtitle: string;
  location: string;
  isLast?: boolean;
};

export function ActivityCard({ time, title, subtitle, location, isLast = false }: Props) {
  const { theme } = useTheme();

  const handleOpenMaps = () => {
    if (!location?.trim()) return;
    const query = encodeURIComponent(`${subtitle} ${location}`.trim());
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  };

  const hasLocation = !!location?.trim();

  return (
    <View style={[styles.activityItem, isLast && styles.activityItemLast]}>
      <Text style={[styles.activityTime, { color: theme.primary }]}>{formatHora(time)}</Text>
      <Text style={[styles.activityTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.activitySubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      <Pressable
        onPress={handleOpenMaps}
        disabled={!hasLocation}
        style={({ pressed }) => [styles.locationRow, hasLocation && pressed && styles.locationRowPressed]}
        accessibilityRole={hasLocation ? 'link' : 'text'}
        accessibilityLabel={hasLocation ? `Abrir ubicación en Maps: ${location}` : location}
      >
        <MaterialIcons name={icons.AddItinerary} size={fonts.size.sm} color={hasLocation ? theme.primary : theme.textSecondary} />
        <Text style={[styles.locationText, { color: hasLocation ? theme.primary : theme.textSecondary }]}>{location}</Text>
      </Pressable>
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
  locationRowPressed: {
    opacity: 0.6,
  },
  locationText: {
    fontSize: fonts.size.sm - 1,
    fontFamily: fonts.family.bodyRegular,
    color: colors.textSecondary,
  },
});
