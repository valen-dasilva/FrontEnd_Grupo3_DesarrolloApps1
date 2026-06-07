import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/use-color-scheme';
import { icons } from '../../../constants/icons';
import { styles } from './OfflineBadge.styles';

export interface OfflineBadgeProps {
  /** Optional custom container style */
  style?: StyleProp<ViewStyle>;
}

export const OfflineBadge: React.FC<OfflineBadgeProps> = ({ style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.offlineBadge, { backgroundColor: theme.surface }, style]}>
      <MaterialIcons 
        name={icons.CloudOffline}
        size={12}
        color={theme.primary}
      />
      <Text style={[styles.offlineBadgeText, { color: theme.primary }]}>Disponible Offline</Text>
    </View>
  );
};
