import { isTokenExpired, ApiError, setAuthToken, setRefreshToken, setUnauthorizedHandler, setTokensRefreshedHandler, refreshTokens } from './api';
import axios from 'axios';

jest.mock('axios', () => {
  const mockAxios: any = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
  };
  return { __esModule: true, default: mockAxios };
});

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { hostUri: 'localhost:8081' } },
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAuthToken(null);
    setRefreshToken(null);
    setUnauthorizedHandler(null);
    setTokensRefreshedHandler(null);
  });

  describe('isTokenExpired', () => {
    const createToken = (exp: number): string => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp, sub: '1' }));
      return `${header}.${payload}.signature`;
    };

    it('retorna false para un token válido (no expirado)', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createToken(futureExp);

      expect(isTokenExpired(token)).toBe(false);
    });

    it('retorna true para un token expirado', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const token = createToken(pastExp);

      expect(isTokenExpired(token)).toBe(true);
    });

    it('retorna true para un token malformado', () => {
      expect(isTokenExpired('not-a-jwt')).toBe(true);
    });

    it('retorna true para un token vacío', () => {
      expect(isTokenExpired('')).toBe(true);
    });

    it('retorna true para un token con payload inválido', () => {
      expect(isTokenExpired('header.invalid-base64.signature')).toBe(true);
    });
  });

  describe('ApiError', () => {
    it('crea un error con status y mensaje', () => {
      const error = new ApiError(404, 'No encontrado');

      expect(error.status).toBe(404);
      expect(error.message).toBe('No encontrado');
      expect(error.name).toBe('ApiError');
    });

    it('es instancia de Error', () => {
      const error = new ApiError(500, 'Error interno');

      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('setAuthToken / setRefreshToken', () => {
    it('setAuthToken no lanza errores', () => {
      expect(() => setAuthToken('token-123')).not.toThrow();
      expect(() => setAuthToken(null)).not.toThrow();
    });

    it('setRefreshToken no lanza errores', () => {
      expect(() => setRefreshToken('refresh-123')).not.toThrow();
      expect(() => setRefreshToken(null)).not.toThrow();
    });
  });

  describe('setUnauthorizedHandler', () => {
    it('acepta una función', () => {
      const handler = jest.fn();
      expect(() => setUnauthorizedHandler(handler)).not.toThrow();
    });

    it('aceita null', () => {
      expect(() => setUnauthorizedHandler(null)).not.toThrow();
    });
  });

  describe('setTokensRefreshedHandler', () => {
    it('aceita una función', () => {
      const handler = jest.fn();
      expect(() => setTokensRefreshedHandler(handler)).not.toThrow();
    });

    it('aceita null', () => {
      expect(() => setTokensRefreshedHandler(null)).not.toThrow();
    });
  });

  describe('refreshTokens', () => {
    it('rechaza si no hay refresh token', async () => {
      setRefreshToken(null);

      await expect(refreshTokens()).rejects.toThrow('No hay refresh token disponible');
    });

    it('llama a POST /auth/refresh con el refresh token', async () => {
      setRefreshToken('my-refresh-token');
      const mockResponse = {
        data: {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
          idUsuario: 1,
          nombre: 'Test',
          email: 'test@test.com',
        },
      };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      await refreshTokens();

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh'),
        { refreshToken: 'my-refresh-token' },
        expect.any(Object)
      );
    });

    it('invoca el handler onTokensRefreshed si está configurado', async () => {
      setRefreshToken('my-refresh-token');
      const handler = jest.fn();
      setTokensRefreshedHandler(handler);

      const mockResponse = {
        data: {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
          idUsuario: 1,
          nombre: 'Test',
          email: 'test@test.com',
        },
      };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      await refreshTokens();

      expect(handler).toHaveBeenCalledWith(mockResponse.data);
    });

    it('single-flight: múltiples llamadas comparten la misma promesa', async () => {
      setRefreshToken('my-refresh-token');
      const mockResponse = {
        data: {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
          idUsuario: 1,
          nombre: 'Test',
          email: 'test@test.com',
        },
      };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const promise1 = refreshTokens();
      const promise2 = refreshTokens();
      const promise3 = refreshTokens();

      await Promise.all([promise1, promise2, promise3]);

      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
