import { CategoriaItinerario } from '@/src/types/itinerario';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { CategoriesCarousel } from '../../components/Explorar/Filtro-Categorias-Carrusel';

describe('CategoriesCarousel Component', () => {
  const defaultProps = {
    selectedCategory: undefined,
    onCategorySelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and category labels', async () => {
    await render(<CategoriesCarousel {...defaultProps} />);

    expect(screen.getByText('Categorias')).toBeTruthy();
    expect(screen.getByText('Naturaleza')).toBeTruthy();
    expect(screen.getByText('Gastronomia')).toBeTruthy();
    expect(screen.getByText('Cultura')).toBeTruthy();
    expect(screen.getByText('Aventura')).toBeTruthy();
  });

  test('calls onCategorySelect with correct enum when a category is pressed', async () => {
    await render(<CategoriesCarousel {...defaultProps} />);

    const option = screen.getByText('Naturaleza');
    await fireEvent.press(option);

    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(CategoriaItinerario.NATURALEZA);
  });

  test('calls onCategorySelect with undefined when pressing an already selected category', async () => {
    await render(
      <CategoriesCarousel
        selectedCategory={CategoriaItinerario.GASTRONOMIA}
        onCategorySelect={defaultProps.onCategorySelect}
      />
    );

    const option = screen.getByText('Gastronomia');
    await fireEvent.press(option);

    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(undefined);
  });
});
