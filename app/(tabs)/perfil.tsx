import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';
import { useAuth } from '../../src/context/AuthContext';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Perfil" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.avatarCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: isDark ? '#2A303D' : '#D6E0F5' }]}>
            <Text style={[styles.avatarInitials, { color: theme.primary }]}>
              {user ? getInitials(user.nombre) : 'U'}
            </Text>
          </View>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {user ? user.nombre : 'Usuario'}
          </Text>
          <Text style={[styles.email, { color: theme.gray }]}>
            {user ? user.email : 'correo@ejemplo.com'}
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.gray }]}>SEGURIDAD Y CUENTA</Text>

        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/perfilApp/editar-usuario')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>👤  Editar Usuario</Text>
          <Text style={[styles.chevron, { color: theme.gray }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/perfilApp/cambiar-contrasena')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>🔒  Cambiar Contraseña</Text>
          <Text style={[styles.chevron, { color: theme.gray }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.logoutBtn, { borderColor: theme.danger }]}
          onPress={logout}
        >
          <Text style={[styles.logoutText, { color: theme.danger }]}>⏻  Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
  },
  nombre: {
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  optionRow: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 22,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 15,
  },
});
