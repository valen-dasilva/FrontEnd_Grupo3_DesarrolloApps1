import { StyleSheet } from 'react-native';
import { paddings } from '@/constants/paddings';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: paddings.spacing.xl,
    paddingBottom: paddings.spacing.huge,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: paddings.spacing.lg,
    marginBottom: paddings.spacing.sm,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paddings.spacing.sm,
    marginTop: paddings.spacing.md,
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 15,
  },
});