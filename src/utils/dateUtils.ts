// Utilidades de formateo de fechas compartidas entre preferencias y recomendaciones.
// Centralizadas aquí para evitar la duplicación que había en cada pantalla.

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Convierte una fecha ISO (YYYY-MM-DD) al formato largo: "31 Dic 2024".
 * Usado en la pantalla de preferencias para mostrar el rango de fechas seleccionado.
 */
export function formatFecha(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d} ${MESES[Number.parseInt(m) - 1]} ${y}`;
}

/**
 * Convierte una fecha ISO (YYYY-MM-DD) al formato corto: "31 Dic" (sin año).
 * Usado en la pantalla de recomendaciones para los badges de fecha en las cards.
 */
export function formatFechaCorta(iso: string): string {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  return `${Number.parseInt(d)} ${MESES[Number.parseInt(m) - 1]}`;
}

/**
 * Convierte un rango de fechas (YYYY-MM-DD) a formato amigable: "12 de ene al 15 de ene de 2026".
 */
export function formatDateRange(startStr?: string, endStr?: string): string {
  if (!startStr || !endStr) return '';
  
  const parseDate = (str: string) => {
    const [year, month, day] = str.split('-').map(Number);
    return { year, month, day };
  };

  const start = parseDate(startStr);
  const end = parseDate(endStr);

  const startMonthStr = MESES[start.month - 1].toLowerCase();
  const endMonthStr = MESES[end.month - 1].toLowerCase();

  if (start.month === end.month) {
    if (start.day === end.day) {
      return `${start.day} de ${startMonthStr} ${start.year}`;
    }
    return `${start.day} al ${end.day} de ${startMonthStr} ${start.year}`;
  }
  return `${start.day} de ${startMonthStr} al ${end.day} de ${endMonthStr} ${start.year}`;
}

/**
 * Calcula la cantidad de días (inclusive) entre dos fechas ISO. Devuelve 1
 * cuando inicio y fin son el mismo día, y 0 si alguna fecha es inválida.
 * Centraliza el cálculo que estaba embebido en ExploreScreen.
 */
export function calculateDurationDays(startStr: string, endStr: string): number {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  } catch {
    return 0;
  }
}

/**
 * Formatea una cantidad de días a texto amigable: "1 día" / "3 días".
 * Unifica las variantes inconsistentes ("X Días", "X días") repartidas por las cards.
 */
export function formatDuracion(dias: number): string {
  return `${dias} ${dias === 1 ? 'día' : 'días'}`;
}

/**
 * Convierte un string de hora (ej. "09:00:00", "9:0", "9:00") al formato fijo: "09:00".
 * Si el formato es totalmente inválido o vacío, retorna el string original.
 */
export function formatHora(timeStr: string): string {
  if (!timeStr) return '';
  const parts = timeStr.trim().split(':');
  if (parts.length === 0) return timeStr;

  let hour = Number.parseInt(parts[0], 10);
  let minute = parts[1] ? Number.parseInt(parts[1], 10) : 0;

  if (Number.isNaN(hour)) return timeStr;
  if (Number.isNaN(minute)) minute = 0;

  const paddedHour = hour.toString().padStart(2, '0');
  const paddedMinute = minute.toString().padStart(2, '0');

  return `${paddedHour}:${paddedMinute}`;
}

