import { StyleSheet } from 'react-native';
import { colors } from '../../../../constants/colors';
import { fonts } from '../../../../constants/fonts';
import { paddings } from '../../../../constants/paddings';

export const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 130, // Fixed height from Figma: 130px
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.md, // 16px radius
    padding: 17, // Figma padding p-[17px]
    marginBottom: paddings.spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight, // Figma border-[#dbeafe]
    justifyContent: 'space-between',
    // Premium shadow
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  timeText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm, // 14px
    fontWeight: fonts.weight.semibold,
    color: colors.primary, // Matches #2563eb
  },
  bottomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
    marginTop: paddings.spacing.sm,
  },
  detailsColumn: {
    flex: 1,
    marginRight: paddings.spacing.md,
  },
  titleText: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.sm, // 14px matching Figma (text-[14px])
    fontWeight: fonts.weight.bold,
    color: colors.text, // Matches Figma text-[#4d5565]
    marginBottom: 2,
  },
  descriptionText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.xs, // 12px
    color: colors.textSecondary, // Matches Figma text-[#4d5565]
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.xs, // 12px
    color: colors.textSecondary, // Matches Figma text-[#4d5565]
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8, // Figma gap-[8px]
    alignItems: 'center',
  },
  actionButton: {
    width: 28, // Figma size-[28px]
    height: 28,
    borderRadius: 8, // Figma rounded-[8px]
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  editButton: {
    backgroundColor: colors.transparent,
  },
  deleteButton: {
    backgroundColor: colors.transparent,
  },
  pressedState: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
