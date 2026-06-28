import { getWeatherInfo, formatWeatherDate, isBadWeather, getDiaDate, isInForecastWindow } from './weatherUtils';

describe('weatherUtils', () => {
  describe('getWeatherInfo', () => {
    it('retorna despejado para código 0', () => {
      const result = getWeatherInfo(0);
      expect(result.emoji).toBe('☀️');
      expect(result.label).toBe('Despejado');
    });

    it('retorna mayormente despejado para códigos 1-2', () => {
      expect(getWeatherInfo(1).label).toBe('Mayormente despejado');
      expect(getWeatherInfo(2).label).toBe('Mayormente despejado');
    });

    it('retorna nublado para código 3', () => {
      const result = getWeatherInfo(3);
      expect(result.emoji).toBe('☁️');
      expect(result.label).toBe('Nublado');
    });

    it('retorna niebla para códigos 4-48', () => {
      expect(getWeatherInfo(4).label).toBe('Niebla');
      expect(getWeatherInfo(48).label).toBe('Niebla');
    });

    it('retorna llovizna para códigos 49-57', () => {
      expect(getWeatherInfo(49).label).toBe('Llovizna');
      expect(getWeatherInfo(57).label).toBe('Llovizna');
    });

    it('retorna lluvia para códigos 58-67', () => {
      expect(getWeatherInfo(58).label).toBe('Lluvia');
      expect(getWeatherInfo(67).label).toBe('Lluvia');
    });

    it('retorna nieve para códigos 68-77', () => {
      expect(getWeatherInfo(68).label).toBe('Nieve');
      expect(getWeatherInfo(77).label).toBe('Nieve');
    });

    it('retorna chubascos para códigos 78-82', () => {
      expect(getWeatherInfo(78).label).toBe('Chubascos');
      expect(getWeatherInfo(82).label).toBe('Chubascos');
    });

    it('retorna nieve con viento para códigos 83-86', () => {
      expect(getWeatherInfo(83).label).toBe('Nieve con viento');
      expect(getWeatherInfo(86).label).toBe('Nieve con viento');
    });

    it('retorna tormenta para códigos > 86', () => {
      expect(getWeatherInfo(87).label).toBe('Tormenta');
      expect(getWeatherInfo(99).label).toBe('Tormenta');
    });
  });

  describe('formatWeatherDate', () => {
    it('formatea fecha correctamente', () => {
      const result = formatWeatherDate('2024-12-25');
      expect(result.dayName).toBe('Mié');
      expect(result.dayMonth).toBe('25/12');
    });

    it('maneja día domingo', () => {
      const result = formatWeatherDate('2024-12-22');
      expect(result.dayName).toBe('Dom');
    });

    it('maneja día lunes', () => {
      const result = formatWeatherDate('2024-12-23');
      expect(result.dayName).toBe('Lun');
    });
  });

  describe('isBadWeather', () => {
    it('retorna false para código 0 (despejado)', () => {
      expect(isBadWeather(0)).toBe(false);
    });

    it('retorna false para código 50 (límite inferior)', () => {
      expect(isBadWeather(50)).toBe(false);
    });

    it('retorna true para código 51 (primer mal tiempo)', () => {
      expect(isBadWeather(51)).toBe(true);
    });

    it('retorna true para código 99 (tormenta)', () => {
      expect(isBadWeather(99)).toBe(true);
    });
  });

  describe('getDiaDate', () => {
    it('retorna la fecha de inicio para día 1', () => {
      expect(getDiaDate('2024-12-25', 1)).toBe('2024-12-25');
    });

    it('suma días correctamente', () => {
      expect(getDiaDate('2024-12-25', 2)).toBe('2024-12-26');
      expect(getDiaDate('2024-12-25', 3)).toBe('2024-12-27');
    });

    it('maneja cambio de mes', () => {
      expect(getDiaDate('2024-12-30', 3)).toBe('2025-01-01');
    });

    it('maneja cambio de año', () => {
      expect(getDiaDate('2024-12-31', 2)).toBe('2025-01-01');
    });

    it('maneja año bisiesto', () => {
      expect(getDiaDate('2024-02-28', 2)).toBe('2024-02-29');
      expect(getDiaDate('2024-02-28', 3)).toBe('2024-03-01');
    });
  });

  describe('isInForecastWindow', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-12-25T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('retorna true si el rango está dentro de los próximos 14 días', () => {
      expect(isInForecastWindow('2024-12-26', '2024-12-30')).toBe(true);
    });

    it('retorna true si el rango incluye hoy', () => {
      expect(isInForecastWindow('2024-12-25', '2024-12-28')).toBe(true);
    });

    it('retorna true si el rango solapa parcialmente', () => {
      expect(isInForecastWindow('2024-12-20', '2024-12-27')).toBe(true);
    });

    it('retorna false si el rango ya pasó', () => {
      expect(isInForecastWindow('2024-12-01', '2024-12-10')).toBe(false);
    });

    it('retorna false si el rango es muy lejano (>14 días)', () => {
      expect(isInForecastWindow('2025-02-01', '2025-02-10')).toBe(false);
    });

    it('retorna true si el rango termina exactamente en el límite de 14 días', () => {
      expect(isInForecastWindow('2025-01-05', '2025-01-08')).toBe(true);
    });
  });
});
