import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { BottomNavBar, TabName } from '@/components/common/BottomNavBar/BottomNavBar';

// Componente real (montado como JSX): acá SÍ se pueden usar hooks.
// Oculta la barra cuando el teclado está abierto.
function KeyboardAwareBottomNav({
  activeTab,
  onTabPress,
}: {
  activeTab: TabName;
  onTabPress: (tabName: TabName) => void;
}) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return <BottomNavBar activeTab={activeTab} onTabPress={onTabPress} />;
}

// React Navigation invoca esta función como render prop, NO como componente:
// por eso acá NO se pueden usar hooks. Solo calcula y delega.
function TabBarComponent({ state, navigation }: Readonly<BottomTabBarProps>) {
  const currentRouteName = state.routes[state.index].name;

  let activeTab: TabName = 'Inicio';
  if (currentRouteName.startsWith('explorar') || currentRouteName.startsWith('explorarApp')) activeTab = 'Explorar';
  else if (currentRouteName.startsWith('favoritos') || currentRouteName.startsWith('(favorite)')) activeTab = 'Favoritos';
  else if (currentRouteName.startsWith('grupo') || currentRouteName.startsWith('(group)')) activeTab = 'Grupos';
  else if (currentRouteName.startsWith('perfil') || currentRouteName.startsWith('perfilApp')) activeTab = 'Perfil';

  const handleTabPress = (tabName: TabName) => {
    let targetRoute = 'index';
    if (tabName === 'Explorar') targetRoute = 'explorar';
    else if (tabName === 'Favoritos') targetRoute = 'favoritos';
    else if (tabName === 'Grupos') targetRoute = 'grupo';
    else if (tabName === 'Perfil') targetRoute = 'perfil';

    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes.find((r) => r.name === targetRoute)?.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(targetRoute);
    }
  };

  return <KeyboardAwareBottomNav activeTab={activeTab} onTabPress={handleTabPress} />;
}

export default function TabLayout() {
  return (
    <Tabs tabBar={TabBarComponent} screenOptions={{ headerShown: false }} backBehavior="history">
      {/* Pantallas principales */}
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="explorar" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="grupo" options={{ title: 'Grupos' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />

      <Tabs.Screen name="(favorite)" options={{ href: null }} />
      <Tabs.Screen name="(group)" options={{ href: null }} />
      <Tabs.Screen name="explorarApp" options={{ href: null }} />
      <Tabs.Screen name="inicioApp" options={{ href: null }} />
      <Tabs.Screen name="perfilApp" options={{ href: null }} />
    </Tabs>
  );
}