import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: paddings.radius.lg,
    gap: 6,
  },
  offlineBadgeText: {
    fontFamily: fonts.family.bodySemiBold,
    color: colors.primary,
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
    lineHeight: 14.4,
  },
});
