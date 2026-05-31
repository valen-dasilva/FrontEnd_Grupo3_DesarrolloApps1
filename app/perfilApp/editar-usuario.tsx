import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

export default function EditarUsuarioScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.avatarCircle, isDark && { backgroundColor: '#2A303D' }]}>
          <Text style={[styles.avatarInitials, { color: theme.primary }]}>MR</Text>
        </View>
        <Text style={[styles.changePhoto, { color: theme.primary }]}>Cambiar foto de perfil</Text>

        <Text style={[styles.label, { color: theme.text }]}>Nombre</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.surface, 
            borderColor: theme.border, 
            color: theme.text 
          }]}
          placeholder="Mateo"
          placeholderTextColor={theme.textSecondary}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={[styles.label, { color: theme.text }]}>Apellido</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.surface, 
            borderColor: theme.border, 
            color: theme.text 
          }]}
          placeholder="Rossi"
          placeholderTextColor={theme.textSecondary}
          value={apellido}
          onChangeText={setApellido}
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.surface, 
            borderColor: theme.border, 
            color: theme.text 
          }]}
          placeholder="tu@correo.com"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
          <Text style={styles.primaryBtnText}>✓  Guardar Cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerBtn, { backgroundColor: theme.danger }]}
          onPress={() => router.back()}
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
  avatarInitials: { fontSize: 28, fontWeight: '700', color: COLORS.primary },
  changePhoto: {
    fontSize: 13,
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 12,
    fontWeight: '600',
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
  deleteAccount: {
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
    fontWeight: '600',
  },
});