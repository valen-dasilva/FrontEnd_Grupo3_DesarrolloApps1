import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useColorScheme';

import { HeaderLogo } from './HeaderLogo';

interface SplashScreenProps {
  onAnimationFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const { theme } = useTheme();

  // Capa del ícono: arranca chico e invisible.
  const iconScale = useSharedValue(0.3);
  const iconOpacity = useSharedValue(0);

  // Capa de toda la pantalla (fondo incluido): arranca totalmente visible,
  // recién se anima al final, cuando el ícono ya desapareció.
  const containerOpacity = useSharedValue(1);

  // Función JS normal (no worklet) que dispara el fade final de la pantalla.
  // La llamamos vía runOnJS desde el callback de la animación del ícono.
  const startContainerFade = () => {
    containerOpacity.value = withTiming(
      0,
      { duration: 600, easing: Easing.inOut(Easing.ease) }, // 600ms: lo suficientemente largo para que no se sienta brusco
      (finished) => {
        if (finished && onAnimationFinish) {
          runOnJS(onAnimationFinish)();
        }
      }
    );
  };

  useEffect(() => {
    // FASE 1: zoom in grande. Pasa de 0.3 a 1.8 (overshoot fuerte) — bastante
    // más marcado que la versión anterior (que llegaba solo a 1.15).
    // FASE 2 (encadenada con withSequence): tras una pausa breve, se achica
    // hasta 0 — el ícono "se va" reduciéndose, no solo desapareciendo de golpe.
    iconScale.value = withSequence(
      withTiming(1.8, { duration: 700, easing: Easing.out(Easing.exp) }), // zoom in grande y rápido, desacelerando
      withDelay(
        150, // pausa breve en el pico, para que se note el zoom antes de achicarse
        withTiming(0, { duration: 450, easing: Easing.in(Easing.ease) }) // se achica hasta desaparecer
      )
    );

    // Opacidad del ícono: fade in al principio, fade out sincronizado con
    // el momento exacto en que arranca el achicamiento (t=850ms: 700+150).
    iconOpacity.value = withSequence(
      withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) }), // fade in (0→350ms)
      withDelay(
        500, // 350 + 500 = 850ms: coincide con el inicio de la fase de achicamiento de arriba
        withTiming(
          0,
          { duration: 450, easing: Easing.in(Easing.ease) }, // fade out, termina junto con el scale en 1300ms
          (finished) => {
            // Recién cuando el ícono ya es invisible del todo, arrancamos
            // el fade de la pantalla completa.
            if (finished) {
              runOnJS(startContainerFade)();
            }
          }
        )
      )
    );
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    // Esta capa envuelve TODO (fondo + ícono): es la que se desvanece al final.
    <Animated.View style={[styles.flexFull, containerAnimatedStyle]}>
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.container}
      >
        <Animated.View style={iconAnimatedStyle}>
          <HeaderLogo largeLogo />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});