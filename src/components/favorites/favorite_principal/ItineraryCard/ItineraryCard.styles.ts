import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.md,
    marginBottom: paddings.spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
  },
  imageBackground: {
    width: '100%',
    height: 192, // From Figma Node 2449:1631 (height: 192)
    justifyContent: 'flex-start',
  },
  imageStyle: {
    borderTopLeftRadius: paddings.radius.md,
    borderTopRightRadius: paddings.radius.md,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: paddings.spacing.md, // From 'Offline Badge' x:12, y:12
  },
  contentContainer: {
    padding: paddings.spacing.lg, // From 'Margin' x:16, y:16 within Container 2449:1641
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: paddings.spacing.sm,
  },
  title: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm, // 14px matching Heading 4 in Figma
    fontWeight: fonts.weight.semibold,
    lineHeight: 17,
    color: colors.text,
    flex: 1,
    marginRight: paddings.spacing.sm,
  },
  durationBadge: {
    backgroundColor: colors.surfaceNeutral,
    paddingHorizontal: paddings.spacing.sm,
    paddingVertical: 4,
    borderRadius: paddings.radius.sm,
  },
  durationText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.xs,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
    lineHeight: 14.4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: paddings.spacing.lg,
  },
  locationText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    lineHeight: 21,
    color: colors.textSecondary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: paddings.spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: paddings.spacing.xl,
    paddingVertical: 10,
    borderRadius: paddings.radius.sm,
  },
  detailButtonText: {
    fontFamily: fonts.family.bodySemiBold,
    color: colors.textInverse,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    lineHeight: 20,
  },
  pinButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: paddings.radius.lg,
    backgroundColor: colors.background,
  },
  rightActionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: paddings.radius.lg,
    backgroundColor: colors.transparent,
  },
  pressedState: {
    opacity: 0.8,
  },
});
