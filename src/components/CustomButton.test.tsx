import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomButton } from './CustomButton';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  textInverse: '#ffffff',
  text: '#212529',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
  }),
}));

describe('CustomButton', () => {
  it('renders correctly with given title', () => {
    const { getByText } = render(<CustomButton title="Presionar" />);
    expect(getByText('Presionar')).toBeTruthy();
  });

  it('triggers onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByText } = render(<CustomButton title="Presionar" onPress={onPress} />);
    const btn = getByText('Presionar');
    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
