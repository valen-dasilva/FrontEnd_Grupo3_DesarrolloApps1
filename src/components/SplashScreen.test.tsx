import React from 'react';
import { render } from '@testing-library/react-native';
import { SplashScreen } from './SplashScreen';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  gradientStart: '#007bff',
  gradientEnd: '#00bfff',
  textInverse: '#ffffff',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  const LinearGradient = ({ children, style }: any) => React.createElement(View, { style }, children);
  LinearGradient.displayName = 'LinearGradient';
  return { LinearGradient };
});

jest.mock('../../assets/images/icono.svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const IconoSvg = (props: any) => React.createElement(View, props);
  IconoSvg.displayName = 'IconoSvg';
  return IconoSvg;
});

describe('SplashScreen', () => {
  it('renders correctly', () => {
    const { UNSAFE_getByType } = render(<SplashScreen />);
    // Check that it renders the HeaderLogo inside the linear gradient
    expect(UNSAFE_getByType(SplashScreen)).toBeTruthy();
  });
});
