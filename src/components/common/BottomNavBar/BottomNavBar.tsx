import React from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { styles } from './BottomNavBar.styles';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { useTheme } from '@/hooks/useColorScheme';

export type TabName = 'Inicio' | 'Explorar' | 'Favoritos' | 'Perfil';

export interface BottomNavBarProps {
  /** The currently active tab */
  activeTab?: TabName;
  /** Callback fired when a tab is pressed */
  onTabPress?: (tab: TabName) => void;
}

interface TabItemProps {
  label: TabName;
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  isActive: boolean;
  onPress: () => void;
  theme: typeof colors.light;
}

const TabItem: React.FC<TabItemProps> = ({ label, iconName, isActive, onPress, theme }) => (
  <Pressable 
    onPress={onPress}
    style={styles.tabContainer}
    accessibilityRole="tab"
    accessibilityState={{ selected: isActive }}
  >
    <View style={[
      styles.contentWrapper, 
      isActive && styles.contentWrapperActive,
      isActive && { backgroundColor: theme.surfaceHighlight }
    ]}>
      <MaterialIcons 
        name={iconName} 
        size={22} 
        color={isActive ? theme.primary : theme.button_gray}
        style={{ marginBottom: 2 }}
      />
      <Text style={[
        styles.tabLabel, 
        isActive ? { color: theme.primary } : { color: theme.button_gray }
      ]}>
        {label}
      </Text>
    </View>
  </Pressable>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab = 'Favoritos',
  onTabPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.navBarContainer,
      {
        backgroundColor: theme.surface,
        borderTopColor: theme.border,
      }
    ]}>
      <TabItem 
        label="Inicio" 
        iconName={icons.Home} 
        isActive={activeTab === 'Inicio'} 
        onPress={() => onTabPress?.('Inicio')} 
        theme={theme}
      />
      <TabItem 
        label="Explorar" 
        iconName={icons.Explore} 
        isActive={activeTab === 'Explorar'} 
        onPress={() => onTabPress?.('Explorar')} 
        theme={theme}
      />
      <TabItem 
        label="Favoritos" 
        iconName={icons.Favorite} 
        isActive={activeTab === 'Favoritos'} 
        onPress={() => onTabPress?.('Favoritos')} 
        theme={theme}
      />
      <TabItem 
        label="Perfil" 
        iconName={icons.Person} 
        isActive={activeTab === 'Perfil'} 
        onPress={() => onTabPress?.('Perfil')} 
        theme={theme}
      />
    </View>
  );
};

