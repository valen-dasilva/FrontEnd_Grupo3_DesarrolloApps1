import { Stack } from 'expo-router';
import React from 'react';

export default function GroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="crearGrupo" />
      <Stack.Screen name="unirseGrupo" />
      <Stack.Screen name="detalleGrupo" />
      <Stack.Screen name="encuestas" />
      <Stack.Screen name="detalleEncuesta" />
      <Stack.Screen name="crearEncuesta" />
      <Stack.Screen name="detalleOpcion" />
      <Stack.Screen name="itinerarioGrupo" />
    </Stack>
  );
}
