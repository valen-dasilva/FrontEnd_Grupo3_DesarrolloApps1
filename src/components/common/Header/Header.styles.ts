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
    height: 56, // Reduced from 64 to keep compact with multiple right actions
    paddingHorizontal: paddings.spacing.lg, // From frame 'Heading 1' x: 16
    backgroundColor: colors.surface, // Translucent white matching Figma (solid white for colors.ts compliance)
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Border bottom in Figma
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: paddings.spacing.md,
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
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.md, // Paragraph spacing between action icons
  },
  iconButton: {
    width: 44, // Reduced but above the minimum recommended touch target
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22, // Half of width/height to keep circle
    backgroundColor: colors.surface, // Figma bg-white
    borderWidth: 1,
    borderColor: colors.border, // Figma border-[#f3f4f6]
  },
  avatarContainer: {
    width: 44, // Matches iconButton to preserve alignment
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.borderDark, // Fallback color
  },
  pressedState: {
    opacity: 0.7,
  },
});
