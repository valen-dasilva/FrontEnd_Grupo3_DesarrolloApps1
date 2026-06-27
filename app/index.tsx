import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { SplashScreen } from '@/components/SplashScreen';

export default function Index() {
  const { token, isLoading } = useAuth();
  const [animationDone, setAnimationDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Navegamos solo cuando se cumplen AMBAS condiciones:
    // - ya sabemos si hay sesión guardada (isLoading === false)
    // - la animación ya terminó de jugarse (animationDone === true)
    // El orden en que se cumplen no importa: puede terminar antes la animación
    // o antes la carga del token, este efecto reacciona a cualquiera de los dos.
    if (!isLoading && animationDone) {
      router.replace(token ? '/(tabs)' : '/login');
    }
  }, [isLoading, animationDone, token]);

  return <SplashScreen onAnimationFinish={() => setAnimationDone(true)} />;
}