import { deleteItinerario, postItinerario } from '@/src/services/favoritosService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ItineraryInfoCard } from '../../components/Explorar/Card-Itinerario-Info';

// Mock favoritosService
jest.mock('@/src/services/favoritosService', () => ({
  postItinerario: jest.fn(() => Promise.resolve({ id: 987 })),
  deleteItinerario: jest.fn(() => Promise.resolve()),
}));

describe('ItineraryInfoCard Component', () => {
  const defaultProps = {
    idItinerario: 10,
    title: 'Teatro Colón Tour',
    category: 'Cultura',
    startDate: '2026-10-15T12:00:00',
    endDate: '2026-10-22T12:00:00',
    description: 'Una hermosa visita guiada.',
    image: 'https://example.com/teatro.jpg',
    isFavorite: false,
    onBackPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with correct details and formatted date range', async () => {
    await render(<ItineraryInfoCard {...defaultProps} />);

    expect(screen.getByText('Teatro Colón Tour')).toBeTruthy();
    expect(screen.getByText('Cultura')).toBeTruthy();
    expect(screen.getByText('Una hermosa visita guiada.')).toBeTruthy();
    expect(screen.getByText('15 - 22 Oct, 2026')).toBeTruthy();
  });

  test('calls onBackPress when clicking the back button', async () => {
    await render(<ItineraryInfoCard {...defaultProps} />);

    const backButton = screen.getByTestId('back-button');
    await fireEvent.press(backButton);

    expect(defaultProps.onBackPress).toHaveBeenCalledTimes(1);
  });

  test('calls postItinerario when adding to favorites', async () => {
    const mockedPost = postItinerario as jest.Mock;
    mockedPost.mockResolvedValueOnce({ id: 555 });

    await render(<ItineraryInfoCard {...defaultProps} isFavorite={false} />);

    const heartButton = screen.getByTestId('heart-button');
    await fireEvent.press(heartButton);

    expect(mockedPost).toHaveBeenCalledWith(10);
    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledTimes(1);
    });
  });

  test('calls deleteItinerario when removing from favorites', async () => {
    const mockedDelete = deleteItinerario as jest.Mock;

    await render(<ItineraryInfoCard {...defaultProps} isFavorite={true} idFavorito={555} />);

    const heartButton = screen.getByTestId('heart-button');
    await fireEvent.press(heartButton);

    expect(mockedDelete).toHaveBeenCalledWith(555);
    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalledTimes(1);
    });
  });
});