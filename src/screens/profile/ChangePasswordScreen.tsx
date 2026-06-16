import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { changePassword } from '@/services/userService';
import { MaterialIcons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import Toast from 'react-native-toast-message';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Pressable,
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

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  const handleSave = async () => {
  if (!actual.trim() || !nueva.trim() || !confirmar.trim()) {
    Toast.show({ type: 'error', text1: 'Campos incompletos', text2: 'Completá todos los campos.' });
    return;
  }

  if (nueva.length < 6) {
    Toast.show({ type: 'error', text1: 'Contraseña muy corta', text2: 'Mínimo 6 caracteres.' });
    return;
  }

  if (nueva !== confirmar) {
    Toast.show({ type: 'error', text1: 'No coinciden', text2: 'Las contraseñas nuevas no coinciden.' });
    return;
  }

  if (!user) return;

  try {
    setLoading(true);
    await changePassword(user.idUsuario, {
      contraseniaActual: actual,
      contraseniaNueva: nueva,
    });
    Toast.show({ type: 'success', text1: 'Contraseña actualizada', text2: 'Tu contraseña se cambió correctamente.' });
    router.navigate('/(tabs)/perfil');
  } catch (err: any) {
    Toast.show({ type: 'error', text1: 'Error', text2: err.message || 'No se pudo cambiar la contraseña.' });
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

        <Text style={[styles.label, { color: theme.text }]}>Contraseña actual</Text>
        <View style={[styles.passwordField, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput
            style={[styles.passwordInput, { color: theme.text }]}
            secureTextEntry={!showActual}
            placeholder="••••••••"
            placeholderTextColor={theme.textSecondary}
            value={actual}
            onChangeText={setActual}
          />
          <Pressable onPress={() => setShowActual((v) => !v)} hitSlop={8}>
            <MaterialIcons
              name={showActual ? icons.Visibility : icons.VisibilityOff}
              size={22}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Nueva contraseña</Text>
        <View style={[styles.passwordField, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput
            style={[styles.passwordInput, { color: theme.text }]}
            secureTextEntry={!showNueva}
            placeholder="••••••••"
            placeholderTextColor={theme.textSecondary}
            value={nueva}
            onChangeText={setNueva}
          />
          <Pressable onPress={() => setShowNueva((v) => !v)} hitSlop={8}>
            <MaterialIcons
              name={showNueva ? icons.Visibility : icons.VisibilityOff}
              size={22}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Confirmar nueva contraseña</Text>
        <View style={[styles.passwordField, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput
            style={[styles.passwordInput, { color: theme.text }]}
            secureTextEntry={!showConfirmar}
            placeholder="••••••••"
            placeholderTextColor={theme.textSecondary}
            value={confirmar}
            onChangeText={setConfirmar}
          />
          <Pressable onPress={() => setShowConfirmar((v) => !v)} hitSlop={8}>
            <MaterialIcons
              name={showConfirmar ? icons.Visibility : icons.VisibilityOff}
              size={22}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

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
          onPress={() => router.navigate('/(tabs)/perfil')}
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
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
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