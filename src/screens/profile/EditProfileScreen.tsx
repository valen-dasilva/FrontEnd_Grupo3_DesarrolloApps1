import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { UserAvatar } from "@/components/common/UserAvatar/UserAvatar";
import { CustomInput } from "@/components/CustomInput";
import { FormActionButtons } from "@/components/common/FormActionButtons";
import { Header } from "@/components/common/Header/Header";
import Toast from 'react-native-toast-message';
import { ScrollView, ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './EditProfileScreen.styles';

export default function EditarUsuarioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const { theme } = useTheme(); 

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const profileLoaded = useRef(false);

  useEffect(() => {
    if (user?.idUsuario && !profileLoaded.current) {
      profileLoaded.current = true;
      setNombre(user.nombre);
      setCorreo(user.email);
      setFotoPerfil(user.fotoPerfil);

      setLoading(true);
      getUserProfile(user.idUsuario)
        .then((profile) => {
          setNombre(profile.nombre);
          setApellido(profile.apellido || "");
          setCorreo(profile.email);
          setFotoPerfil((current) => current ?? profile.fotoPerfil);
        })
        .catch(() => {
          Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo cargar el perfil.' });
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      Toast.show({ type: 'error', text1: 'Campos incompletos', text2: 'Nombre y apellido son obligatorios.' });
      return;
    }

    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(user!.idUsuario, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: correo,
        fotoPerfil: fotoPerfil,
      });

      await updateUser({
        nombre: updatedProfile.nombre,
        fotoPerfil: updatedProfile.fotoPerfil,
      });

      Toast.show({ type: 'success', text1: 'Cambios guardados', text2: 'Tu perfil se actualizó correctamente.' });
      router.navigate('/(tabs)/perfil');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message || 'No se pudieron guardar los cambios.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title="Editar Perfil"
        showBackButton={true}
        onBackPress={() => router.navigate('/(tabs)/perfil')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarContainer}>
          <UserAvatar uri={fotoPerfil} nombre={nombre} apellido={apellido} size={90} />
        </View>

        {loading && (
          <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 10 }} />
        )}

        <CustomInput
          label="Nombre"
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <CustomInput
          label="Apellido"
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />

        <CustomInput
          label="Correo Electrónico (No modificable)"
          value={correo}
          editable={false}
        />

        <FormActionButtons 
          loading={loading}
          onSave={handleSave}
          onCancel={() => router.navigate('/(tabs)/perfil')}
        />
      </ScrollView>
    </View>
  );
}