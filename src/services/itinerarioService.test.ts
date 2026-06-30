import { buscarPorPreferencias, obtenerItinerarioPorId, getItinerarioEnCurso, getItineraryCards } from './itinerarioService';
import { apiClient } from './api';

// ApiError se obtiene del mock
const { ApiError } = jest.requireMock('./api');

jest.mock('./api', () => {
  function ApiError(this: any, status: number, message: string) {
    this.status = status;
    this.message = message;
    this.name = 'ApiError';
  }
  ApiError.prototype = Object.create(Error.prototype);
  ApiError.prototype.constructor = ApiError;
  return {
    apiClient: {
      get: jest.fn(),
    },
    ApiError,
  };
});

describe('itinerarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarPorPreferencias', () => {
    it('llama a GET /itinerario/buscar sin parámetros', async () => {
      const itinerarios = [{ id: 1, titulo: 'Viaje' }];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: itinerarios });

      const result = await buscarPorPreferencias({});

      expect(apiClient.get).toHaveBeenCalledWith('/itinerario/buscar');
      expect(result).toEqual(itinerarios);
    });

    it('agrega provincia como query param', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      await buscarPorPreferencias({ provincia: 'MENDOZA' as any });

      expect(apiClient.get).toHaveBeenCalledWith('/itinerario/buscar?provincia=MENDOZA');
    });

    it('agrega múltiples tags como query params', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      await buscarPorPreferencias({ tags: ['NATURALEZA', 'GASTRONOMIA'] as any });

      expect(apiClient.get).toHaveBeenCalledWith('/itinerario/buscar?tags=NATURALEZA&tags=GASTRONOMIA');
    });

    it('agrega fechas como query params', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      await buscarPorPreferencias({
        fechaInicio: '2024-12-25',
        fechaFin: '2024-12-31',
      });

      expect(apiClient.get).toHaveBeenCalledWith('/itinerario/buscar?fechaInicio=2024-12-25&fechaFin=2024-12-31');
    });

    it('combina todos los parámetros', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      await buscarPorPreferencias({
        provincia: 'BARILOCHE' as any,
        tags: ['AVENTURA'] as any,
        fechaInicio: '2024-12-25',
        fechaFin: '2024-12-31',
      });

      expect(apiClient.get).toHaveBeenCalledWith(
        '/itinerario/buscar?provincia=BARILOCHE&tags=AVENTURA&fechaInicio=2024-12-25&fechaFin=2024-12-31'
      );
    });
  });

  describe('obtenerItinerarioPorId', () => {
    it('llama a GET /itinerario/{id}', async () => {
      const itinerario = { id: 42, titulo: 'Viaje a Bariloche' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: itinerario });

      const result = await obtenerItinerarioPorId(42);

      expect(apiClient.get).toHaveBeenCalledWith('/itinerario/42');
      expect(result).toEqual(itinerario);
    });

    it('propaga errores 404', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('Not found'));

      await expect(obtenerItinerarioPorId(999)).rejects.toThrow('Not found');
    });
  });

  describe('getItinerarioEnCurso', () => {
    it('retorna el itinerario activo si existe', async () => {
      const itinerario = { id: 1, titulo: 'Viaje actual', fechaFin: '2024-12-31' };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: itinerario });

      const result = await getItinerarioEnCurso();

      expect(apiClient.get).toHaveBeenCalledWith('/itinerarios/activo');
      expect(result).toEqual(itinerario);
    });

    it('retorna null si no hay itinerario activo (404)', async () => {
      const error = new ApiError(404, 'No hay itinerario activo');
      (apiClient.get as jest.Mock).mockRejectedValue(error);

      const result = await getItinerarioEnCurso();

      expect(result).toBeNull();
    });

    it('propaga errores que no son 404', async () => {
      const error = new ApiError(500, 'Error interno');
      (apiClient.get as jest.Mock).mockRejectedValue(error);

      await expect(getItinerarioEnCurso()).rejects.toThrow('Error interno');
    });
  });

  describe('getItineraryCards', () => {
    it('llama a GET /itinerario/explorar', async () => {
      const cards = [
        { id: 1, title: 'Card 1', photo: 'url1' },
        { id: 2, title: 'Card 2', photo: 'url2' },
      ];
      (apiClient.get as jest.Mock).mockResolvedValue({ data: cards });

      const result = await getItineraryCards();

      expect(apiClient.get).toHaveBeenCalledWith('/itinerario/explorar');
      expect(result).toEqual(cards);
    });
  });
});
