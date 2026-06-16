import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityCard } from './ActivityCard';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  textSecondary: '#6c757d',
  text: '#212529',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

jest.mock('@/utils/dateUtils', () => ({
  formatHora: (h: string) => h,
}));

describe('ActivityCard', () => {
  const defaultProps = {
    time: '10:00',
    title: 'Visita guiada',
    subtitle: 'Un recorrido histórico muy interesante',
    location: 'Cabildo Histórico',
  };

  it('renders all details correctly', () => {
    const { getByText } = render(<ActivityCard {...defaultProps} />);
    expect(getByText('10:00')).toBeTruthy();
    expect(getByText('Visita guiada')).toBeTruthy();
    expect(getByText('Un recorrido histórico muy interesante')).toBeTruthy();
    expect(getByText('Cabildo Histórico')).toBeTruthy();
  });
});
