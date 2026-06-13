import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 64, // Extracted from Figma: 390x64
    paddingHorizontal: paddings.spacing.lg, // From frame 'Heading 1' x: 16
    backgroundColor: colors.surface, // Translucent white matching Figma (solid white for colors.ts compliance)
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Border bottom in Figma
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: paddings.spacing.sm,
    padding: paddings.spacing.xs,
  },
  title: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.xl, // 20px matching Heading 1 in Figma
    fontWeight: fonts.weight.bold,
    lineHeight: 28,
    color: colors.primary, // Extracted from visual context (#2563eb)
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.md, // Spacing between moon and avatar
  },
  iconButton: {
    width: 49, // Figma size-[49px]
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24.5, // Figma rounded-[24.5px]
    backgroundColor: colors.surface, // Figma bg-white
    borderWidth: 1,
    borderColor: colors.border, // Figma border-[#f3f4f6]
  },
  avatarContainer: {
    width: 49, // Figma size-[49px]
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24.5,
  },
  avatarImage: {
    width: 49,
    height: 49,
    borderRadius: 24.5,
    backgroundColor: colors.borderDark, // Fallback color
  },
  pressedState: {
    opacity: 0.7,
  },
});
