import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/hooks/useColorScheme';
import { FotoItinerarioUsuario } from '@/services/itinerariosService';
import {
  ItineraryPhotoFile,
  MAX_ITINERARY_PHOTO_BYTES,
  MAX_ITINERARY_PHOTOS,
} from '@/services/itineraryPhotoService';

import { styles } from './ItineraryPhotoPicker.styles';

export interface SelectedItineraryPhoto extends ItineraryPhotoFile {
  key: string;
}

type Props = Readonly<{
  photos: readonly SelectedItineraryPhoto[];
  onChange: (photos: SelectedItineraryPhoto[]) => void;
  existingPhotos?: readonly FotoItinerarioUsuario[];
  onRemoveExisting?: (photo: FotoItinerarioUsuario) => void;
  disabled?: boolean;
}>;

export function ItineraryPhotoPicker({
  photos,
  onChange,
  existingPhotos = [],
  onRemoveExisting,
  disabled = false,
}: Props) {
  const { theme } = useTheme();
  const totalCount = existingPhotos.length + photos.length;
  const remainingSlots = Math.max(0, MAX_ITINERARY_PHOTOS - totalCount);

  const handlePickPhotos = useCallback(async () => {
    if (disabled || remainingSlots === 0) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({
        type: 'error',
        text1: 'Permiso requerido',
        text2: 'Necesitamos acceso a tu galería para seleccionar fotos.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      orderedSelection: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets) return;

    const validAssets = result.assets.filter((asset) =>
      !asset.fileSize || asset.fileSize <= MAX_ITINERARY_PHOTO_BYTES
    );

    if (validAssets.length < result.assets.length) {
      Toast.show({
        type: 'error',
        text1: 'Algunas fotos son muy pesadas',
        text2: 'Solo se agregaron imágenes de hasta 8 MB.',
      });
    }

    const selected = validAssets.slice(0, remainingSlots).map((asset, index) => ({
      key: `${asset.assetId ?? asset.uri}_${Date.now()}_${index}`,
      uri: asset.uri,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
    }));

    if (validAssets.length > remainingSlots) {
      Toast.show({
        type: 'info',
        text1: 'Límite de fotos alcanzado',
        text2: `Podés agregar hasta ${MAX_ITINERARY_PHOTOS} fotos por itinerario.`,
      });
    }

    onChange([...photos, ...selected]);
  }, [disabled, onChange, photos, remainingSlots]);

  const handleRemove = useCallback((key: string) => {
    onChange(photos.filter((photo) => photo.key !== key));
  }, [onChange, photos]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Fotos del viaje</Text>
          <Text style={[styles.helper, { color: theme.textSecondary }]}>Hasta 10 fotos de 8 MB cada una</Text>
        </View>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>
          {totalCount}/{MAX_ITINERARY_PHOTOS}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoList}
      >
        {existingPhotos.map((photo) => (
          <View key={`existing-${photo.id}`} style={[styles.preview, { borderColor: theme.border }]}>
            <Image source={{ uri: photo.url }} style={styles.previewImage} resizeMode="cover" />
            {onRemoveExisting && (
              <TouchableOpacity
                accessibilityLabel="Eliminar foto del itinerario"
                disabled={disabled}
                onPress={() => onRemoveExisting(photo)}
                style={[styles.removeButton, { backgroundColor: theme.danger }]}
              >
                <Ionicons name="trash-outline" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {photos.map((photo) => (
          <View key={photo.key} style={[styles.preview, { borderColor: theme.border }]}>
            <Image source={{ uri: photo.uri }} style={styles.previewImage} resizeMode="cover" />
            <TouchableOpacity
              accessibilityLabel="Quitar foto seleccionada"
              disabled={disabled}
              onPress={() => handleRemove(photo.key)}
              style={[styles.removeButton, { backgroundColor: theme.danger }]}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}

        {remainingSlots > 0 && (
          <TouchableOpacity
            accessibilityLabel="Seleccionar fotos del itinerario"
            disabled={disabled}
            onPress={handlePickPhotos}
            activeOpacity={0.8}
            style={[
              styles.addButton,
              { backgroundColor: theme.card, borderColor: theme.border },
              disabled && styles.disabled,
            ]}
          >
            <Ionicons name="images-outline" size={28} color={theme.primary} />
            <Text style={[styles.addText, { color: theme.primary }]}>Agregar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
