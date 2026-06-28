import { login, register, logout } from './authService';
import { apiClient } from './api';

jest.mock('./api', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('llama a POST /auth/login con el payload correcto', async () => {
      const payload = { email: 'test@test.com', contrasenia: '123456' };
      const response = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        idUsuario: 1,
        nombre: 'Test',
        email: 'test@test.com',
      };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: response });

      const result = await login(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', payload);
      expect(result).toEqual(response);
    });

    it('propaga errores del backend', async () => {
      const payload = { email: 'test@test.com', contrasenia: 'wrong' };
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));

      await expect(login(payload)).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('register', () => {
    it('llama a POST /auth/register con el payload correcto', async () => {
      const payload = {
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@test.com',
        contrasenia: '123456',
      };
      const response = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        idUsuario: 2,
        nombre: 'Juan',
        email: 'juan@test.com',
      };
      (apiClient.post as jest.Mock).mockResolvedValue({ data: response });

      const result = await register(payload);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', payload);
      expect(result).toEqual(response);
    });

    it('propaga errores de email duplicado', async () => {
      const payload = {
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'existing@test.com',
        contrasenia: '123456',
      };
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('Email ya registrado'));

      await expect(register(payload)).rejects.toThrow('Email ya registrado');
    });
  });

  describe('logout', () => {
    it('llama a POST /auth/logout con el refresh token', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

      await logout('refresh-token-123');

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', {
        refreshToken: 'refresh-token-123',
      });
    });

    it('retorna undefined en caso de éxito', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ data: undefined });

      const result = await logout('refresh-token-123');

      expect(result).toBeUndefined();
    });

    it('propaga errores del backend', async () => {
      (apiClient.post as jest.Mock).mockRejectedValue(new Error('Token inválido'));

      await expect(logout('invalid-token')).rejects.toThrow('Token inválido');
    });
  });
});
