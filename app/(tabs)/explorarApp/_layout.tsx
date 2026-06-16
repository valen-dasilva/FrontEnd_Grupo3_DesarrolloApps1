import { Stack } from 'expo-router';

export default function ExplorarAppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="itinerarioInfo" />
    </Stack>
  );
}
