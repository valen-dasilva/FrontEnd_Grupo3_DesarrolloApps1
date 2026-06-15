import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNavBar, TabName } from '@/components/common/BottomNavBar/BottomNavBar';

// Uses BottomTabBarProps so TabBarComponent can be passed directly as tabBar={TabBarComponent}
// with no anonymous wrapper arrow function inside TabLayout.
function TabBarComponent({ state, navigation }: Readonly<BottomTabBarProps>) {
  const currentRouteName = state.routes[state.index].name;


  let activeTab: TabName = 'Inicio';
  if (currentRouteName.startsWith('explorar') || currentRouteName.startsWith('explorarApp')) activeTab = 'Explorar';
  else if (currentRouteName.startsWith('favoritos') || currentRouteName.startsWith('(favorite)')) activeTab = 'Favoritos';
  else if (currentRouteName.startsWith('perfil') || currentRouteName.startsWith('perfilApp')) activeTab = 'Perfil';
  else if (currentRouteName.startsWith('inicioApp')) activeTab = 'Inicio';

  const handleTabPress = (tabName: TabName) => {
    let targetRoute = 'index';
    if (tabName === 'Explorar') targetRoute = 'explorar';
    else if (tabName === 'Favoritos') targetRoute = 'favoritos';
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

  return <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />;
}

export default function TabLayout() {
  return (
    <Tabs tabBar={TabBarComponent} screenOptions={{ headerShown: false, }}>
      {/* Pantallas principales */}
      <Tabs.Screen name="index" options={{ title: 'Inicio',}} />
      <Tabs.Screen name="explorar" options={{title: 'Explorar',}}/>
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos',}}/>
      <Tabs.Screen name="perfil" options={{title: 'Perfil',}}/>

      {/* Navegacion por stacks */}
      <Tabs.Screen name="(favorite)" options={{ href: null }} />
      <Tabs.Screen name="explorarApp" options={{ href: null }} />
      <Tabs.Screen name="inicioApp" options={{ href: null }} />
      <Tabs.Screen name="perfilApp" options={{ href: null }} />
    </Tabs>
  );
}
