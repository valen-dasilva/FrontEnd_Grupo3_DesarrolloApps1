import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    marginTop: paddings.spacing.sm + 2,
    marginBottom: paddings.spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fonts.size.xl + 2,
    fontFamily: fonts.family.headingBold,
    marginBottom: paddings.spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: paddings.radius.sm + 4,
    marginRight: paddings.spacing.md,
    paddingHorizontal: paddings.spacing.lg,
    paddingVertical: paddings.spacing.sm + 2,
    gap: paddings.spacing.sm,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryLabel: {
    color: colors.text,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodySemiBold,
  },
});
