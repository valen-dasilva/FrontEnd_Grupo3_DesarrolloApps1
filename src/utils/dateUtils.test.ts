import { formatFecha, formatFechaCorta, formatDateRange, formatHora } from './dateUtils';

describe('dateUtils', () => {
  describe('formatFecha', () => {
    it('convierte fecha ISO a formato largo', () => {
      expect(formatFecha('2024-12-31')).toBe('31 Dic 2024');
    });

    it('maneja meses con un dígito', () => {
      expect(formatFecha('2024-01-15')).toBe('15 Ene 2024');
    });

    it('maneja el primer día del mes', () => {
      expect(formatFecha('2024-03-01')).toBe('01 Mar 2024');
    });
  });

  describe('formatFechaCorta', () => {
    it('convierte fecha ISO a formato corto sin año', () => {
      expect(formatFechaCorta('2024-12-31')).toBe('31 Dic');
    });

    it('retorna string vacío si la fecha es vacía', () => {
      expect(formatFechaCorta('')).toBe('');
    });

    it('maneja meses con un dígito', () => {
      expect(formatFechaCorta('2024-02-14')).toBe('14 Feb');
    });
  });

  describe('formatDateRange', () => {
    it('retorna string vacío si falta fecha inicio', () => {
      expect(formatDateRange(undefined, '2024-12-31')).toBe('');
    });

    it('retorna string vacío si falta fecha fin', () => {
      expect(formatDateRange('2024-12-25', undefined)).toBe('');
    });

    it('retorna string vacío si ambas fechas faltan', () => {
      expect(formatDateRange(undefined, undefined)).toBe('');
    });

    it('mismo mes, mismo día', () => {
      expect(formatDateRange('2024-12-25', '2024-12-25')).toBe('25 de dic 2024');
    });

    it('mismo mes, distintos días', () => {
      expect(formatDateRange('2024-12-12', '2024-12-15')).toBe('12 al 15 de dic 2024');
    });

    it('distintos meses', () => {
      expect(formatDateRange('2024-12-28', '2025-01-05')).toBe('28 de dic al 5 de ene 2024');
    });

    it('rango de un año completo', () => {
      expect(formatDateRange('2024-01-01', '2024-12-31')).toBe('1 de ene al 31 de dic 2024');
    });
  });

  describe('formatHora', () => {
    it('retorna string vacío si el input es vacío', () => {
      expect(formatHora('')).toBe('');
    });

    it('formatea hora completa HH:MM:SS', () => {
      expect(formatHora('09:30:00')).toBe('09:30');
    });

    it('formatea hora corta HH:MM', () => {
      expect(formatHora('14:45')).toBe('14:45');
    });

    it('agrega cero a la izquierda en hora', () => {
      expect(formatHora('9:00')).toBe('09:00');
    });

    it('maneja hora sin minutos', () => {
      expect(formatHora('15')).toBe('15:00');
    });

    it('maneja minutos inválidos como 0', () => {
      expect(formatHora('10:abc')).toBe('10:00');
    });

    it('retorna el string original si la hora es inválida', () => {
      expect(formatHora('abc')).toBe('abc');
    });

    it('maneja medianoche', () => {
      expect(formatHora('00:00:00')).toBe('00:00');
    });

    it('maneja mediodía', () => {
      expect(formatHora('12:00:00')).toBe('12:00');
    });
  });
});
