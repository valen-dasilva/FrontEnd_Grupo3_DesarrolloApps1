import { deleteItinerario, postItinerario } from '@/src/services/favoritosService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ExploreItineraryCard } from '../../components/Explorar/Card-Itinerario-Explorar';

// Mock favoritosService
jest.mock('@/src/services/favoritosService', () => ({
  postItinerario: jest.fn(() => Promise.resolve({ id: 987 })),
  deleteItinerario: jest.fn(() => Promise.resolve()),
}));

describe('ExploreItineraryCard Component', () => {
  const defaultProps = {
    idItinerario: 1,
    title: 'Itinerario de Prueba',
    description: 'Descripción del itinerario de prueba.',
    category: 'Cultura',
    image: 'https://example.com/image.jpg',
    rating: '4.5',
    duration: '3 días',
    startDate: '2026-06-12',
    endDate: '2026-06-15',
    isFavorite: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic information correctly', async () => {
    await render(<ExploreItineraryCard {...defaultProps} />);

    expect(screen.getByText('Itinerario de Prueba')).toBeTruthy();
    expect(screen.getByText('Cultura')).toBeTruthy();
    expect(screen.getByText('Descripción del itinerario de prueba.')).toBeTruthy();
    expect(screen.getByText('4.5')).toBeTruthy();
    expect(screen.getByText('3 días')).toBeTruthy();
  });

  test('navigates to details screen on press', async () => {
    const { useRouter } = require('expo-router');
    const mockPush = useRouter().push;

    await render(<ExploreItineraryCard {...defaultProps} />);

    const cardTitle = screen.getByText('Itinerario de Prueba');
    await fireEvent.press(cardTitle);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/explorarApp/itinerarioInfo',
      params: {
        idItinerario: '1',
        title: 'Itinerario de Prueba',
        description: 'Descripción del itinerario de prueba.',
        category: 'Cultura',
        image: 'https://example.com/image.jpg',
        startDate: '2026-06-12',
        endDate: '2026-06-15',
        isFavorite: 'false',
        idFavorito: '',
      },
    });
  });

  test('calls postItinerario when adding to favorites', async () => {
    const mockedPost = postItinerario as jest.Mock;
    mockedPost.mockResolvedValueOnce({ id: 987 });

    await render(<ExploreItineraryCard {...defaultProps} isFavorite={false} />);

    const heartButton = screen.getByTestId('heart-button');
    await fireEvent.press(heartButton);

    expect(mockedPost).toHaveBeenCalledWith(1);
    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledTimes(1);
    });
  });

  test('calls deleteItinerario when removing from favorites', async () => {
    const mockedDelete = deleteItinerario as jest.Mock;

    await render(<ExploreItineraryCard {...defaultProps} isFavorite={true} idFavorito={987} />);

    const heartButton = screen.getByTestId('heart-button');
    await fireEvent.press(heartButton);

    expect(mockedDelete).toHaveBeenCalledWith(987);
    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalledTimes(1);
    });
  });
});