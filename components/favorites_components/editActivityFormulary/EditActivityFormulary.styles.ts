import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fonts } from '../../../constants/fonts';
import { paddings } from '../../../constants/paddings';

export const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    padding: paddings.spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.md,
    // Premium card shadow
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: paddings.spacing.xl,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: paddings.spacing.lg,
  },
  label: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm, // 14px
    fontWeight: fonts.weight.semibold,
    color: colors.text,
    marginBottom: paddings.spacing.sm,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: paddings.radius.sm, // 8px
    paddingHorizontal: paddings.spacing.md,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodyRegular,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 100,
    paddingTop: paddings.spacing.md,
    textAlignVertical: 'top', // Crucial for multiline on Android
  },
  rowFields: {
    flexDirection: 'row',
    gap: paddings.spacing.md,
    width: '100%',
  },
  halfField: {
    flex: 1,
  },
  saveButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: paddings.radius.md, // 16px
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: paddings.spacing.md,
    shadowColor: '#bfdbfe',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 3,
  },
  saveButtonText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm, // 14px
    fontWeight: fonts.weight.semibold,
    color: colors.textInverse,
  },
  cancelButton: {
    height: 52,
    backgroundColor: colors.danger,
    borderRadius: paddings.radius.md, // 16px
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: paddings.spacing.md,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  cancelButtonText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm, // 14px
    fontWeight: fonts.weight.semibold,
    color: colors.textInverse,
  },
  pressedState: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
