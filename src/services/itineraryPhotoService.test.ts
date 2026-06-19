import {
  deleteItineraryPhotoFromStorage,
  getItineraryPhotoPath,
  MAX_ITINERARY_PHOTO_BYTES,
  uploadItineraryPhoto,
} from './itineraryPhotoService';

describe('itineraryPhotoService', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
    jest.spyOn(Date, 'now').mockReturnValue(123456789);
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sube una imagen y devuelve su URL pública y path', async () => {
    const blob = { size: 1024, type: 'image/jpeg' } as Blob;
    fetchMock
      .mockResolvedValueOnce({ blob: jest.fn().mockResolvedValue(blob) })
      .mockResolvedValueOnce({ ok: true });

    const result = await uploadItineraryPhoto(7, {
      uri: 'file:///foto.jpg',
      fileName: 'foto.jpg',
      mimeType: 'image/jpeg',
      fileSize: 1024,
    });

    expect(result.path).toMatch(/^usuarios\/7\/.+\.jpg$/);
    expect(result.url).toContain('/itinerarios-usuario-fotos/usuarios/7/');
    expect(fetchMock).toHaveBeenNthCalledWith(1, 'file:///foto.jpg');
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/storage/v1/object/itinerarios-usuario-fotos/usuarios/7/'),
      expect.objectContaining({ method: 'POST', body: blob }),
    );
  });

  it('rechaza archivos mayores a 8 MB antes de leerlos', async () => {
    await expect(uploadItineraryPhoto(7, {
      uri: 'file:///pesada.jpg',
      fileSize: MAX_ITINERARY_PHOTO_BYTES + 1,
    })).rejects.toThrow('8 MB');

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('ignora al borrar una URL que no pertenece al bucket', async () => {
    await deleteItineraryPhotoFromStorage('https://example.com/foto.jpg');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('extrae el path y elimina una URL del bucket', async () => {
    const url = 'https://qwkqhlpwwpjjqcbztbcl.supabase.co/storage/v1/object/public/itinerarios-usuario-fotos/usuarios/7/foto.jpg';
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 });

    expect(getItineraryPhotoPath(url)).toBe('usuarios/7/foto.jpg');
    await deleteItineraryPhotoFromStorage(url);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/storage/v1/object/itinerarios-usuario-fotos/usuarios/7/foto.jpg'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
