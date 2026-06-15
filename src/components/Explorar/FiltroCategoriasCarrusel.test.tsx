import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoriesCarousel } from './FiltroCategoriasCarrusel';
import { CategoriaItinerario } from '@/types/itinerario';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  text: '#212529',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('CategoriesCarousel', () => {
  const defaultProps = {
    selectedCategory: undefined,
    onCategorySelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section title and all category names', () => {
    const { getByText } = render(<CategoriesCarousel {...defaultProps} />);

    expect(getByText('Categorias')).toBeTruthy();
    expect(getByText('Naturaleza')).toBeTruthy();
    expect(getByText('Gastronomia')).toBeTruthy();
    expect(getByText('Cultura')).toBeTruthy();
    expect(getByText('Aventura')).toBeTruthy();
    expect(getByText('Noche')).toBeTruthy();
    expect(getByText('Compra')).toBeTruthy();
  });

  it('calls onCategorySelect with correct enum value when clicking an unselected category', () => {
    const { getByText } = render(<CategoriesCarousel {...defaultProps} />);

    const gastCategoryCard = getByText('Gastronomia');
    fireEvent.press(gastCategoryCard);

    expect(defaultProps.onCategorySelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(CategoriaItinerario.GASTRONOMIA);
  });

  it('calls onCategorySelect with undefined when clicking the already selected category', () => {
    const { getByText } = render(
      <CategoriesCarousel
        selectedCategory={CategoriaItinerario.CULTURA}
        onCategorySelect={defaultProps.onCategorySelect}
      />
    );

    const cultCategoryCard = getByText('Cultura');
    fireEvent.press(cultCategoryCard);

    expect(defaultProps.onCategorySelect).toHaveBeenCalledTimes(1);
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(undefined);
  });
});
