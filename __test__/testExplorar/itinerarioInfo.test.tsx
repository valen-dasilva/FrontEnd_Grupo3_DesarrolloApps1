import { useItinerarioDetalle } from '@/hooks/useItinerarioDetalle';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import ItineraryInfoScreen from '../../app/explorarApp/itinerarioInfo';

// Mock hook
jest.mock('@/hooks/useItinerarioDetalle');

// Mock expo-router specifically for this test file to return search params
const mockBack = jest.fn();
jest.mock('expo-router', () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      back: mockBack,
      replace: jest.fn(),
    }),
    useLocalSearchParams: () => ({
      idItinerario: '100',
      title: 'Tour por Buenos Aires',
      category: 'Cultura',
      startDate: '2026-07-01T12:00:00', // Timezone independent
      endDate: '2026-07-05T12:00:00',   // Timezone independent
      description: 'Recorrido por la ciudad de Buenos Aires.',
      image: 'https://example.com/ba.jpg',
      isFavorite: 'false',
      idFavorito: '',
    }),
    useFocusEffect: (cb: any) => cb(),
    Stack: {
      Screen: () => null,
    },
  };
});

describe('ItineraryInfoScreen View', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loader when loading activities', async () => {
    (useItinerarioDetalle as jest.Mock).mockReturnValue({
      itinerario: null,
      loading: true,
      error: null,
    });

    await render(<ItineraryInfoScreen />);

    expect(screen.getByText('Cargando actividades...')).toBeTruthy();
  });

  test('renders error message when loading fails', async () => {
    (useItinerarioDetalle as jest.Mock).mockReturnValue({
      itinerario: null,
      loading: false,
      error: 'Error de red al obtener detalles',
    });

    await render(<ItineraryInfoScreen />);

    expect(screen.getByText('Error de red al obtener detalles')).toBeTruthy();
  });

  test('renders itinerary and activity list successfully', async () => {
    // SOLUCIÓN: La estructura ahora coincide exactamente con el "itinerario.items" que pide tu vista
    const mockItineraryData = {
      id: 100,
      items: [
        {
          id: 1,
          dia: 1,
          hora: '09:00:00',
          actividad: {
            nombre: 'Teatro Colón',
            localidad: 'San Nicolás',
            direccion: 'Cerrito 628',
          },
        },
        {
          id: 2,
          dia: 1,
          hora: '14:30:00',
          actividad: {
            nombre: 'Café Tortoni',
            localidad: 'Montserrat',
            direccion: 'Av. de Mayo 825',
          },
        },
      ],
    };

    (useItinerarioDetalle as jest.Mock).mockReturnValue({
      itinerario: mockItineraryData,
      loading: false,
      error: null,
    });

    await render(<ItineraryInfoScreen />);

    // Screen should render ItineraryInfoCard header contents
    expect(screen.getByText('Tour por Buenos Aires')).toBeTruthy();
    expect(screen.getByText('Cultura')).toBeTruthy();

    // Check days and activities are rendered
    expect(screen.getByText('Día 1')).toBeTruthy();
    expect(screen.getByText('Teatro Colón')).toBeTruthy();
    expect(screen.getByText('Café Tortoni')).toBeTruthy();
    expect(screen.getByText('09:00')).toBeTruthy();
    expect(screen.getByText('14:30')).toBeTruthy();
  });

  test('renders placeholder message when itinerary has no activities', async () => {
    (useItinerarioDetalle as jest.Mock).mockReturnValue({
      itinerario: { id: 100, items: [] },
      loading: false,
      error: null,
    });

    await render(<ItineraryInfoScreen />);

    expect(screen.getByText('Este itinerario no tiene actividades cargadas.')).toBeTruthy();
  });
});