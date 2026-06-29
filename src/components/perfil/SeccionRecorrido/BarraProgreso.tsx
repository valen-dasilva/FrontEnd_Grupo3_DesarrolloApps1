import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useColorScheme';

interface Props {
  porcentaje: number;
  color?: string;
  trackColor?: string;
  height?: number;
}

export function BarraProgreso({ porcentaje, color, trackColor, height = 8 }: Props) {
  const { theme } = useTheme();
  const valor = Math.min(Math.max(porcentaje, 0), 100);
  const relleno = useSharedValue(0);

  useEffect(() => {
    relleno.value = withTiming(valor, { duration: 700 });
  }, [valor, relleno]);

  const estiloBarra = useAnimatedStyle(() => ({ width: `${relleno.value}%` }));
  const radius = height / 2;

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: trackColor ?? theme.surfaceNeutral,
          height,
          borderRadius: radius,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color ?? theme.primary,
            height,
            borderRadius: radius,
          },
          estiloBarra,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  fill: {
    width: 0,
  },
});
