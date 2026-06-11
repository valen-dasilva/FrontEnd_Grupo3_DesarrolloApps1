import { getProfile, updateProfile, changePassword } from './profileService';
import { apiClient } from './api';

// Mockeamos el módulo api para no hacer llamadas HTTP reales
jest.mock('./api', () => ({
  apiClient: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

// Atajo tipado para usar los mocks cómodamente
const mockedGet = apiClient.get as jest.Mock;
const mockedPut = apiClient.put as jest.Mock;

describe('profileService', () => {
  // Limpiamos los mocks antes de cada test para que no se mezclen
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('llama al endpoint correcto y devuelve los datos del perfil', async () => {
      const fakeProfile = {
        idUsuario: 1,
        nombre: 'Mateo',
        apellido: 'Rossi',
        email: 'mateo@test.com',
      };
      mockedGet.mockResolvedValue({ data: fakeProfile });

      const result = await getProfile(1);

      expect(mockedGet).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(fakeProfile);
    });
  });

  describe('updateProfile', () => {
    it('envía los datos al endpoint con PUT y devuelve el perfil actualizado', async () => {
      const payload = {
        nombre: 'Mateo',
        apellido: 'Gómez',
        email: 'nuevo@test.com',
      };
      const updated = { idUsuario: 1, ...payload };
      mockedPut.mockResolvedValue({ data: updated });

      const result = await updateProfile(1, payload);

      expect(mockedPut).toHaveBeenCalledWith('/users/1', payload);
      expect(result).toEqual(updated);
    });
  });

  describe('changePassword', () => {
    it('envía la contraseña actual y la nueva al endpoint correcto', async () => {
      const payload = {
        contraseniaActual: 'vieja123',
        contraseniaNueva: 'nueva456',
      };
      mockedPut.mockResolvedValue({ data: undefined });

      await changePassword(1, payload);

      expect(mockedPut).toHaveBeenCalledWith('/users/1/password', payload);
    });
  });
});