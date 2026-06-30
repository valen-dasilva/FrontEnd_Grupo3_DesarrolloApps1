import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { HeaderLogo } from './HeaderLogo';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  textInverse: '#ffffff',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

// Mock the BrandIcon SVG component to render as a View
jest.mock('../../assets/images/icono.svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const IconoSvg = (props: any) => React.createElement(View, props);
  IconoSvg.displayName = 'IconoSvg';
  return IconoSvg;
});

describe('HeaderLogo', () => {
  it('renders correctly with title and subtitle', () => {
    const { getByText } = render(
      <HeaderLogo title="MiApp" subtitle="Una aplicación genial" />
    );
    expect(getByText('MiApp')).toBeTruthy();
    expect(getByText('Una aplicación genial')).toBeTruthy();
  });

  it('renders large logo correct option', () => {
    const { UNSAFE_getAllByType } = render(<HeaderLogo largeLogo={true} />);
    // The SVGMock should be rendered
    const brandIcons = UNSAFE_getAllByType(View);
    expect(brandIcons.length).toBeGreaterThan(0);
  });
});
