import { StyleSheet } from 'react-native';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: paddings.spacing.xl,
    paddingBottom: paddings.spacing.huge,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginVertical: paddings.spacing.lg,
  },
});