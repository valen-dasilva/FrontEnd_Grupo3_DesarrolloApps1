import AsyncStorage from '@react-native-async-storage/async-storage';

// Overrides locales de título: permiten que un rename hecho offline persista en
// el dispositivo aunque el backend todavía no lo haya confirmado.
const TITLE_OVERRIDE_PREFIX = '@turistear/title_override_';

const keyFor = (id: number) => `${TITLE_OVERRIDE_PREFIX}${id}`;

export const getLocalTitleOverride = async (id: number): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(keyFor(id));
  } catch {
    return null;
  }
};

export const saveLocalTitleOverride = async (id: number, title: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(keyFor(id), title);
  } catch (e) {
    console.error('Error saving local title override:', e);
  }
};

/**
 * Borra el override local de un itinerario. Se llama al eliminar el itinerario
 * para no dejar claves huérfanas en AsyncStorage que pisen títulos futuros.
 */
export const removeLocalTitleOverride = async (id: number): Promise<void> => {
  try {
    await AsyncStorage.removeItem(keyFor(id));
  } catch (e) {
    console.error('Error removing local title override:', e);
  }
};
