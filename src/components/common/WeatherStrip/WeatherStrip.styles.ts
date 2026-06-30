import { StyleSheet } from 'react-native';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: paddings.spacing.lg,
    marginBottom: paddings.spacing.md,
    borderRadius: paddings.radius.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.xs,
    paddingHorizontal: paddings.spacing.md,
    paddingTop: paddings.spacing.md,
    paddingBottom: paddings.spacing.sm,
  },
  headerTitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.headingBold,
  },
  unavailableContainer: {
    paddingHorizontal: paddings.spacing.md,
    paddingBottom: paddings.spacing.md,
  },
  unavailableText: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.bodyRegular,
  },
  listContent: {
    paddingHorizontal: paddings.spacing.md,
    paddingBottom: paddings.spacing.md,
    gap: paddings.spacing.sm,
  },
  dayItem: {
    alignItems: 'center',
    borderRadius: paddings.radius.sm,
    paddingVertical: paddings.spacing.sm,
    paddingHorizontal: paddings.spacing.md,
    minWidth: 64,
  },
  dayName: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.headingBold,
    marginBottom: 2,
  },
  dayMonth: {
    fontSize: fonts.size.xs - 1,
    fontFamily: fonts.family.bodyRegular,
    marginBottom: paddings.spacing.xs,
  },
  emoji: {
    fontSize: 22,
    marginBottom: paddings.spacing.xs,
  },
  temps: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.bodySemiBold,
  },
  tempsMin: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.bodyRegular,
  },
  loadingContainer: {
    paddingHorizontal: paddings.spacing.md,
    paddingBottom: paddings.spacing.md,
    alignItems: 'center',
  },
});
