import { useFavoritosHook } from '@/src/hooks/favoritosHook';
import { buscarPorPreferencias } from '@/src/services/itinerarioService';
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import ExploreScreen from '../../app/(tabs)/explorar';

// Mock services
jest.mock('@/src/services/itinerarioService');
jest.mock('@/src/hooks/favoritosHook');

describe('ExploreScreen View', () => {
  const mockItineraries = [
    {
      idItinerario: 1,
      titulo: 'Caminata Histórica',
      descripcion: 'Recorrido a pie por el casco histórico.',
      fechaInicio: '2026-06-12',
      fechaFin: '2026-06-13',
      likes: 12,
      etiquetas: ['CULTURA'],
      fotoPortada: 'https://example.com/caminata.jpg',
    },
    {
      idItinerario: 2,
      titulo: 'Parque Nacional Nahuel Huapi',
      descripcion: 'Senderismo en Bariloche.',
      fechaInicio: '2026-06-15',
      fechaFin: '2026-06-20',
      likes: 45,
      etiquetas: ['NATURALEZA'],
      fotoPortada: 'https://example.com/nahuel.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for useFavoritosHook
    (useFavoritosHook as jest.Mock).mockReturnValue({
      listItinerarioResumen: [],
      loadItinerarios: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  test('renders loader on initial search', async () => {
    // Make the promise hang or resolve slowly to capture loading state
    (buscarPorPreferencias as jest.Mock).mockReturnValue(new Promise(() => { }));

    await render(<ExploreScreen />);

    // SOLUCIÓN: Cambiado a findByText asincrónico
    expect(await screen.findByText('Cargando itinerarios...')).toBeTruthy();
  });

  test('renders error message when search fails', async () => {
    (buscarPorPreferencias as jest.Mock).mockRejectedValue(new Error('Fallo al conectar con el servidor'));

    await render(<ExploreScreen />);

    await waitFor(() => {
      expect(screen.getByText('Fallo al conectar con el servidor')).toBeTruthy();
    });
  });

  test('renders empty message when no itineraries are found', async () => {
    (buscarPorPreferencias as jest.Mock).mockResolvedValue([]);

    await render(<ExploreScreen />);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron itinerarios para tu búsqueda.')).toBeTruthy();
    });
  });

  test('renders list of itineraries successfully', async () => {
    (buscarPorPreferencias as jest.Mock).mockResolvedValue(mockItineraries);

    await render(<ExploreScreen />);

    // Wait for the mock promise to resolve and render cards
    await waitFor(() => {
      expect(screen.getByText('Caminata Histórica')).toBeTruthy();
      expect(screen.getByText('Parque Nacional Nahuel Huapi')).toBeTruthy();
    });

    // SOLUCIÓN: Expresiones regulares para ignorar mayúsculas/minúsculas
    const culturaElements = screen.getAllByText(/cultura/i);
    expect(culturaElements.length).toBeGreaterThanOrEqual(1);

    const naturElements = screen.getAllByText(/naturaleza/i);
    expect(naturElements.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('Recorrido a pie por el casco histórico.')).toBeTruthy();
  });
});