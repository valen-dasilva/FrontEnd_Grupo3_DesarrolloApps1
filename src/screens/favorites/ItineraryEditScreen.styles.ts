import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: paddings.spacing.xl,
    paddingBottom: paddings.spacing.huge,
  },
  titleInputWrapper: {
    marginBottom: paddings.spacing.md,
    paddingHorizontal: paddings.spacing.lg,
  },
  fechaWrapper: {
    paddingHorizontal: paddings.spacing.lg,
    marginBottom: paddings.spacing.xl,
  },
  fechaField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.md,
    borderWidth: 1,
    borderRadius: paddings.radius.lg,
    paddingHorizontal: paddings.spacing.lg,
    paddingVertical: paddings.spacing.md,
  },
  fechaFieldText: {
    flex: 1,
  },
  fechaFieldLabel: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.xs,
    marginBottom: 2,
  },
  fechaFieldValue: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
  },
  fechaDuration: {
    borderRadius: paddings.radius.lg,
    paddingHorizontal: paddings.spacing.md,
    paddingVertical: 4,
  },
  fechaDurationText: {
    fontSize: fonts.size.xs,
    fontWeight: fonts.weight.semibold,
  },
  photoSection: {
    paddingHorizontal: paddings.spacing.lg,
    marginBottom: paddings.spacing.xl,
  },
  emptyDayText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    textAlign: 'center',
    paddingVertical: paddings.spacing.md,
  },
  addActivityWrapper: {
    paddingHorizontal: paddings.spacing.lg,
    marginBottom: paddings.spacing.lg,
  },
  addActivityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: paddings.radius.lg,
    paddingVertical: 14,
  },
  addActivityText: {
    fontSize: fonts.size.md,
    fontWeight: fonts.weight.semibold,
  },
  daySection: {
    paddingHorizontal: paddings.spacing.lg,
    marginBottom: paddings.spacing.xl,
  },
  dayTitle: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: paddings.spacing.md,
  },
  activityList: {
    width: '100%',
  },
  buttonWrapper: {
    paddingHorizontal: 25,
    marginTop: paddings.spacing.md,
    marginBottom: paddings.spacing.lg,
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontFamily: fonts.family.bodyRegular,
    marginBottom: 16,
  },
});
