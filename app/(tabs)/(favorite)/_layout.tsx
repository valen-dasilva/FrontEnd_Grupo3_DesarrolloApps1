import { Stack } from 'expo-router';
import React from 'react';

export default function FavoriteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="itinerarioInfoFav" />
      <Stack.Screen name="edicionItinerario" />
      <Stack.Screen name="editActivityFormulary" />
    </Stack>
  );
}
