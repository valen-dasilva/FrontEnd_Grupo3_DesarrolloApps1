import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingBottom: paddings.spacing.lg, // Aproximación a 14px
    paddingTop: paddings.spacing.lg, // Aproximación a 15px
    paddingHorizontal: paddings.spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    // Sombra premium
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 76,
    height: 48,
    overflow: 'hidden',
  },
  contentWrapperActive: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 10,
  },
  tabLabel: {
    fontFamily: fonts.family.headingMedium,
    fontSize: 11,
    fontWeight: fonts.weight.medium,
    lineHeight: 14,
    color: colors.button_gray,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
