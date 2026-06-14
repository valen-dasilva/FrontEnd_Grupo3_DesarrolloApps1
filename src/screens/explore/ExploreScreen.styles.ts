import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceNeutral,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surfaceNeutral,
    paddingTop: 0,
    paddingHorizontal: paddings.spacing.xl,
  },
});
