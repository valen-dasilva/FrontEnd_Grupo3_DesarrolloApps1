import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Tope del stagger: a partir de este índice todos los ítems usan el mismo delay.
// Sin el tope, un ítem en la posición 20 esperaba 1,6 s en aparecer al scrollear.
const MAX_STAGGER_INDEX = 8;
const STAGGER_STEP_MS = 80;

interface Props {
  /** Índice del ítem en la lista (de renderItem) */
  index: number;
  children: React.ReactNode;
}

/**
 * Envoltorio de animación de entrada (FadeInDown escalonado) para ítems de lista.
 * Centraliza el patrón `<Animated.View entering={FadeInDown.delay(index * 80)}>`
 * que estaba repetido en cada FlatList, y capea el delay para no penalizar el
 * scroll en listas largas.
 */
export function AnimatedListItem({ index, children }: Props) {
  const delay = Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP_MS;
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(300)}>
      {children}
    </Animated.View>
  );
}
