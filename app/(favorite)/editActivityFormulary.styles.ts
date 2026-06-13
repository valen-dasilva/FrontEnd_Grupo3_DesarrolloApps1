import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { paddings } from '../../constants/paddings';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: paddings.spacing.lg,
    paddingTop: paddings.spacing.md,
    paddingBottom: paddings.spacing.huge,
  },
  title: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.xxl, // 24px
    fontWeight: fonts.weight.bold,
    color: colors.black,
    marginTop: paddings.spacing.sm,
    marginBottom: paddings.spacing.lg,
  },
});
