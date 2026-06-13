import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  heartButton: {
    backgroundColor: colors.surface,
    width: 32,
    height: 32,
    borderRadius: paddings.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    // Premium shadow for iOS
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
