import AsyncStorage from '@react-native-async-storage/async-storage';

const DURATION_OVERRIDE_PREFIX = '@turistear/duration_override_';

const keyFor = (id: number) => `${DURATION_OVERRIDE_PREFIX}${id}`;

export const getLocalDurationOverride = async (id: number): Promise<number | null> => {
  try {
    const val = await AsyncStorage.getItem(keyFor(id));
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
};

export const saveLocalDurationOverride = async (id: number, duration: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(keyFor(id), duration.toString());
  } catch (e) {
    console.error('Error saving local duration override:', e);
  }
};

export const removeLocalDurationOverride = async (id: number): Promise<void> => {
  try {
    await AsyncStorage.removeItem(keyFor(id));
  } catch (e) {
    console.error('Error removing local duration override:', e);
  }
};
