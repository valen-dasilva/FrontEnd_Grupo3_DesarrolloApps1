import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthContext';
import * as authService from '@/services/authService';
import * as storage from '@/services/storage';
import * as api from '@/services/api';
import * as userService from '@/services/userService';

jest.mock('@/services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('@/services/storage', () => ({
  getToken: jest.fn(),
  getRefreshToken: jest.fn(),
  getUser: jest.fn(),
  saveToken: jest.fn(),
  saveRefreshToken: jest.fn(),
  saveUser: jest.fn(),
  clearSession: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  isTokenExpired: jest.fn(),
  setAuthToken: jest.fn(),
  setRefreshToken: jest.fn(),
  setUnauthorizedHandler: jest.fn(),
  setTokensRefreshedHandler: jest.fn(),
  refreshTokens: jest.fn(),
}));

jest.mock('@/services/userService', () => ({
  getUserProfile: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (storage.getToken as jest.Mock).mockResolvedValue(null);
    (storage.getRefreshToken as jest.Mock).mockResolvedValue(null);
    (storage.getUser as jest.Mock).mockResolvedValue(null);
    (storage.saveToken as jest.Mock).mockResolvedValue(undefined);
    (storage.saveRefreshToken as jest.Mock).mockResolvedValue(undefined);
    (storage.saveUser as jest.Mock).mockResolvedValue(undefined);
    (storage.clearSession as jest.Mock).mockResolvedValue(undefined);
    (api.isTokenExpired as jest.Mock).mockReturnValue(false);
    (userService.getUserProfile as jest.Mock).mockResolvedValue({
      idUsuario: 1,
      nombre: 'Test',
      email: 'test@test.com',
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useAuth', () => {
    it('lanza error si se usa fuera del AuthProvider', () => {
      const TestComponent = () => {
        useAuth();
        return null;
      };

      expect(() => {
        const { unmount } = renderHook(() => null, {
          wrapper: ({ children }) => <>{children}</>,
        });
        renderHook(() => {
          try {
            useAuth();
          } catch (e) {
            throw e;
          }
        });
      }).toThrow('useAuth debe usarse dentro de un AuthProvider');
    });
  });

  describe('estado inicial', () => {
    it('inicia con isLoading=true', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('inicia con user=null y token=null', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  describe('login', () => {
    it('persiste la sesión después de login exitoso', async () => {
      const mockResponse = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
        idUsuario: 1,
        nombre: 'Juan',
        email: 'juan@test.com',
      };
      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({ email: 'juan@test.com', contrasenia: '123456' });
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'juan@test.com',
        contrasenia: '123456',
      });
      expect(result.current.user).toEqual({
        idUsuario: 1,
        nombre: 'Juan',
        email: 'juan@test.com',
      });
      expect(result.current.token).toBe('access-token-123');
      expect(storage.saveToken).toHaveBeenCalledWith('access-token-123');
      expect(storage.saveRefreshToken).toHaveBeenCalledWith('refresh-token-123');
    });

    it('propaga errores del login', async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error('Credenciales inválidas'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login({ email: 'test@test.com', contrasenia: 'wrong' });
        })
      ).rejects.toThrow('Credenciales inválidas');

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  describe('register', () => {
    it('persiste la sesión después de register exitoso', async () => {
      const mockResponse = {
        accessToken: 'access-token-456',
        refreshToken: 'refresh-token-456',
        idUsuario: 2,
        nombre: 'Ana',
        email: 'ana@test.com',
      };
      (authService.register as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register({
          nombre: 'Ana',
          apellido: 'Lopez',
          email: 'ana@test.com',
          contrasenia: '123456',
        });
      });

      expect(authService.register).toHaveBeenCalledWith({
        nombre: 'Ana',
        apellido: 'Lopez',
        email: 'ana@test.com',
        contrasenia: '123456',
      });
      expect(result.current.user).toEqual({
        idUsuario: 2,
        nombre: 'Ana',
        email: 'ana@test.com',
      });
      expect(result.current.token).toBe('access-token-456');
    });
  });

  describe('logout', () => {
    it('limpia la sesión completa', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        idUsuario: 1,
        nombre: 'Test',
        email: 'test@test.com',
      };
      (authService.login as jest.Mock).mockResolvedValue(mockResponse);
      (authService.logout as jest.Mock).mockResolvedValue(undefined);
      (storage.getRefreshToken as jest.Mock).mockResolvedValue('refresh-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({ email: 'test@test.com', contrasenia: '123' });
      });

      expect(result.current.user).not.toBeNull();

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(api.setAuthToken).toHaveBeenCalledWith(null);
      expect(api.setRefreshToken).toHaveBeenCalledWith(null);
      expect(storage.clearSession).toHaveBeenCalled();
    });

    it('revoca el refresh token en el backend', async () => {
      (storage.getRefreshToken as jest.Mock).mockResolvedValue('refresh-to-revoke');
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalledWith('refresh-to-revoke');
    });
  });

  describe('updateUser', () => {
    it('actualiza campos del usuario', async () => {
      const mockResponse = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        idUsuario: 1,
        nombre: 'Juan',
        email: 'juan@test.com',
      };
      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login({ email: 'juan@test.com', contrasenia: '123' });
      });

      await act(async () => {
        await result.current.updateUser({ nombre: 'Juan Actualizado' });
      });

      expect(result.current.user?.nombre).toBe('Juan Actualizado');
      expect(result.current.user?.email).toBe('juan@test.com');
    });

    it('no hace nada si no hay usuario', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.updateUser({ nombre: 'Nuevo' });
      });

      expect(result.current.user).toBeNull();
    });
  });
});
