import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/use-color-scheme';

import { styles } from './ConfirmAlert.styles';

export interface ConfirmAlertProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmAlert({
  visible,
  title,
  message,
  cancelText = 'Cancelar',
  confirmText = 'Aceptar',
  onCancel,
  onConfirm,
}: ConfirmAlertProps) {
  const { theme } = useTheme();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, { color: '#FFF' }]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
