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
  avatarCard: {
    borderRadius: paddings.radius.md,
    padding: paddings.spacing.xxl,
    alignItems: 'center',
    marginBottom: paddings.spacing.xl,
    borderWidth: 1,
  },
  avatarTouch: {
    marginBottom: paddings.spacing.md,
    borderRadius: 45,
    overflow: 'hidden',
  },
  nombre: {
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    fontSize: 13,
    marginTop: paddings.spacing.xs,
  },
  uploadButton: {
    width: 140,
    height: 38,
    marginTop: 14,
    borderRadius: paddings.radius.lg,
    marginVertical: 0,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: paddings.spacing.lg,
    marginBottom: paddings.spacing.sm,
    letterSpacing: 0.5,
  },
  optionRow: {
    borderRadius: 12,
    padding: paddings.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  statsRow: {
    flexDirection: 'row',
    gap: paddings.spacing.sm,
    marginBottom: paddings.spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: paddings.radius.md,
    padding: paddings.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  favCard: {
    borderRadius: paddings.radius.md,
    padding: paddings.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginBottom: paddings.spacing.md,
  },
  favLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  favValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  mapaCard: {
    borderRadius: paddings.radius.md,
    padding: paddings.spacing.lg,
    borderWidth: 1,
    marginBottom: paddings.spacing.md,
    alignItems: 'center',
  },
  mapaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: paddings.spacing.md,
  },
  mapaTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapaEmpty: {
    fontSize: 13,
    marginTop: paddings.spacing.sm,
    textAlign: 'center',
  },
});