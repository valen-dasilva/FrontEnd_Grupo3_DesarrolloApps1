import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoriaCard } from './CategoriaCard';
import { CategoriaItinerario } from '@/types/itinerario';
import { Text, TouchableOpacity } from 'react-native';

const mockTheme = {
  categorySelected: '#ebf3ff',
  surface: '#ffffff',
  primary: '#007bff',
  border: '#e0e0e0',
  text: '#212529',
  textSecondary: '#6c757d',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('CategoriaCard', () => {
  const defaultProps = {
    value: CategoriaItinerario.NATURALEZA,
    icon: (color: string) => <Text testID="mock-icon">{color}</Text>,
    activa: false,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inactive state correctly', () => {
    const { getByText, getByTestId } = render(<CategoriaCard {...defaultProps} />);

    expect(getByText('Naturaleza')).toBeTruthy();

    const icon = getByTestId('mock-icon');
    expect(icon.props.children).toBe(mockTheme.textSecondary);
  });

  it('renders active state correctly', () => {
    const { getByText, getByTestId } = render(<CategoriaCard {...defaultProps} activa={true} />);

    expect(getByText('Naturaleza')).toBeTruthy();

    const icon = getByTestId('mock-icon');
    expect(icon.props.children).toBe(mockTheme.primary);
  });

  it('triggers onPress when clicked', () => {
    const { UNSAFE_getByType } = render(<CategoriaCard {...defaultProps} />);
    const touchable = UNSAFE_getByType(TouchableOpacity);

    fireEvent.press(touchable);
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });
});
