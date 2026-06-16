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
  lockCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: paddings.spacing.lg,
  },
  bigTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: paddings.spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: paddings.spacing.xl,
    lineHeight: 18,
  },
});