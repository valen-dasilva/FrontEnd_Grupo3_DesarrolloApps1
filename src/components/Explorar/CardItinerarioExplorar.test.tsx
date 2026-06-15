import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExploreItineraryCard } from './CardItinerarioExplorar';
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
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
    toggleColorScheme: jest.fn(),
  }),
  useColorScheme: () => 'light',
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockToggleFavorite = jest.fn();
jest.mock('@/hooks/useFavoriteToggle', () => ({
  useFavoriteToggle: jest.fn(() => ({
    isFav: false,
    favId: undefined,
    toggleFavorite: mockToggleFavorite,
  })),
}));

describe('ExploreItineraryCard', () => {
  const defaultProps = {
    idItinerario: 45,
    title: 'Itinerario de Aventura',
    description: 'Una excursión emocionante por la cordillera.',
    category: 'Aventura',
    image: 'https://example.com/adventure.jpg',
    rating: '4.8',
    duration: '3 días',
    startDate: '2026-07-01',
    endDate: '2026-07-04',
    isFavorite: false,
    idFavorito: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all textual content and rating correctly', () => {
    const { getByText } = render(<ExploreItineraryCard {...defaultProps} />);

    expect(getByText('Itinerario de Aventura')).toBeTruthy();
    expect(getByText('Una excursión emocionante por la cordillera.')).toBeTruthy();
    expect(getByText('Aventura')).toBeTruthy();
    expect(getByText('4.8')).toBeTruthy();
    expect(getByText('3 días')).toBeTruthy();
  });

  it('navigates to the details screen with parameters on press', () => {
    const { UNSAFE_getByType } = render(<ExploreItineraryCard {...defaultProps} />);
    
    // The component top-level is TouchableOpacity
    const cardContainer = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(cardContainer);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(tabs)/explorarApp/itinerarioInfo',
      params: {
        idItinerario: '45',
        title: 'Itinerario de Aventura',
        description: 'Una excursión emocionante por la cordillera.',
        category: 'Aventura',
        image: 'https://example.com/adventure.jpg',
        startDate: '2026-07-01',
        endDate: '2026-07-04',
        isFavorite: 'false',
        idFavorito: '',
      },
    });
  });

  it('navigates with default/empty strings for optional values', () => {
    const { UNSAFE_getByType } = render(
      <ExploreItineraryCard
        idItinerario={45}
        title="Sin Fechas"
        description="Descripción corta"
        category="Cultura"
        image="https://example.com/image.jpg"
      />
    );

    const cardContainer = UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(cardContainer);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(tabs)/explorarApp/itinerarioInfo',
      params: {
        idItinerario: '45',
        title: 'Sin Fechas',
        description: 'Descripción corta',
        category: 'Cultura',
        image: 'https://example.com/image.jpg',
        startDate: '',
        endDate: '',
        isFavorite: 'false',
        idFavorito: '',
      },
    });
  });

  it('interacts with favorite toggle and favorite button', () => {
    const mockToggle = jest.fn();
    (useFavoriteToggle as jest.Mock).mockReturnValue({
      isFav: true,
      favId: 999,
      toggleFavorite: mockToggle,
    });

    const { getByLabelText } = render(
      <ExploreItineraryCard
        {...defaultProps}
        isFavorite={true}
        idFavorito={999}
      />
    );

    const favButton = getByLabelText('Remove from favorites');
    expect(favButton).toBeTruthy();

    fireEvent.press(favButton);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
