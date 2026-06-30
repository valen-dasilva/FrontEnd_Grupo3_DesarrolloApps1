import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DuracionCarousel } from './DuracionCarousel';

const mockTheme = {
  background: '#ffffff',
  text: '#212529',
  textSecondary: '#6c757d',
  categorySelected: '#ebf3ff',
  surface: '#ffffff',
  primary: '#007bff',
  border: '#e0e0e0',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('DuracionCarousel', () => {
  const defaultProps = {
    seleccionada: undefined,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all duration options correctly', () => {
    const { getByText } = render(<DuracionCarousel {...defaultProps} />);

    expect(getByText('¿Cuántos días?')).toBeTruthy();
    expect(getByText('Selecciona la duración ideal para tu viaje')).toBeTruthy();

    expect(getByText('🤷')).toBeTruthy();
    expect(getByText('1 Día')).toBeTruthy();
    expect(getByText('2-3 Días')).toBeTruthy();
    expect(getByText('4+ Días')).toBeTruthy();
  });

  it('triggers onSelect when an option is pressed', () => {
    const { getByText } = render(<DuracionCarousel {...defaultProps} />);

    const option23Days = getByText('2-3 Días');
    fireEvent.press(option23Days);

    expect(defaultProps.onSelect).toHaveBeenCalledWith('2-3');
  });
});
