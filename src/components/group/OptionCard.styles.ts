import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: paddings.radius.md,
    marginBottom: paddings.spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardSelected: {
    borderWidth: 2,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    borderTopLeftRadius: paddings.radius.md,
    borderTopRightRadius: paddings.radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  voteButton: {
    position: 'absolute',
    top: paddings.spacing.md,
    right: paddings.spacing.md,
    width: 44,
    height: 44,
    borderRadius: paddings.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  winnerBadge: {
    position: 'absolute',
    top: paddings.spacing.md,
    left: paddings.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: paddings.spacing.sm,
    paddingVertical: 4,
    borderRadius: paddings.radius.sm,
    gap: 4,
  },
  winnerText: {
    fontSize: fonts.size.sm - 1,
    fontFamily: fonts.family.bodySemiBold,
  },
  content: {
    padding: paddings.spacing.lg,
    gap: paddings.spacing.sm,
  },
  title: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.headingBold,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.sm,
    marginTop: paddings.spacing.xs,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  votes: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodySemiBold,
    minWidth: 60,
    textAlign: 'right',
  },
});
