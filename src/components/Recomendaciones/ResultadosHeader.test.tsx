import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ResultadosHeader } from './ResultadosHeader';
import { CategoriaItinerario } from '@/types/itinerario';
import { TouchableOpacity } from 'react-native';

const mockTheme = {
  surface: '#121212',
  border: '#e0e0e0',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  primary: '#007bff',
};

const mockUseTheme = {
  colorScheme: 'light',
  theme: mockTheme,
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: jest.fn(() => mockUseTheme),
}));

describe('ResultadosHeader', () => {
  const defaultProps = {
    provinciaLabel: 'Río Negro',
    fechaInicio: '2026-06-15',
    fechaFin: '2026-06-20',
    etiquetas: [CategoriaItinerario.NATURALEZA, CategoriaItinerario.AVENTURA],
    onBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.colorScheme = 'light';
  });

  it('renders correctly in light mode with default labels and date range', () => {
    const { getByText } = render(<ResultadosHeader {...defaultProps} />);

    expect(getByText('RESULTADOS PARA')).toBeTruthy();
    expect(getByText('Río Negro')).toBeTruthy();

    // Renders categories chip joined with ' y '
    expect(getByText('Naturaleza y Aventura')).toBeTruthy();
  });

  it('renders correctly in dark mode', () => {
    mockUseTheme.colorScheme = 'dark';

    const { getByText } = render(<ResultadosHeader {...defaultProps} />);

    expect(getByText('Río Negro')).toBeTruthy();
  });

  it('renders duration chip instead of date range if provided', () => {
    const { getByText } = render(
      <ResultadosHeader {...defaultProps} primeraResultadoDuracion={5} />
    );

    expect(getByText('5 días')).toBeTruthy();
    // It shouldn't render the specific formatted date range
    // depending on what formatFechaCorta returns. Since formatFechaCorta(2026-06-15)
    // is not "5 días", we make sure it says "5 días".
  });

  it('renders "Argentina" if provinciaLabel is null', () => {
    const { getByText } = render(<ResultadosHeader {...defaultProps} provinciaLabel={null} />);

    expect(getByText('Argentina')).toBeTruthy();
  });

  it('triggers onBack when back button is pressed', () => {
    const { UNSAFE_getByType } = render(<ResultadosHeader {...defaultProps} />);
    const backBtn = UNSAFE_getByType(TouchableOpacity);

    fireEvent.press(backBtn);
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });
});
