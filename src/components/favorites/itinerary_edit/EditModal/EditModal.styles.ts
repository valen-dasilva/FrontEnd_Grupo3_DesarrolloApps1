import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dimmed overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: paddings.spacing.xl,
  },
  dismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.md, // 16px
    padding: paddings.spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.lg, // 18px
    fontWeight: fonts.weight.bold,
    color: colors.text,
    marginBottom: paddings.spacing.xs,
  },
  modalSubtitle: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm, // 14px
    color: colors.textSecondary,
    marginBottom: paddings.spacing.lg,
  },
  inputContainer: {
    width: '100%',
    height: 48,
    backgroundColor: colors.surfaceNeutralAlt,
    borderRadius: paddings.radius.sm, // 8px or similar
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: paddings.spacing.md,
    justifyContent: 'center',
    marginBottom: paddings.spacing.xl,
  },
  input: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md, // 16px
    color: colors.text,
    width: '100%',
    height: '100%',
    padding: 0,
    ...({ outlineStyle: 'none' } as any),
  },
  actionsRow: {
    flexDirection: 'row',
    gap: paddings.spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: paddings.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surfaceNeutral,
  },
  cancelButtonText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold,
    color: colors.textInverse,
  },
  pressedState: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
