import AsyncStorage from "@react-native-async-storage/async-storage";

// Claves bajo las que guardamos en el almacenamiento del dispositivo. El prefijo
// "@turistear/" evita chocar con datos de otras librerías que usen AsyncStorage.
const TOKEN_KEY = "@turistear/auth_token";
const USER_KEY = "@turistear/auth_user";

// AsyncStorage es un almacén clave-valor persistente: sobrevive a cerrar la app.
// Solo guarda strings, por eso el usuario (un objeto) hay que serializarlo a JSON.

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// Usamos genérico <T> para no acoplar storage al tipo AuthUser: este archivo no
// necesita saber qué forma tiene el usuario, solo guardarlo y devolverlo igual.
export async function saveUser<T>(user: T): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser<T>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  // Si lo guardado quedó corrupto y no parsea, devolvemos null en vez de romper.
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Borra token y usuario juntos. multiRemove hace ambas en una sola operación.
export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
