import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { getProfile, updateProfile } from '../../src/services/profileService';
import { ApiError } from '../../src/services/api';

export default function EditarUsuarioScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar perfil completo al entrar a la pantalla
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const profile = await getProfile(user.idUsuario);
        setFirstName(profile.nombre);
        setLastName(profile.apellido);
        setEmail(profile.email);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'No se pudo cargar el perfil',
          text2: err instanceof ApiError ? err.message : undefined,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Toast.show({ type: 'error', text1: 'Completá todos los campos' });
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile(user.idUsuario, {
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        email: email.trim(),
      });

      // Refrescamos el AuthContext para que la pantalla de Perfil muestre los datos nuevos
      await updateUser({
        nombre: updated.nombre,
        email: updated.email,
      });

      Toast.show({ type: 'success', text1: 'Perfil actualizado' });
      router.back();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al actualizar';
      Toast.show({ type: 'error', text1: message });
    } finally {
      setSaving(false);
    }
  };

  // Iniciales para el avatar
  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : firstName
        ? firstName.substring(0, 2).toUpperCase()
        : 'U';

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.avatarCircle, isDark && { backgroundColor: '#2A303D' }]}>
          <Text style={[styles.avatarInitials, { color: theme.primary }]}>{initials}</Text>
        </View>
        <Text style={[styles.changePhoto, { color: theme.primary }]}>Cambiar foto de perfil</Text>

        <Text style={[styles.label, { color: theme.text }]}>Nombre</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          }]}
          placeholder="Mateo"
          placeholderTextColor={theme.textSecondary}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={[styles.label, { color: theme.text }]}>Apellido</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          }]}
          placeholder="Rossi"
          placeholderTextColor={theme.textSecondary}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            color: theme.text,
          }]}
          placeholder="tu@correo.com"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D6E0F5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  avatarInitials: { fontSize: 28, fontWeight: '700' },
  changePhoto: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 12,
    fontWeight: '600',
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