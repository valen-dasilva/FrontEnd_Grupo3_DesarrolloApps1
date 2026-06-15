import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { changePassword } from '@/services/userService';
import { MaterialIcons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { validatePasswordChange } from './passwordValidation';
import { CustomInput } from '@/components/CustomInput';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

const COLORS = {
  primary: '#2F4FCD',
  danger: '#C0392B',
  bg: '#F4F5F7',
  card: '#FFFFFF',
  text: '#1A1A2E',
  gray: '#8A8A9E',
  border: '#E2E4EA',
  inputBg: '#F7F8FA',
};

export default function CambiarContrasenaScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  const handleSave = async () => {
    const validation = validatePasswordChange(actual, nueva, confirmar);
    if (!validation.valid) {
      Alert.alert(validation.errorTitle!, validation.errorMessage!);
      return;
    }

    if (!user) return;

    try {
      setLoading(true);
      await changePassword(user.idUsuario, {
        contraseniaActual: actual,
        contraseniaNueva: nueva,
      });
      Alert.alert('Éxito', 'Tu contraseña fue actualizada correctamente.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Error al cambiar contraseña:', err);
      Alert.alert('Error', err.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={[styles.lockCircle, isDark && { backgroundColor: '#2A303D' }]}>
          <MaterialIcons name={icons.Lock} size={26} color={theme.primary} />
        </View>

        <Text style={[styles.bigTitle, { color: theme.text }]}>Protege tu cuenta</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Ingresa tu contraseña actual y elige una nueva para proteger tu
          cuenta. Asegúrate de que sea única y difícil de adivinar.
        </Text>

        <CustomInput
          label="Contraseña actual"
          secureTextEntry
          placeholder="••••••••"
          value={actual}
          onChangeText={setActual}
        />

        <CustomInput
          label="Nueva contraseña"
          secureTextEntry
          placeholder="••••••••"
          value={nueva}
          onChangeText={setNueva}
        />

        <CustomInput
          label="Confirmar nueva contraseña"
          secureTextEntry
          placeholder="••••••••"
          value={confirmar}
          onChangeText={setConfirmar}
        />

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? 'Guardando...' : '✓  Guardar Cambios'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerBtn, { backgroundColor: theme.danger }]}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.dangerBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
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
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  dangerBtn: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  dangerBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});