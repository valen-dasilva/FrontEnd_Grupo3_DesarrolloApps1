import React from 'react';
import { Modal, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/hooks/useColorScheme';

interface Props {
  visible: boolean;
  /** 'loading' muestra spinner; 'success' muestra tilde verde + botón de acción */
  state: 'loading' | 'success';
  title: string;
  message?: string;
  /** Texto del botón que aparece en estado 'success' */
  actionLabel?: string;
  /** Acción del botón (cerrar el modal y/o navegar) */
  onAction?: () => void;
}

/**
 * Modal de progreso reutilizable: arranca en "loading" mientras corre una
 * acción y pasa a "success" (tilde verde) cuando termina, con un botón
 * opcional. Usado al crear una copia y al completar un viaje.
 */
export function StatusModal({ visible, state, title, message, actionLabel, onAction }: Props) {
  const { theme } = useTheme();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onAction}>
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: theme.surface }]}>
          {state === 'loading' ? (
            <ActivityIndicator size="large" color={theme.primary} style={styles.icon} />
          ) : (
            <MaterialIcons name="check-circle" size={56} color={theme.lightgreen} style={styles.icon} />
          )}

          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
          ) : null}

          {state === 'success' && actionLabel && onAction ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={onAction}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>{actionLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  box: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },
  icon: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  message: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  button: {
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
