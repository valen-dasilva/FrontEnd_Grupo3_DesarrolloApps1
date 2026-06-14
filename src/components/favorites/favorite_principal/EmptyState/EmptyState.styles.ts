import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface, // Translucent white from Figma (solid white for colors.ts compliance)
    borderRadius: 12, // Figma rounded-[12px]
    paddingVertical: 34, // Figma py-[34px]
    paddingHorizontal: paddings.spacing.lg, // 16px
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: paddings.spacing.lg,
    borderWidth: 2, // Figma border-2
    borderColor: colors.borderDark, // Matches #dce3ea in constants
    borderStyle: 'dashed',
    minHeight: 280,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceHighlight, // Light blue background matching the vector color style
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: paddings.spacing.xl,
  },
  title: {
    fontFamily: fonts.family.headingMedium, // Plus Jakarta Sans Medium
    fontSize: fonts.size.md, // 16px matching Figma title
    fontWeight: fonts.weight.medium,
    lineHeight: 24,
    color: colors.black, // Matches text-black
    marginBottom: paddings.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md, // 16px matching Figma description
    color: colors.text, // Matches #303030 in constants (#333333)
    textAlign: 'center',
    marginBottom: 28, // Matches Figma bottom margin before button
    lineHeight: 24, // Matches leading-[24px] in Figma
    paddingHorizontal: paddings.spacing.lg,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.warning, // Yellow CTA from Figma (mapped to colors.warning)
    paddingHorizontal: 24, // Matches Figma px-[24px]
    paddingVertical: 12, // Matches Figma py-[12px]
    borderRadius: paddings.radius.sm, // 8px matching Figma rounded-[8px]
    alignItems: 'center',
    justifyContent: 'center',
    gap: paddings.spacing.sm, // 8px
  },
  buttonText: {
    fontFamily: fonts.family.bodyRegular, // Matches font-['Inter:Regular']
    color: colors.black,
    fontSize: fonts.size.md, // 16px matching Figma button text
    fontWeight: fonts.weight.regular,
  },
  pressedState: {
    opacity: 0.8,
  },
});
