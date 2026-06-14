import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ItineraryCard } from './ItineraryCard';

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
  surfaceNeutral: '#e9ecef',
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

// Mock components used inside ItineraryCard if needed, or let them render
// FavoriteButton is already simple, OfflineBadge is simple too. Let's see if we need to mock them.
// We don't need to mock them because they are standard components that render easily.

describe('ItineraryCard', () => {
  const defaultProps = {
    title: 'Viaje a Bariloche',
    location: 'Río Negro, Argentina',
    duration: '5 Días',
    imageUrl: 'https://example.com/image.jpg',
    onPressDetail: jest.fn(),
    onFavoriteToggle: jest.fn(),
    onPinPress: jest.fn(),
    onDownloadPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all textual content and image correctly', () => {
    const { getByText } = render(<ItineraryCard {...defaultProps} />);

    expect(getByText('Viaje a Bariloche')).toBeTruthy();
    expect(getByText('Río Negro, Argentina')).toBeTruthy();
    expect(getByText('5 Días')).toBeTruthy();
    expect(getByText('Ver Detalle')).toBeTruthy();
  });

  it('renders offline available badge and correct download label when offline available is true', () => {
    const { getByText, getByLabelText } = render(
      <ItineraryCard {...defaultProps} isOfflineAvailable={true} />
    );

    // Should display OfflineBadge (text: "Disponible Offline")
    expect(getByText('Disponible Offline')).toBeTruthy();

    const downloadBtn = getByLabelText('Eliminar descarga de itinerario');
    expect(downloadBtn).toBeTruthy();

    fireEvent.press(downloadBtn);
    expect(defaultProps.onDownloadPress).toHaveBeenCalledTimes(1);
  });

  it('renders no offline badge and correct download label when offline available is false', () => {
    const { queryByText, getByLabelText } = render(
      <ItineraryCard {...defaultProps} isOfflineAvailable={false} />
    );

    expect(queryByText('Disponible Offline')).toBeNull();

    const downloadBtn = getByLabelText('Descargar itinerario');
    expect(downloadBtn).toBeTruthy();
  });

  it('renders correct pin label based on isPinned prop', () => {
    const { getByLabelText, rerender } = render(
      <ItineraryCard {...defaultProps} isPinned={true} />
    );

    expect(getByLabelText('Unpin itinerary')).toBeTruthy();

    // Trigger pin press
    fireEvent.press(getByLabelText('Unpin itinerary'));
    expect(defaultProps.onPinPress).toHaveBeenCalledTimes(1);

    rerender(<ItineraryCard {...defaultProps} isPinned={false} />);
    expect(getByLabelText('Pin itinerary')).toBeTruthy();
  });

  it('triggers onPressDetail when "Ver Detalle" button is pressed', () => {
    const { getByText } = render(<ItineraryCard {...defaultProps} />);
    const detailBtn = getByText('Ver Detalle');

    fireEvent.press(detailBtn);
    expect(defaultProps.onPressDetail).toHaveBeenCalledTimes(1);
  });

  it('triggers onFavoriteToggle when FavoriteButton is pressed', () => {
    const { getByLabelText } = render(<ItineraryCard {...defaultProps} isFavorite={true} />);
    // FavoriteButton has accessibilityLabel="Remove from favorites" when isFavorite is true
    const favBtn = getByLabelText('Remove from favorites');

    fireEvent.press(favBtn);
    expect(defaultProps.onFavoriteToggle).toHaveBeenCalledTimes(1);
  });

  it('handles spring animations on pressIn and pressOut events', () => {
    const { getByText, getByLabelText } = render(<ItineraryCard {...defaultProps} />);
    
    const detailBtn = getByText('Ver Detalle');
    fireEvent(detailBtn, 'pressIn');
    fireEvent(detailBtn, 'pressOut');

    const downloadBtn = getByLabelText('Descargar itinerario');
    fireEvent(downloadBtn, 'pressIn');
    fireEvent(downloadBtn, 'pressOut');

    const pinBtn = getByLabelText('Pin itinerary');
    fireEvent(pinBtn, 'pressIn');
    fireEvent(pinBtn, 'pressOut');

    // These events trigger Animated.spring. Since we mock or run them, they should not crash.
  });
});
