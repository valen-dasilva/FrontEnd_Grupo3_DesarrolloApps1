import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 280,
    marginTop: 10,
    borderRadius: paddings.radius.xxl,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heroOverlay: {
    flex: 1,
    padding: paddings.spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circularContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomInfoContainer: {
    gap: paddings.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: paddings.spacing.md,
    paddingVertical: 6,
    borderRadius: paddings.radius.lg,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: colors.light.text,
    fontSize: fonts.size.sm - 1,
    fontWeight: fonts.weight.bold,
    marginLeft: 2,
  },
  title: {
    color: colors.textInverse,
    fontSize: fonts.size.xxxl,
    fontFamily: fonts.family.headingBold,
    lineHeight: 36,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  datesText: {
    color: colors.textInverse,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodySemiBold,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: fonts.size.md,
    color: colors.textSecondary,
    fontFamily: fonts.family.bodyRegular,
    textAlign: 'center',
    marginTop: paddings.spacing.xl,
    marginBottom: paddings.spacing.xxl,
  },
});
