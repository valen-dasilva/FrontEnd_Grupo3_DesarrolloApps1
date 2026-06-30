import { getFavoritos, guardarFavorito, quitarFavorito, existeFavorito } from './favoritosService';
import { apiClient } from './api';

jest.mock('./api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('favoritosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFavoritos', () => {
    it('llama a GET /favoritos y retorna la lista', async () => {
      const favoritos = [
        { id: 1, titulo: 'Viaje a Bariloche', provincia: 'RIO_NEGRO' },
        { id: 2, titulo: 'Visita a Mendoza', provincia: 'MENDOZA' },
      ];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: favoritos });

      const result = await getFavoritos();

      expect(apiClient.get).toHaveBeenCalledWith('/favoritos');
      expect(result).toEqual(favoritos);
    });

    it('retorna array vacío si no hay favoritos', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await getFavoritos();

      expect(result).toEqual([]);
    });
  });

  describe('guardarFavorito', () => {
    it('llama a POST /favoritos/{id}', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

      await guardarFavorito(42);

      expect(apiClient.post).toHaveBeenCalledWith('/favoritos/42');
    });

    it('propaga errores del backend', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('No autorizado'));

      await expect(guardarFavorito(42)).rejects.toThrow('No autorizado');
    });
  });

  describe('quitarFavorito', () => {
    it('llama a DELETE /favoritos/{id}', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

      await quitarFavorito(42);

      expect(apiClient.delete).toHaveBeenCalledWith('/favoritos/42');
    });

    it('propaga errores del backend', async () => {
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error('Favorito no encontrado'));

      await expect(quitarFavorito(999)).rejects.toThrow('Favorito no encontrado');
    });
  });

  describe('existeFavorito', () => {
    it('llama a GET /favoritos/{id}/existe y retorna boolean', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: true });

      const result = await existeFavorito(42);

      expect(apiClient.get).toHaveBeenCalledWith('/favoritos/42/existe');
      expect(result).toBe(true);
    });

    it('retorna false si el favorito no existe', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: false });

      const result = await existeFavorito(999);

      expect(result).toBe(false);
    });
  });
});
