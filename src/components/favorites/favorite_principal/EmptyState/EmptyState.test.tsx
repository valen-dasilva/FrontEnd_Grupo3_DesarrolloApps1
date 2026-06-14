import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from './EmptyState';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  surfaceHighlight: '#f5f5f5',
  primary: '#007bff',
  warning: '#ffc107',
  text: '#212529',
  textSecondary: '#6c757d',
  textInverse: '#ffffff',
  black: '#000000',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
    toggleColorScheme: jest.fn(),
  }),
  useColorScheme: () => 'light',
}));

describe('EmptyState', () => {
  it('renders correctly with title, description and button label', () => {
    const handleActionPress = jest.fn();
    const { getByText, getByRole } = render(
      <EmptyState
        title="Test Title"
        description="Test Description"
        actionLabel="Click Me"
        onActionPress={handleActionPress}
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    
    const button = getByRole('button', { name: 'Click Me' });
    expect(button).toBeTruthy();

    fireEvent.press(button);
    expect(handleActionPress).toHaveBeenCalledTimes(1);
  });
});
