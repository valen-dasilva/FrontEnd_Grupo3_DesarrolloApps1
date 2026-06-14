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
});
