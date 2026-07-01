import { ApiError } from '@/services/api';

/**
 * Extrae un mensaje legible de cualquier error capturado. Centraliza el patrón
 * que estaba repetido en los hooks (`err instanceof ApiError ? err.message : ...`)
 * y en la derivación del `errorString` de cada query.
 *
 * @param error  cualquier valor lanzado/atrapado (unknown)
 * @param fallback mensaje a usar cuando no se puede extraer uno del error
 */
export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  if (error) return String(error);
  return fallback;
}

/**
 * Igual que {@link getErrorMessage} pero devuelve `null` cuando no hay error.
 * Pensado para alimentar el `error: string | null` que exponen los hooks.
 */
export function toErrorString(error: unknown): string | null {
  if (!error) return null;
  return getErrorMessage(error);
}
