import { apiClient } from './api';
import { deleteFoto, deleteFotoConfirmada, postFoto } from './itinerariosService';

jest.mock('./api', () => ({
  apiClient: {
    post: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
  },
}));

describe('itinerariosService fotos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registra una URL en el itinerario', async () => {
    const foto = { id: 4, url: 'https://example.com/foto.jpg', orden: 2 };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: foto });

    const result = await postFoto(12, foto.url);

    expect(apiClient.post).toHaveBeenCalledWith('/itinerarios/12/fotos', { url: foto.url });
    expect(result).toEqual(foto);
  });

  it('elimina una foto específica del itinerario', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });

    await deleteFoto(12, 4);

    expect(apiClient.delete).toHaveBeenCalledWith('/itinerarios/12/fotos/4');
  });

  it('confirma que la foto ya no existe antes de completar el borrado', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { fotos: [{ id: 5, url: 'https://example.com/otra.jpg', orden: 0 }] },
    });

    const details = await deleteFotoConfirmada(12, 4);

    expect(apiClient.get).toHaveBeenCalledWith('/itinerarios/12');
    expect(details.fotos).toHaveLength(1);
  });

  it('rechaza el borrado si el servidor todavía devuelve la foto', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ data: undefined });
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { fotos: [{ id: 4, url: 'https://example.com/foto.jpg', orden: 0 }] },
    });

    await expect(deleteFotoConfirmada(12, 4)).rejects.toThrow(
      'El servidor no confirmó el borrado de la foto.',
    );
  });
});
