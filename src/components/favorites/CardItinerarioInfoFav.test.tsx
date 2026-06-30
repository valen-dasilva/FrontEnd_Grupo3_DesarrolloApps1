import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CardItinerarioInfoFav } from './CardItinerarioInfoFav';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { TouchableOpacity } from 'react-native';

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
  card: '#f8f9fa',
  danger: '#dc3545',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
    toggleColorScheme: jest.fn(),
  }),
  useColorScheme: () => 'light',
}));

const mockToggleFavorite = jest.fn();
jest.mock('@/hooks/useFavoriteToggle', () => ({
  useFavoriteToggle: jest.fn(() => ({
    isFav: false,
    favId: undefined,
    toggleFavorite: mockToggleFavorite,
  })),
}));

describe('CardItinerarioInfoFav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <CardItinerarioInfoFav
        title="Teatro Colón"
        category="Cultura"
        dateRange="15 Oct - 22 Oct"
        description="Una visita espectacular"
      />
    );

    expect(getByText('Teatro Colón')).toBeTruthy();
    expect(getByText('15 Oct - 22 Oct')).toBeTruthy();
    expect(getByText('Una visita espectacular')).toBeTruthy();
  });

  it('handles onBackPress correctly', () => {
    const handleBackPress = jest.fn();
    const { UNSAFE_getByType } = render(
      <CardItinerarioInfoFav
        title="Teatro Colón"
        onBackPress={handleBackPress}
      />
    );

    const backButton = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(backButton);
    expect(handleBackPress).toHaveBeenCalledTimes(1);
  });

  it('handles edit and download callbacks correctly', () => {
    const handleEditPress = jest.fn();
    const handleDownloadPress = jest.fn();
    
    const { UNSAFE_getAllByType } = render(
      <CardItinerarioInfoFav
        title="Teatro Colón"
        onEditPress={handleEditPress}
        onDownloadPress={handleDownloadPress}
      />
    );

    // There should be three TouchableOpacity components (back button, download button, edit button)
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    expect(touchables.length).toBe(3);

    // According to the code, the layout is:
    // 1st: Back button
    // 2nd: Download button
    // 3rd: Edit button
    fireEvent.press(touchables[1]);
    expect(handleDownloadPress).toHaveBeenCalledTimes(1);

    fireEvent.press(touchables[2]);
    expect(handleEditPress).toHaveBeenCalledTimes(1);
  });

  it('renders favorite button and handles toggle press', () => {
    const mockToggle = jest.fn();
    (useFavoriteToggle as jest.Mock).mockReturnValue({
      isFav: true,
      favId: 123,
      toggleFavorite: mockToggle,
    });

    const { getByLabelText } = render(
      <CardItinerarioInfoFav
        title="Teatro Colón"
        isFavorite={true}
        idFavorito={123}
      />
    );

    const favButton = getByLabelText('Remove from favorites');
    expect(favButton).toBeTruthy();

    fireEvent.press(favButton);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});

