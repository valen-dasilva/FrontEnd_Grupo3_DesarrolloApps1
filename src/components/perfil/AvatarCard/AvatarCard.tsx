import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useColorScheme';
import { uploadProfilePicture, getUserProfile, updateUserProfile } from '@/services/userService';
import { CustomButton } from '@/components/CustomButton';
import { UserAvatar } from '@/components/common/UserAvatar/UserAvatar';

export function AvatarCard() {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    if (!user) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permiso requerido', text2: 'Necesitamos acceso a tu galería para cambiar tu foto.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
        Toast.show({ type: 'error', text1: 'Imagen muy pesada', text2: 'Elegí una imagen de menos de 3MB.' });
        return;
      }

      try {
        setLoading(true);
        const uploadedUrl = await uploadProfilePicture(user.idUsuario, asset.uri);
        const profile = await getUserProfile(user.idUsuario);
        await updateUserProfile(user.idUsuario, {
          nombre: profile.nombre,
          apellido: profile.apellido || '',
          email: profile.email,
          fotoPerfil: uploadedUrl,
        });
        await updateUser({ fotoPerfil: uploadedUrl });
      } catch {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo subir la imagen. Verificá tu conexión.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity
        onPress={handlePickImage}
        disabled={loading}
        activeOpacity={0.8}
        style={styles.avatarTouch}
      >
        <UserAvatar uri={user?.fotoPerfil} nombre={user?.nombre} loading={loading} size={90} />
      </TouchableOpacity>

      <Text style={[styles.nombre, { color: theme.text }]}>
        {user?.nombre ?? 'Usuario'}
      </Text>
      <Text style={[styles.email, { color: theme.gray }]}>
        {user?.email ?? 'correo@ejemplo.com'}
      </Text>

      <CustomButton
        title={loading ? 'Subiendo...' : 'Subir foto'}
        variant="outline"
        onPress={handlePickImage}
        disabled={loading}
        style={styles.uploadButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  avatarTouch: {
    marginBottom: 12,
    borderRadius: 45,
    overflow: 'hidden',
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
    borderRadius: 16,
    marginVertical: 0,
  },
});
