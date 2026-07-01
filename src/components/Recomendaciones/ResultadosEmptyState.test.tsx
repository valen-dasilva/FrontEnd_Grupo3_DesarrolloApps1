import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ResultadosEmptyState } from './ResultadosEmptyState';
import { TouchableOpacity } from 'react-native';

const mockTheme = {
  text: '#212529',
  textSecondary: '#6c757d',
  primary: '#007bff',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('ResultadosEmptyState', () => {
  it('renders correctly and calls onBack when button is pressed', () => {
    const handleBack = jest.fn();
    const { getByText, UNSAFE_getByType } = render(
      <ResultadosEmptyState onBack={handleBack} />
    );

    expect(getByText('Sin resultados')).toBeTruthy();
    expect(getByText('Probá con otros filtros o fechas distintas.')).toBeTruthy();
    expect(getByText('Volver a preferencias')).toBeTruthy();

    const button = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(button);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('shows 1-day message when duracion is "1"', () => {
    const { getByText } = render(
      <ResultadosEmptyState onBack={jest.fn()} duracion="1" />
    );

    expect(getByText('No hay itinerarios de 1 día. Probá con otra duración.')).toBeTruthy();
  });

  it('shows 2-3 days message when duracion is "2-3"', () => {
    const { getByText } = render(
      <ResultadosEmptyState onBack={jest.fn()} duracion="2-3" />
    );

    expect(getByText('No hay itinerarios de 2-3 días. Probá con otra duración.')).toBeTruthy();
  });

  it('shows 4+ days message when duracion is "4+"', () => {
    const { getByText } = render(
      <ResultadosEmptyState onBack={jest.fn()} duracion="4+" />
    );

    expect(getByText('No hay itinerarios de 4 o más días. Probá con otra duración.')).toBeTruthy();
  });
});
