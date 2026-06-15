import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePicture, getUserProfile, updateUserProfile } from '@/services/userService';
import { CustomButton } from '@/components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { UserAvatar } from '@/components/common/UserAvatar/UserAvatar';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  
  const [loadingImage, setLoadingImage] = useState(false);



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
      quality: 0.5, // Optimizes and limits the file size
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const asset = result.assets[0];
      const pickedUri = asset.uri;

      // Limitar peso de la imagen a ~3MB por eficiencia, aunque con quality: 0.5 ya debería ser ligera
      if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
        Alert.alert('Imagen muy pesada', 'Por favor selecciona una imagen de menor tamaño (máximo 3MB).');
        return;
      }

      // Limitar a JPG/JPEG. En Expo quality < 1 frecuentemente devuelve JPEG
      const isJpg = pickedUri.toLowerCase().endsWith('.jpg') || pickedUri.toLowerCase().endsWith('.jpeg') || (asset.mimeType && asset.mimeType.includes('jpeg'));
      if (!isJpg) {
        // Mostramos un aviso pero procedemos, ya que el mimeType a veces no se detecta correctamente en el simulador
        console.log("Aviso: El formato podría no ser JPG puro, pero intentaremos subirlo optimizado.");
      }

      try {
        setLoadingImage(true);
        // El uploadProfilePicture va a generar una URL única con Date.now() en supabase
        const uploadedUrl = await uploadProfilePicture(user.idUsuario, pickedUri);
        
        // Fetch full profile from backend to ensure we have name and surname
        const profile = await getUserProfile(user.idUsuario);
        
        // Save the updated profile to the backend
        await updateUserProfile(user.idUsuario, {
          nombre: profile.nombre,
          apellido: profile.apellido || '',
          email: profile.email,
          fotoPerfil: uploadedUrl,
        });

        // Update the global authentication state.
        // Como la URL es distinta por el Date.now(), Image de expo-image se recargará automáticamente.
        await updateUser({
          fotoPerfil: uploadedUrl,
        });

      } catch (err: any) {
        console.error('Error al subir imagen de perfil:', err);
        Alert.alert('Error', 'No se pudo subir la imagen de perfil. Verifica tu conexión.');
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
            onPress={handlePickImage}
            disabled={loadingImage}
            activeOpacity={0.8}
            style={styles.avatarTouch}
          >
            <UserAvatar
              uri={user?.fotoPerfil}
              nombre={user?.nombre}
              loading={loadingImage}
              size={90}
            />
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
          <View style={styles.optionLeft}>
            <MaterialIcons name={icons.Person} size={20} color={theme.text} />
            <Text style={[styles.optionText, { color: theme.text }]}>Editar Usuario</Text>
          </View>
          <MaterialIcons name={icons['chevron.right']} size={22} color={theme.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/perfilApp/cambiarContrasena')}
        >
          <View style={styles.optionLeft}>
            <MaterialIcons name={icons.Lock} size={20} color={theme.text} />
            <Text style={[styles.optionText, { color: theme.text }]}>Cambiar Contraseña</Text>
          </View>
          <MaterialIcons name={icons['chevron.right']} size={22} color={theme.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: theme.danger }]}
          onPress={logout}
        >
          <MaterialIcons name={icons.Logout} size={18} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>Cerrar Sesión</Text>
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
  logoutText: {
    fontWeight: '700',
    fontSize: 15,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
});
