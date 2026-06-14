import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoriaGrid } from './CategoriaGrid';
import { CategoriaItinerario } from '@/types/itinerario';

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

describe('CategoriaGrid', () => {
  const defaultProps = {
    seleccionadas: new Set([CategoriaItinerario.NATURALEZA, CategoriaItinerario.AVENTURA]),
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all category cards correctly', () => {
    const { getByText } = render(<CategoriaGrid {...defaultProps} />);

    expect(getByText('¿Qué te interesa?')).toBeTruthy();
    expect(getByText('Selecciona todas las categorías que quieras')).toBeTruthy();

    expect(getByText('Naturaleza')).toBeTruthy();
    expect(getByText('Gastronomía')).toBeTruthy();
    expect(getByText('Aventura')).toBeTruthy();
    expect(getByText('Cultura')).toBeTruthy();
    expect(getByText('Noche')).toBeTruthy();
    expect(getByText('Compra')).toBeTruthy();
  });

  it('triggers onToggle when a CategoriaCard is pressed', () => {
    const { getByText } = render(<CategoriaGrid {...defaultProps} />);

    const culturaCard = getByText('Cultura');
    fireEvent.press(culturaCard);

    expect(defaultProps.onToggle).toHaveBeenCalledWith(CategoriaItinerario.CULTURA);
  });
});
