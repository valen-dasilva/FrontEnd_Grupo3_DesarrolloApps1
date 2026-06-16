import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { BottomSheet } from './BottomSheet';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  card: '#f8f9fa',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('BottomSheet', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <BottomSheet>
        <Text>Contenido BottomSheet</Text>
      </BottomSheet>
    );

    expect(getByText('Contenido BottomSheet')).toBeTruthy();
  });
});
