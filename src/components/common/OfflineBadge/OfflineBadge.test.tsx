import React from 'react';
import { render } from '@testing-library/react-native';
import { OfflineBadge } from './OfflineBadge';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  text: '#212529',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('OfflineBadge', () => {
  it('renders "Disponible Offline" text correctly', () => {
    const { getByText } = render(<OfflineBadge />);
    expect(getByText('Disponible Offline')).toBeTruthy();
  });
});
