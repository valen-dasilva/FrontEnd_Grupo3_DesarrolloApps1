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
import { MapaArgentina } from '@/components/perfil/MapaArgentina/MapaArgentina';
import { MapaInteractivoModal } from '@/components/perfil/MapaArgentina/MapaInteractivoModal';
import { useEstadisticas } from '@/hooks/useEstadisticas';
import { useFavoritosHook } from '@/hooks/useFavoritos';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, logout, updateUser } = useAuth();

  const [loadingImage, setLoadingImage] = useState(false);
  const [mapaVisible, setMapaVisible] = useState(false);
  const { data: estadisticas } = useEstadisticas();
  const { listItinerarioResumen } = useFavoritosHook();

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

        <Text style={[styles.sectionLabel, { color: theme.gray }]}>MI RECORRIDO POR ARGENTINA</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {estadisticas?.totalProvincias ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Provincias</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {estadisticas?.diasTotalesViajados ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Días viajados</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {estadisticas?.porcentajeArgentina ?? 0}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>De Argentina</Text>
          </View>
        </View>

        {estadisticas?.provinciaFavorita && (
          <View style={[styles.favCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.favLabel, { color: theme.gray }]}>Provincia favorita</Text>
            <Text style={[styles.favValue, { color: theme.text }]}>
              {estadisticas.provinciaFavorita.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.mapaCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setMapaVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.mapaTitleRow}>
            <Text style={[styles.mapaTitle, { color: theme.text }]}>Provincias visitadas</Text>
            <MaterialIcons name="open-in-full" size={16} color={theme.gray} />
          </View>
          <MapaArgentina
            provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []}
            colorVisitada={theme.primary}
            colorNoVisitada={theme.border}
            strokeColor={theme.background}
            height={300}
          />
          {!estadisticas?.totalProvincias && (
            <Text style={[styles.mapaEmpty, { color: theme.gray }]}>
              Completá tus primeros viajes para ver el mapa
            </Text>
          )}
        </TouchableOpacity>

        <MapaInteractivoModal
          visible={mapaVisible}
          onClose={() => setMapaVisible(false)}
          provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []}
          favoritos={listItinerarioResumen}
          colorVisitada={theme.primary}
          colorNoVisitada={theme.border}
          strokeColor={theme.background}
          theme={theme as unknown as Record<string, string>}
        />

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