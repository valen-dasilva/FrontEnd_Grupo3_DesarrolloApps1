import React from 'react';
import { render } from '@testing-library/react-native';
import { CategoryBadge } from './CategoryBadge';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  text: '#212529',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
  }),
}));

describe('CategoryBadge', () => {
  it('renders the category text correctly', () => {
    const { getByText } = render(<CategoryBadge category="Naturaleza" />);
    expect(getByText('Naturaleza')).toBeTruthy();
  });
});
