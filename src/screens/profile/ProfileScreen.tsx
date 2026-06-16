import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
import Toast from 'react-native-toast-message';
import { styles } from './ProfileScreen.styles';

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
      Toast.show({ type: 'error', text1: 'Permiso requerido', text2: 'Necesitamos acceso a tu galería para cambiar tu foto.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const asset = result.assets[0];
      const pickedUri = asset.uri;

      if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
        Toast.show({ type: 'error', text1: 'Imagen muy pesada', text2: 'Elegí una imagen de menos de 3MB.' });
        return;
      }

      try {
        setLoadingImage(true);
        const uploadedUrl = await uploadProfilePicture(user.idUsuario, pickedUri);
        const profile = await getUserProfile(user.idUsuario);
        await updateUserProfile(user.idUsuario, {
          nombre: profile.nombre,
          apellido: profile.apellido || '',
          email: profile.email,
          fotoPerfil: uploadedUrl,
        });
        await updateUser({ fotoPerfil: uploadedUrl });
      } catch (err: any) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo subir la imagen. Verificá tu conexión.' });
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
            <UserAvatar uri={user?.fotoPerfil} nombre={user?.nombre} loading={loadingImage} size={90} />
          </TouchableOpacity>
          <Text style={[styles.nombre, { color: theme.text }]}>
            {user ? user.nombre : 'Usuario'}
          </Text>
          <Text style={[styles.email, { color: theme.gray }]}>
            {user ? user.email : 'correo@ejemplo.com'}
          </Text>

          <CustomButton
            title={loadingImage ? 'Subiendo...' : 'Subir foto'}
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