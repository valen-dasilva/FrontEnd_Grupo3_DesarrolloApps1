import { StyleSheet } from 'react-native';

import { fonts } from '@/constants/fonts';

export const styles = StyleSheet.create({
  carousel: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    height: '100%',
  },
  initialImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
  },
  counterWrapper: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  counterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  counterText: {
    color: '#FFFFFF',
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.xs,
  },
  navigationButton: {
    position: 'absolute',
    top: '45%',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  previousButton: {
    left: 14,
  },
  nextButton: {
    right: 14,
  },
  disabledButton: {
    opacity: 0.25,
  },
});
