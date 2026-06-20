import { apiClient } from './api';
import { deleteFoto, postFoto } from './itinerariosService';

jest.mock('./api', () => ({
  apiClient: {
    post: jest.fn(),
    delete: jest.fn(),
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
});
