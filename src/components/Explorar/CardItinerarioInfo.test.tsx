import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ItineraryInfoCard } from './CardItinerarioInfo';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { Image, TouchableOpacity } from 'react-native';
import { formatDateRange } from '@/utils/dateUtils';

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

jest.mock('@/utils/dateUtils', () => ({
  formatDateRange: jest.fn(() => 'Mocked Formatted Date Range'),
}));

describe('ItineraryInfoCard', () => {
  const defaultProps = {
    idItinerario: 101,
    title: 'Atracción en Buenos Aires',
    category: 'Cultura',
    description: 'Descripción detallada de la atracción.',
    image: 'https://example.com/place.jpg',
    isFavorite: false,
    idFavorito: undefined,
    onBackPress: jest.fn(),
    onEditPress: jest.fn(),
    onDownloadPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all textual content and image correctly', () => {
    const { getByText, UNSAFE_getByType } = render(<ItineraryInfoCard {...defaultProps} />);

    expect(getByText('Atracción en Buenos Aires')).toBeTruthy();
    expect(getByText('Cultura')).toBeTruthy();
    expect(getByText('Descripción detallada de la atracción.')).toBeTruthy();

    // Verify it renders Image because image URL is provided
    const imageComponent = UNSAFE_getByType(Image);
    expect(imageComponent.props.source.uri).toBe('https://example.com/place.jpg');
  });

  it('renders fallback card container when image is not provided', () => {
    const { UNSAFE_getAllByType } = render(
      <ItineraryInfoCard
        {...defaultProps}
        image={undefined}
      />
    );

    // There should be no image component
    // Wait, react-native Image mock returns 'Image' component name, so we can verify if any exist
    // In our jest.setup.js, we mock 'react-native/Libraries/Image/Image' as rendering React.createElement('Image', ...)
    // So queryAllByTestId or similar, but here let's inspect the children or verify if an Image is rendered.
    // Wait! Let's check how many elements of type 'Image' are rendered.
    // If image is undefined, we render a View with StyleSheet.absoluteFillObject and background color.
    // Let's verify that no Image is found.
    // Note: UNSAFE_getAllByType will throw if none found, so we can use a try-catch or test structure:
    let images: any[] = [];
    try {
      images = UNSAFE_getAllByType(Image);
    } catch (e) {
      images = [];
    }
    expect(images.length).toBe(0);
  });

  it('resolves dateRange prop when provided', () => {
    const { getByText } = render(
      <ItineraryInfoCard
        {...defaultProps}
        dateRange="Rango Fijo de Fechas"
      />
    );

    expect(getByText('Rango Fijo de Fechas')).toBeTruthy();
    expect(formatDateRange).not.toHaveBeenCalled();
  });

  it('resolves startDate and endDate using formatDateRange utility', () => {
    const { getByText } = render(
      <ItineraryInfoCard
        {...defaultProps}
        dateRange={undefined}
        startDate="2026-07-01"
        endDate="2026-07-10"
      />
    );

    expect(getByText('Mocked Formatted Date Range')).toBeTruthy();
    expect(formatDateRange).toHaveBeenCalledWith('2026-07-01', '2026-07-10');
  });

  it('uses default date range if no dates are provided', () => {
    const { getByText } = render(
      <ItineraryInfoCard
        {...defaultProps}
        dateRange={undefined}
        startDate={undefined}
        endDate={undefined}
      />
    );

    expect(getByText('15 Oct - 22 Oct, 2024')).toBeTruthy();
  });

  it('triggers onBackPress when pressing the back button', () => {
    const { UNSAFE_getAllByType } = render(<ItineraryInfoCard {...defaultProps} />);
    
    // Buttons in top bar: Back and Favorite button.
    // In code, Back button is the first circularContainer TouchableOpacity.
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[0]); // Back button
    
    expect(defaultProps.onBackPress).toHaveBeenCalledTimes(1);
  });

  it('triggers onDownloadPress and onEditPress when buttons are pressed', () => {
    const { UNSAFE_getAllByType } = render(
      <ItineraryInfoCard
        {...defaultProps}
        onEditPress={defaultProps.onEditPress}
        onDownloadPress={defaultProps.onDownloadPress}
      />
    );

    // Touchables inside this view are:
    // 0: Back button
    // 1: Download button (TouchableOpacity)
    // 2: Edit button (TouchableOpacity)
    // Note: FavoriteButton is a Pressable, not a TouchableOpacity.
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    expect(touchables.length).toBe(3);

    // Let's press download (index 1)
    fireEvent.press(touchables[1]);
    expect(defaultProps.onDownloadPress).toHaveBeenCalledTimes(1);

    // Let's press edit (index 2)
    fireEvent.press(touchables[2]);
    expect(defaultProps.onEditPress).toHaveBeenCalledTimes(1);
  });

  it('handles toggle favorite when FavoriteButton is pressed', () => {
    const mockToggle = jest.fn();
    (useFavoriteToggle as jest.Mock).mockReturnValue({
      isFav: true,
      toggleFavorite: mockToggle,
    });

    const { getByLabelText } = render(
      <ItineraryInfoCard
        {...defaultProps}
        isFavorite={true}
      />
    );

    const favButton = getByLabelText('Remove from favorites');
    expect(favButton).toBeTruthy();

    fireEvent.press(favButton);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
