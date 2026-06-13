import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceNeutral,
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
    shadowRadius: 8,
    elevation: 2,
  },
  dayTitle: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.headingBold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: paddings.spacing.xxl,
  },
});
