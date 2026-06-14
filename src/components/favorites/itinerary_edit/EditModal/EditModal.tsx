import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { styles } from './EditModal.styles';

export interface EditModalProps {
  /** Controls the visibility of the modal */
  visible: boolean;
  /** Callback triggered when closing the modal without saving */
  onClose: () => void;
  /** Callback triggered when saving the edited title */
  onSave: (newTitle: string) => void;
  /** The initial value of the input */
  initialValue: string;
}

export const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSave,
  initialValue,
}) => {
  const [text, setText] = useState(initialValue);
  const { theme } = useTheme();

  // Sync state with initialValue when modal becomes visible
  useEffect(() => {
    if (visible) {
      setText(initialValue);
    }
  }, [visible, initialValue]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={[styles.modalContainer, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Editar Actividad</Text>
          <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>Ingresa el nuevo título para la actividad:</Text>

          <View style={[styles.inputContainer, { backgroundColor: theme.surfaceNeutralAlt, borderColor: theme.borderDark }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={text}
              onChangeText={setText}
              placeholder="Ej. Trekking Glaciar"
              placeholderTextColor={theme.textSecondary}
              autoFocus
              selectTextOnFocus
            />
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                { backgroundColor: theme.surfaceNeutral },
                pressed && styles.pressedState,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.button,
                styles.saveButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressedState,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Guardar cambios"
            >
              <Text style={[styles.saveButtonText, { color: theme.textInverse }]}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
