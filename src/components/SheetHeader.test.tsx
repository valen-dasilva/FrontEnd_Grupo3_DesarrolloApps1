import React from 'react';
import { render } from '@testing-library/react-native';
import { SheetHeader } from './SheetHeader';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  text: '#212529',
  textSecondary: '#6c757d',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('SheetHeader', () => {
  it('renders title and subtitle correctly', () => {
    const { getByText } = render(
      <SheetHeader title="Título de la Hoja" subtitle="Subtítulo detallado" />
    );
    expect(getByText('Título de la Hoja')).toBeTruthy();
    expect(getByText('Subtítulo detallado')).toBeTruthy();
  });
});
