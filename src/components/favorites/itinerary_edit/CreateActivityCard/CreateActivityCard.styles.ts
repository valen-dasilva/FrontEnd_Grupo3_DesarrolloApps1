import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 100, // Height is slightly compact compared to 130px of ActivityCard, making it clear it is a creation action
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.md, // 16px radius
    borderWidth: 2,
    borderColor: colors.surfaceHighlight, // Accent light blue/gray border matching Figma
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: paddings.spacing.md,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.sm, // 8px
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: paddings.radius.round, // Circular shape
    backgroundColor: colors.surfaceHighlight, // Light blue accent backdrop
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm, // 14px
    fontWeight: fonts.weight.semibold,
    color: colors.primary, // Sleek primary color matching active states
  },
  pressedState: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }], // Elegant micro-interaction on tap
  },
});
