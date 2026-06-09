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
