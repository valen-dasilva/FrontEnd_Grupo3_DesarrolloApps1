import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';
import { useAuth } from '../../src/context/AuthContext';
import { changePassword } from '../../src/services/profileService';
import { ApiError } from '../../src/services/api';

export default function CambiarContrasenaScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const handleSave = async () => {
    if (!user) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Completá todos los campos' });
      return;
    }
    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'La nueva contraseña debe tener al menos 6 caracteres',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    setSaving(true);
    try {
      await changePassword(user.idUsuario, {
        contraseniaActual: currentPassword,
        contraseniaNueva: newPassword,
      });
      Toast.show({ type: 'success', text1: 'Contraseña actualizada' });
      router.back();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cambiar contraseña';
      Toast.show({ type: 'error', text1: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.lockCircle, isDark && { backgroundColor: '#2A303D' }]}>
          <Text style={{ fontSize: 26 }}>🔒</Text>
        </View>

        <Text style={[styles.bigTitle, { color: theme.text }]}>Protege tu cuenta</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Ingresa tu contraseña actual y elige una nueva para proteger tu cuenta.
          Asegúrate de que sea única y difícil de adivinar.
        </Text>

        <Text style={[styles.label, { color: theme.text }]}>Contraseña actual</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          }]}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={theme.textSecondary}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <Text style={[styles.label, { color: theme.text }]}>Nueva contraseña</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          }]}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={theme.textSecondary}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={[styles.label, { color: theme.text }]}>Confirmar nueva contraseña</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          }]}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={theme.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryBtnText}>✓  Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerBtn, { backgroundColor: theme.danger }]}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.dangerBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  lockCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D6E0F5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  bigTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  primaryBtn: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  dangerBtn: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  dangerBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});