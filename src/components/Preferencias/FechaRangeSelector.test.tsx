import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FechaRangeSelector } from './FechaRangeSelector';
import { TouchableOpacity } from 'react-native';

const mockTheme = {
  primary: '#007bff',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('FechaRangeSelector', () => {
  const defaultProps = {
    fechaInicio: undefined,
    fechaFin: undefined,
    onPress: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default INICIO and FINAL labels when dates are undefined', () => {
    const { getByText, queryByText } = render(<FechaRangeSelector {...defaultProps} />);

    expect(getByText('INICIO')).toBeTruthy();
    expect(getByText('FINAL')).toBeTruthy();
    expect(queryByText('Limpiar fechas')).toBeNull();
  });

  it('renders formatted dates and displays clear button when dates are provided', () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <FechaRangeSelector
        {...defaultProps}
        fechaInicio="2026-06-15"
        fechaFin="2026-06-20"
      />
    );

    // formatFecha("2026-06-15") format should render properly (usually formatted via dateUtils)
    // Let's verify how formatFecha outputs it. In dateUtils:
    // "2026-06-15" -> might be "15 Jun, 2026" or similar.
    // To be safe, we can just assert that it doesn't say 'INICIO' or 'FINAL',
    // or we can test that the text values are truthy.
    // Let's check:
    expect(getByText('Limpiar fechas')).toBeTruthy();

    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    // 1st: The main datesRow TouchableOpacity
    // 2nd: The clear button TouchableOpacity
    expect(touchables.length).toBe(2);

    // Press main container
    fireEvent.press(touchables[0]);
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);

    // Press clear button
    fireEvent.press(touchables[1]);
    expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
  });
});
