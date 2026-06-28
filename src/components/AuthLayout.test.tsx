import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthLayout } from './AuthLayout';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  gradientStart: '#007bff',
  gradientEnd: '#00bfff',
  textSecondary: '#6c757d',
  text: '#212529',
  borderDark: '#333333',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

jest.mock('../../assets/images/icono.svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const IconoSvg = (props: any) => React.createElement(View, props);
  IconoSvg.displayName = 'IconoSvg';
  return IconoSvg;
});

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style }: any) => React.createElement(View, { style }, children),
  };
});

describe('AuthLayout', () => {
  it('renders logo, headers, and children correctly', () => {
    const { getByText } = render(
      <AuthLayout
        headerSubtitle="Tu app de turismo"
        sheetTitle="Bienvenido"
        sheetSubtitle="Ingresa tus datos"
      >
        <Text>Contenido Hijo</Text>
      </AuthLayout>
    );

    expect(getByText('TuristeAR')).toBeTruthy();
    expect(getByText('Tu app de turismo')).toBeTruthy();
    expect(getByText('Bienvenido')).toBeTruthy();
    expect(getByText('Ingresa tus datos')).toBeTruthy();
    expect(getByText('Contenido Hijo')).toBeTruthy();
  });
});
