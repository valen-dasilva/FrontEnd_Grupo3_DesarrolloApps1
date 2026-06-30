import { renderHook, act } from '@testing-library/react-native';
import { useFavoriteToggle } from './useFavoriteToggle';
import * as favoritosService from '@/services/favoritosService';
import { useQueryClient } from '@tanstack/react-query';

jest.mock('@/services/favoritosService', () => ({
  guardarFavorito: jest.fn(),
  quitarFavorito: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

describe('useFavoriteToggle', () => {
  const mockInvalidateQueries = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });
  });

  it('inicializa con el valor de initialIsFavorite', () => {
    const { result } = renderHook(() => useFavoriteToggle(1, true));

    expect(result.current.isFav).toBe(true);
  });

  it('inicializa en false si initialIsFavorite es false', () => {
    const { result } = renderHook(() => useFavoriteToggle(1, false));

    expect(result.current.isFav).toBe(false);
  });

  it('actualiza el estado cuando initialIsFavorite cambia', () => {
    const { result, rerender } = renderHook(
      ({ initialIsFavorite }: { initialIsFavorite: boolean }) => useFavoriteToggle(1, initialIsFavorite),
      { initialProps: { initialIsFavorite: false } }
    );

    expect(result.current.isFav).toBe(false);

    rerender({ initialIsFavorite: true });

    expect(result.current.isFav).toBe(true);
  });

  it('toggleFavorite llama a guardarFavorito cuando isFav es false', async () => {
    (favoritosService.guardarFavorito as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useFavoriteToggle(42, false));

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(favoritosService.guardarFavorito).toHaveBeenCalledWith(42);
    expect(result.current.isFav).toBe(true);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['favoritos'] });
  });

  it('toggleFavorite llama a quitarFavorito cuando isFav es true', async () => {
    (favoritosService.quitarFavorito as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useFavoriteToggle(42, true));

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(favoritosService.quitarFavorito).toHaveBeenCalledWith(42);
    expect(result.current.isFav).toBe(false);
    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['favoritos'] });
  });

  it('revertir el estado si guardarFavorito falla', async () => {
    (favoritosService.guardarFavorito as jest.Mock).mockRejectedValue(new Error('Error de red'));

    const { result } = renderHook(() => useFavoriteToggle(42, false));

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(result.current.isFav).toBe(false);
  });

  it('revertir el estado si quitarFavorito falla', async () => {
    (favoritosService.quitarFavorito as jest.Mock).mockRejectedValue(new Error('Error de red'));

    const { result } = renderHook(() => useFavoriteToggle(42, true));

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(result.current.isFav).toBe(true);
  });

  it('no hace nada si idSistema es undefined', async () => {
    const { result } = renderHook(() => useFavoriteToggle(undefined, false));

    await act(async () => {
      await result.current.toggleFavorite();
    });

    expect(favoritosService.guardarFavorito).not.toHaveBeenCalled();
    expect(favoritosService.quitarFavorito).not.toHaveBeenCalled();
    expect(result.current.isFav).toBe(false);
  });

  it('retorna favId como undefined', () => {
    const { result } = renderHook(() => useFavoriteToggle(1, false));

    expect(result.current.favId).toBeUndefined();
  });
});
