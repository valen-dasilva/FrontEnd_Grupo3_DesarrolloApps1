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
