import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FiltrosDeBusqueda } from './FiltrosBusqueda';
import { Provincia } from '@/types/itinerario';
import { TouchableOpacity } from 'react-native';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  text: '#212529',
  textSecondary: '#6c757d',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
  }),
}));

// Mock ProvinciaSelector to isolate FiltrosDeBusqueda and check state interactions
jest.mock('@/components/Preferencias/ProvinciaSelector', () => {
  const { View, Button, Text } = require('react-native');
  return {
    ProvinciaSelector: ({ visible, onClose, onSelect, selected }: any) => {
      if (!visible) return null;
      return (
        <View testID="mock-provincia-selector">
          <Text testID="selected-prop">{selected || 'none'}</Text>
          <Button title="Mock Select CABA" onPress={() => onSelect('CABA')} />
          <Button title="Mock Close" onPress={onClose} />
        </View>
      );
    },
  };
});

describe('FiltrosDeBusqueda', () => {
  const defaultProps = {
    selectedProvincia: undefined,
    onProvinciaChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state and placeholder', () => {
    const { getByText, queryByTestId } = render(<FiltrosDeBusqueda {...defaultProps} />);

    expect(getByText('¿A dónde quieres ir?')).toBeTruthy();
    expect(getByText('Ej: Río Negro, Salta, Buenos Aires...')).toBeTruthy();
    expect(queryByTestId('mock-provincia-selector')).toBeNull();
  });

  it('opens ProvinciaSelector when clicking the input area', () => {
    const { getByText, getByTestId, queryByTestId } = render(<FiltrosDeBusqueda {...defaultProps} />);

    expect(queryByTestId('mock-provincia-selector')).toBeNull();

    const inputArea = getByText('Ej: Río Negro, Salta, Buenos Aires...');
    fireEvent.press(inputArea);

    expect(getByTestId('mock-provincia-selector')).toBeTruthy();
  });

  it('displays the selected province and can clear it', () => {
    const { getByText, UNSAFE_getByType } = render(
      <FiltrosDeBusqueda
        selectedProvincia={Provincia.RIO_NEGRO}
        onProvinciaChange={defaultProps.onProvinciaChange}
      />
    );

    // Should display the label "Río Negro" from PROVINCIA_LABEL
    expect(getByText('Río Negro')).toBeTruthy();

    // There should be a sub-TouchableOpacity inside the main touchable for clearing the value
    // The main row is TouchableOpacity. The cancel button is another TouchableOpacity nested inside.
    const touchables = UNSAFE_getByType(TouchableOpacity).findAllByType(TouchableOpacity);
    expect(touchables.length).toBe(2); // The root and the nested cancel button

    // Press the nested cancel button (index 1)
    fireEvent.press(touchables[1], { stopPropagation: jest.fn() });
    expect(defaultProps.onProvinciaChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onProvinciaChange).toHaveBeenCalledWith(undefined);
  });

  it('calls onProvinciaChange and closes modal when selector chooses a province', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <FiltrosDeBusqueda {...defaultProps} />
    );

    // Open modal
    fireEvent.press(getByText('Ej: Río Negro, Salta, Buenos Aires...'));
    expect(getByTestId('mock-provincia-selector')).toBeTruthy();

    // Select a province inside the mock selector
    fireEvent.press(getByText('Mock Select CABA'));

    expect(defaultProps.onProvinciaChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onProvinciaChange).toHaveBeenCalledWith('CABA');
    
    // Selector modal should close
    expect(queryByTestId('mock-provincia-selector')).toBeNull();
  });

  it('closes modal when selector triggers onClose callback', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <FiltrosDeBusqueda {...defaultProps} />
    );

    // Open modal
    fireEvent.press(getByText('Ej: Río Negro, Salta, Buenos Aires...'));
    expect(getByTestId('mock-provincia-selector')).toBeTruthy();

    // Close selector inside the mock selector
    fireEvent.press(getByText('Mock Close'));

    // Selector modal should close and onProvinciaChange should not be called
    expect(queryByTestId('mock-provincia-selector')).toBeNull();
    expect(defaultProps.onProvinciaChange).not.toHaveBeenCalled();
  });
});
