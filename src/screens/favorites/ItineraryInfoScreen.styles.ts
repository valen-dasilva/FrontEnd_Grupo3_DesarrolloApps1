import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: paddings.spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: paddings.spacing.xl,
    paddingBottom: paddings.spacing.huge,
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.xxl,
    padding: paddings.spacing.xxl,
    marginBottom: paddings.spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: paddings.radius.sm,
    elevation: 2,
  },
  lastDayCard: {
    marginBottom: paddings.spacing.huge,
  },
  dayTitle: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: paddings.spacing.xxl,
  },
  loader: {
    marginTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
  },
  completarBtnWrapper: {
    marginHorizontal: paddings.spacing.xl,
    marginTop: paddings.spacing.md,
    marginBottom: paddings.spacing.xl,
  },
  completarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: paddings.radius.md,
    borderWidth: 1.5,
  },
  completarBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
