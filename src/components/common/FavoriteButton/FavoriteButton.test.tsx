import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FavoriteButton } from './FavoriteButton';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  danger: '#dc3545',
  textSecondary: '#6c757d',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('FavoriteButton', () => {
  it('renders correctly as favorited', () => {
    const { getByLabelText } = render(<FavoriteButton isFavorite={true} />);
    expect(getByLabelText('Remove from favorites')).toBeTruthy();
  });

  it('renders correctly as not favorited', () => {
    const { getByLabelText } = render(<FavoriteButton isFavorite={false} />);
    expect(getByLabelText('Add to favorites')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<FavoriteButton isFavorite={false} onPress={onPress} />);
    const btn = getByLabelText('Add to favorites');
    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
