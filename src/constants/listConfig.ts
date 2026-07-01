import { Platform } from 'react-native';

/**
 * Props de performance compartidas para las FlatList de listados largos.
 * Estaban repetidas literalmente en Explorar, Guardados, Mis viajes y Completados.
 * Se pueden sobreescribir individualmente (ej. initialNumToRender) al spreadearlas.
 */
export const LIST_PERF_PROPS = {
  showsVerticalScrollIndicator: false,
  initialNumToRender: 5,
  maxToRenderPerBatch: 5,
  windowSize: 3,
  removeClippedSubviews: Platform.OS === 'android',
} as const;
