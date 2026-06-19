import { StyleSheet } from 'react-native';

import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    marginTop: paddings.spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: paddings.spacing.md,
  },
  title: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
  },
  helper: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginTop: paddings.spacing.xs,
  },
  counter: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
  },
  photoList: {
    gap: paddings.spacing.md,
    paddingVertical: paddings.spacing.xs,
  },
  preview: {
    width: 112,
    height: 112,
    borderRadius: paddings.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 112,
    height: 112,
    borderRadius: paddings.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paddings.spacing.xs,
  },
  addText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
