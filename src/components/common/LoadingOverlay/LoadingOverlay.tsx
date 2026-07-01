import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { styles } from './LoadingOverlay.styles';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  const { theme } = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: theme.surface }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          {message ? (
            <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};