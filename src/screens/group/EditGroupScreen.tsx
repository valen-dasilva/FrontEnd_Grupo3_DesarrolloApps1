import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { FullScreenLoader } from '@/components/common/FullScreenLoader/FullScreenLoader';
import { useGroupDetailsHook } from '@/hooks/useGroups';
import { useTheme } from '@/hooks/useColorScheme';
import { uploadGroupCover } from '@/services/groupService';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

const MAX_COVER_BYTES = 3 * 1024 * 1024;

export default function EditGroupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { idGrupo } = useLocalSearchParams<{ idGrupo: string }>();
  const groupId = Number(idGrupo);
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { group, isLoading, editGroup, isUpdating } = useGroupDetailsHook(
    Number.isNaN(groupId) ? null : groupId,
  );

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (group) {
      setName(group.nombre);
      setDescription(group.descripcion ?? '');
      setCoverUrl(group.fotoPortada ?? null);
    }
  }, [group]);

  const handlePickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar una foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_COVER_BYTES) {
      Alert.alert('Foto muy pesada', 'La imagen debe pesar menos de 3 MB.');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadGroupCover(asset.uri);
      setCoverUrl(url);
    } catch {
      Alert.alert('Error', 'No se pudo subir la foto de portada.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Error', 'El nombre del grupo es obligatorio.');
      return;
    }

    await editGroup(groupId, {
      nombre: trimmedName,
      descripcion: description.trim() || null,
      fotoPortada: coverUrl,
    });

    router.back();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Editar grupo" showBackButton onBackPress={() => router.back()} onThemeTogglePress={toggleColorScheme} />
        <FullScreenLoader />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Editar grupo"
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <CustomInput
            label="Nombre del grupo"
            placeholder="Ej: Viaje a Bariloche"
            value={name}
            onChangeText={setName}
            maxLength={35}
          />

          <CustomInput
            label="Descripción (opcional)"
            placeholder="Ej: Grupo para organizar el viaje de fin de año"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />

          <Text style={[styles.photoLabel, { color: theme.text }]}>Foto de portada</Text>

          {coverUrl ? (
            <View style={styles.photoPreviewContainer}>
              <Pressable onPress={handlePickCover}>
                <Image source={{ uri: coverUrl }} style={styles.photoPreview} />
              </Pressable>
              <Pressable
                onPress={() => setCoverUrl(null)}
                style={[styles.removeButton, { backgroundColor: theme.danger }]}
                accessibilityLabel="Quitar foto de portada"
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handlePickCover}
              disabled={uploading}
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.card, borderColor: theme.border },
                pressed && { opacity: 0.8 },
              ]}
            >
              {uploading ? (
                <Text style={[styles.addText, { color: theme.primary }]}>Subiendo...</Text>
              ) : (
                <>
                  <Ionicons name="images-outline" size={28} color={theme.primary} />
                  <Text style={[styles.addText, { color: theme.primary }]}>Agregar</Text>
                </>
              )}
            </Pressable>
          )}

          <View style={styles.spacer} />

          <CustomButton
            title={isUpdating ? 'Guardando...' : 'Guardar cambios'}
            onPress={handleSave}
            disabled={isUpdating || uploading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    padding: paddings.spacing.lg,
    paddingBottom: paddings.spacing.xxxl,
  },
  photoLabel: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
    marginBottom: paddings.spacing.sm,
    marginTop: paddings.spacing.sm,
  },
  addButton: {
    width: 112,
    height: 112,
    borderRadius: paddings.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: paddings.spacing.xs,
  },
  addText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.sm,
  },
  photoPreviewContainer: {
    width: 112,
    height: 112,
    borderRadius: paddings.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
    minHeight: paddings.spacing.xxxl,
  },
});
