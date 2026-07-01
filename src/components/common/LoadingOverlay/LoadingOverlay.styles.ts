import { StyleSheet } from 'react-native';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    minWidth: 180,
    paddingVertical: paddings.spacing.xxl,
    paddingHorizontal: paddings.spacing.xxxl,
    borderRadius: paddings.radius.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    marginTop: paddings.spacing.md,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});