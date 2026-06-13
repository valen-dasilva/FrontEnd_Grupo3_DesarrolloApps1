import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNavBar, TabName } from '@/components/common/BottomNavBar/BottomNavBar';

// Uses BottomTabBarProps so TabBarComponent can be passed directly as tabBar={TabBarComponent}
// with no anonymous wrapper arrow function inside TabLayout.
function TabBarComponent({ state, navigation }: Readonly<BottomTabBarProps>) {
  const currentRouteName = state.routes[state.index].name;

  let activeTab: TabName = 'Inicio';
  if (currentRouteName === 'explorar') activeTab = 'Explorar';
  else if (currentRouteName === 'favoritos') activeTab = 'Favoritos';
  else if (currentRouteName === 'perfil') activeTab = 'Perfil';

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
    <Tabs
      tabBar={TabBarComponent}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="explorar"
        options={{
          title: 'Explorar',
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
