import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreateActivityCard } from './CreateActivityCard';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  surfaceHighlight: '#f5f5f5',
  primary: '#007bff',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('CreateActivityCard', () => {
  it('renders correctly and calls onPress when clicked', () => {
    const handlePress = jest.fn();
    const { getByText, getByRole } = render(
      <CreateActivityCard onPress={handlePress} />
    );

    expect(getByText('Agregar actividad +')).toBeTruthy();

    const button = getByRole('button', { name: 'Agregar nueva actividad' });
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});
