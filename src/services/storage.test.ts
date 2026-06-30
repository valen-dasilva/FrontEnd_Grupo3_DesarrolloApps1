import { saveToken, getToken, saveRefreshToken, getRefreshToken, saveUser, getUser, clearSession } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveToken / getToken', () => {
    it('guarda el token con la clave correcta', async () => {
      await saveToken('my-access-token');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@turistear/auth_token', 'my-access-token');
    });

    it('recupera el token guardado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('my-access-token');

      const result = await getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@turistear/auth_token');
      expect(result).toBe('my-access-token');
    });

    it('retorna null si no hay token guardado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getToken();

      expect(result).toBeNull();
    });
  });

  describe('saveRefreshToken / getRefreshToken', () => {
    it('guarda el refresh token con la clave correcta', async () => {
      await saveRefreshToken('my-refresh-token');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@turistear/auth_refresh_token', 'my-refresh-token');
    });

    it('recupera el refresh token guardado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('my-refresh-token');

      const result = await getRefreshToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@turistear/auth_refresh_token');
      expect(result).toBe('my-refresh-token');
    });
  });

  describe('saveUser / getUser', () => {
    it('guarda el usuario serializado a JSON', async () => {
      const user = { idUsuario: 1, nombre: 'Test', email: 'test@test.com' };

      await saveUser(user);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@turistear/auth_user',
        JSON.stringify(user)
      );
    });

    it('recupera el usuario y lo parsea', async () => {
      const user = { idUsuario: 1, nombre: 'Test', email: 'test@test.com' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(user));

      const result = await getUser();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@turistear/auth_user');
      expect(result).toEqual(user);
    });

    it('retorna null si no hay usuario guardado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await getUser();

      expect(result).toBeNull();
    });

    it('retorna null si el JSON está corrupto', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{ invalid json');

      const result = await getUser();

      expect(result).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('elimina token, refresh token y usuario', async () => {
      await clearSession();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@turistear/auth_token',
        '@turistear/auth_refresh_token',
        '@turistear/auth_user',
      ]);
    });
  });
});
