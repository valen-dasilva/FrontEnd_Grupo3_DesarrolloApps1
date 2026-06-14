import { changePassword, getUserProfile, updateUserProfile } from './userService';
import { apiClient } from './api';

// Mockeamos api.ts para no tocar la red ni cargar expo-constants
jest.mock('./api', () => ({
  apiClient: {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('changePassword', () => {
    it('llama a PUT /users/{id}/password con el payload correcto', async () => {
      (apiClient.put as jest.Mock).mockResolvedValue({ data: undefined });

      await changePassword(1, {
        contraseniaActual: 'vieja123',
        contraseniaNueva: 'nueva123',
      });

      expect(apiClient.put).toHaveBeenCalledWith('/users/1/password', {
        contraseniaActual: 'vieja123',
        contraseniaNueva: 'nueva123',
      });
    });

    it('propaga el error si el backend falla', async () => {
      (apiClient.put as jest.Mock).mockRejectedValue(new Error('falló'));

      await expect(
        changePassword(1, { contraseniaActual: 'a', contraseniaNueva: 'b' })
      ).rejects.toThrow('falló');
    });
  });

  describe('getUserProfile', () => {
    it('pega a GET /users/{id} y devuelve los datos del perfil', async () => {
      const fakeProfile = {
        idUsuario: 1,
        nombre: 'Ana',
        apellido: 'Lopez',
        email: 'ana@test.com',
      };
      (apiClient.get as jest.Mock).mockResolvedValue({ data: fakeProfile });

      const result = await getUserProfile(1);

      expect(apiClient.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(fakeProfile);
    });
  });

  describe('updateUserProfile', () => {
    it('pega a PUT /users/{id} con el payload y devuelve el perfil actualizado', async () => {
      const payload = {
        nombre: 'Ana',
        apellido: 'Lopez',
        email: 'ana@test.com',
      };
      const fakeUpdated = { idUsuario: 1, ...payload };
      (apiClient.put as jest.Mock).mockResolvedValue({ data: fakeUpdated });

      const result = await updateUserProfile(1, payload);

      expect(apiClient.put).toHaveBeenCalledWith('/users/1', payload);
      expect(result).toEqual(fakeUpdated);
    });
  });
});