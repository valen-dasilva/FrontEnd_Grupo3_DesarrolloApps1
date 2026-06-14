import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold
} from '@expo-google-fonts/plus-jakarta-sans';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemeProvider as CustomThemeProvider, useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/queryClient';


// Evita que el splash se oculte solo antes de que terminen de cargar las fuentes.
SplashScreen.preventAutoHideAsync();

// Le indica a expo-router cuál es la ruta "ancla" del stack: a dónde volver por
// defecto cuando no hay un historial claro al que regresar.
export const unstable_settings = {
  anchor: '(tabs)',
};

// Hook de rutas protegidas: vigila si hay sesión y redirige en consecuencia.
// Protege el grupo (tabs) y, al revés, saca al usuario logueado de las pantallas
// de auth. Mientras restaura la sesión (isLoading) no hace nada y se ve el splash.
function useProtectedRoute() {
  const { token, isLoading } = useAuth();
  const segments = useSegments(); // partes de la ruta actual, ej: ['(tabs)', 'perfil']
  const router = useRouter();

  useEffect(() => {
    // Hasta no saber si hay sesión guardada, no decidimos a dónde mandar al usuario.
    if (isLoading) return;

    // ¿Está parado en una pantalla pública de auth?
    const onAuthScreen =
      segments[0] === 'login' ||
      segments[0] === 'register';
    // El splash (index) no tiene segmento: segments[0] === undefined.
    const onSplash = !segments[0];

    if (token && (onAuthScreen || onSplash)) {
      // Logueado pero parado en login/register/splash: lo mandamos a la app.
      // Usamos replace (no push) para que no pueda "volver atrás" al login.
      router.replace('/(tabs)');
    } else if (!token && !onAuthScreen) {
      // Sin sesión y fuera de las pantallas de auth: lo mandamos al login.
      router.replace('/login');
    }
  }, [token, isLoading, segments, router]);
}

// Define el stack de navegación de nivel raíz. headerShown: false en todas
// porque cada pantalla maneja su propio header (o no lleva). (tabs) es el grupo
// con la barra inferior; las demás son pantallas sueltas de auth y el splash.
function RootNavigator() {
  useProtectedRoute();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

// Capa visual: carga las fuentes, oculta el splash cuando están listas y aplica
// el tema de navegación (claro/oscuro). Recién acá montamos el navegador y el Toast.
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    'Inter_400Regular': Inter_400Regular,
    'Inter_600SemiBold': Inter_600SemiBold,
    'Inter_700Bold': Inter_700Bold,
    'PlusJakartaSans_500Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans_700Bold': PlusJakartaSans_700Bold,
    'Inter-Bold': Inter_700Bold, // Alias existente
    ...MaterialIcons.font,
  });

  // Cuando las fuentes terminan de cargar, ocultamos el splash.
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Sin fuentes no renderizamos nada (se sigue viendo el splash nativo).
  if (!loaded) {
    return null;
  }

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {/* Toast montado a nivel raíz para que cualquier pantalla pueda dispararlo. */}
      <Toast />
    </NavigationThemeProvider>
  );
}

// Punto de entrada de toda la app. El orden de los providers importa:
// - CustomThemeProvider (claro/oscuro) va primero porque los de adentro lo usan.
// - AuthProvider envuelve la navegación para que useProtectedRoute lea la sesión.
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}
