import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePicture, getUserProfile, updateUserProfile } from '@/services/userService';
import { CustomButton } from '@/components/CustomButton';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  
  const [loadingImage, setLoadingImage] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handlePickImage = async () => {
    if (!user) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galería para cambiar tu foto de perfil.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const pickedUri = result.assets[0].uri;
      try {
        setLoadingImage(true);
        const uploadedUrl = await uploadProfilePicture(user.idUsuario, pickedUri);
        
        // Fetch full profile from backend to ensure we have name and surname
        const profile = await getUserProfile(user.idUsuario);
        
        // Save the updated profile to the backend
        await updateUserProfile(user.idUsuario, {
          nombre: profile.nombre,
          apellido: profile.apellido || '',
          fotoPerfil: uploadedUrl,
        });

        // Update the global authentication state
        await updateUser({
          fotoPerfil: uploadedUrl,
        });

      } catch (err: any) {
        console.error('Error al subir imagen de perfil:', err);
        Alert.alert('Error', 'No se pudo subir la imagen de perfil.');
      } finally {
        setLoadingImage(false);
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Perfil" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.avatarCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.avatarCircle, { backgroundColor: theme.avatarBg, overflow: 'hidden' }]}
            onPress={handlePickImage}
            disabled={loadingImage}
            activeOpacity={0.8}
          >
            {loadingImage ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : user?.fotoPerfil ? (
              <Image source={{ uri: user.fotoPerfil }} style={styles.avatarImage} />
            ) : (
              <Text style={[styles.avatarInitials, { color: theme.primary }]}>
                {user ? getInitials(user.nombre) : 'U'}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {user ? user.nombre : 'Usuario'}
          </Text>
          <Text style={[styles.email, { color: theme.gray }]}>
            {user ? user.email : 'correo@ejemplo.com'}
          </Text>

          <CustomButton
            title={loadingImage ? "Subiendo..." : "Subir foto"}
            variant="outline"
            onPress={handlePickImage}
            disabled={loadingImage}
            style={styles.uploadButton}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: theme.gray }]}>SEGURIDAD Y CUENTA</Text>

        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/perfilApp/editarUsuario')}
        >
          <Text style={[styles.optionText, { color: theme.text }]}>👤  Editar Usuario</Text>
          <Text style={[styles.chevron, { color: theme.gray }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/perfilApp/cambiarContrasena')}
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
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
  uploadButton: {
    width: 140,
    height: 38,
    marginTop: 14,
    borderRadius: 20,
    marginVertical: 0,
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
