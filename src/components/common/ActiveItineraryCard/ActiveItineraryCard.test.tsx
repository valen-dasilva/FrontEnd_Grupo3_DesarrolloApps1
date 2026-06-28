import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ActiveItineraryCard from './ActiveItineraryCard';
import { router } from 'expo-router';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  card: '#f8f9fa',
  textSecondary: '#6c757d',
  text: '#212529',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
  }),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, style }: any) => React.createElement(View, { style }, children),
  };
});

jest.mock('@/utils/dateUtils', () => ({
  formatFechaCorta: (d: string) => d,
}));

describe('ActiveItineraryCard', () => {
  const mockItinerario = {
    idItinerarioUsuario: 12,
    idItinerarioSistema: 34,
    titulo: 'Fin de semana en Bariloche',
    descripcion: 'Un viaje increíble por el sur de Argentina',
    provincia: 'RIO_NEGRO',
    fechaInicio: '2026-06-20',
    fechaFin: '2026-06-25',
    fotoPortada: 'https://example.com/bariloche.jpg',
    duracionDias: 5,
    etiquetas: ['NATURALEZA', 'AVENTURA'],
    items: [
      {
        id: 1,
        nombreActividad: 'Trekking Cerro Campanario',
        hora: '10:00:00',
        dia: 1,
        itinerarioId: 12,
      },
    ],
    isOptimistic: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with itinerary title and info', () => {
    const { getByText } = render(<ActiveItineraryCard itinerarioActivo={mockItinerario as any} />);
    expect(getByText('Fin de semana en Bariloche')).toBeTruthy();
    expect(getByText('Próxima actividad')).toBeTruthy();
    expect(getByText('Trekking Cerro Campanario')).toBeTruthy();
  });

  it('navigates when card is pressed', () => {
    const { getByText } = render(<ActiveItineraryCard itinerarioActivo={mockItinerario as any} />);
    const card = getByText('Fin de semana en Bariloche');
    fireEvent.press(card);
    expect(router.push).toHaveBeenCalledTimes(1);
  });
});
