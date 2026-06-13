import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.md,
    marginBottom: paddings.spacing.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    borderTopLeftRadius: paddings.radius.md,
    borderTopRightRadius: paddings.radius.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    //position: "absolute",
  },
  heartButton: {
    position: 'absolute',
    top: paddings.spacing.md,
    right: paddings.spacing.md,
    backgroundColor: colors.surface,
    width: 35,
    height: 35,
    borderRadius: paddings.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: paddings.spacing.md,
    left: paddings.spacing.md,
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.lg,
    paddingHorizontal: paddings.spacing.md,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    color: colors.light.text,
    fontSize: fonts.size.sm - 1,
    fontFamily: fonts.family.bodySemiBold,
  },
  content: {
    padding: paddings.spacing.lg,
    gap: paddings.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.light.text,
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.headingBold,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: paddings.spacing.sm,
    paddingVertical: 4,
    borderRadius: paddings.radius.sm + 4,
    gap: 4,
  },
  ratingText: {
    color: colors.light.text,
    fontSize: fonts.size.sm - 1,
    fontFamily: fonts.family.bodySemiBold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fonts.size.sm,
    lineHeight: 20,
    fontFamily: fonts.family.bodyRegular,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: paddings.spacing.xs,
    marginTop: paddings.spacing.xs,
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodyRegular,
  },
});
