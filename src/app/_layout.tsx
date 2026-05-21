import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTintColor: '#2F4FCD',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Mi Perfil' }} />
        <Stack.Screen name="cambiar-contrasena" options={{ title: 'Cambiar Contraseña' }} />
        <Stack.Screen name="editar-usuario" options={{ title: 'Editar Perfil' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}