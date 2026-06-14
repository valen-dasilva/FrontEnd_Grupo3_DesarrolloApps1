import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // Main background color inferred from Figma
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
    paddingBottom: paddings.spacing.xxl, // Extra padding at bottom
  },
  pageHeader: {
    paddingHorizontal: paddings.spacing.lg,
    paddingTop: paddings.spacing.lg, // Assuming gap after TopAppBar
    paddingBottom: paddings.spacing.xxl,
  },
  pageTitle: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.xxxl, // 32px matching Heading 2 in Figma
    fontWeight: fonts.weight.bold,
    lineHeight: 42,
    color: colors.text,
    marginBottom: paddings.spacing.sm,
  },
  pageSubtitle: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md, // 16px matching Figma subtitle
    color: colors.textSecondary,
    lineHeight: 26,
  },
  itinerariesContainer: {
    paddingHorizontal: paddings.spacing.lg,
  },
  emptyStateContainer: {
    flex: 1,
    paddingHorizontal: paddings.spacing.lg,
    justifyContent: 'center',
    paddingTop: paddings.spacing.huge,
  },
  emptyStateDemoContainer: {
    marginTop: paddings.spacing.xxxl,
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    paddingTop: paddings.spacing.lg,
  },
});
