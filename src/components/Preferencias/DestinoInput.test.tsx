import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DestinoInput } from './DestinoInput';
import { TouchableOpacity } from 'react-native';

const mockTheme = {
  surface: '#ffffff',
  border: '#e0e0e0',
  text: '#212529',
  textSecondary: '#6c757d',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('DestinoInput', () => {
  const defaultProps = {
    value: undefined,
    placeholder: 'Ej: Río Negro, Salta...',
    onPress: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders placeholder when value is undefined', () => {
    const { getByText } = render(<DestinoInput {...defaultProps} />);

    expect(getByText('Ej: Río Negro, Salta...')).toBeTruthy();
  });

  it('renders value and shows clear button when value is provided', () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <DestinoInput {...defaultProps} value="Río Negro" />
    );

    expect(getByText('Río Negro')).toBeTruthy();

    // The component has two TouchableOpacity elements when value is provided:
    // 1st: The outer wrapper container
    // 2nd: The clear button (close icon)
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    expect(touchables.length).toBe(2);

    // Pressing the clear button
    fireEvent.press(touchables[1]);
    expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
    expect(defaultProps.onPress).not.toHaveBeenCalled();
  });

  it('calls onPress when the main container is pressed', () => {
    const { UNSAFE_getAllByType } = render(<DestinoInput {...defaultProps} />);
    const touchables = UNSAFE_getAllByType(TouchableOpacity);

    // There should be exactly 1 TouchableOpacity when value is undefined
    expect(touchables.length).toBe(1);

    fireEvent.press(touchables[0]);
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });
});
