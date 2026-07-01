import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useRef, useState } from 'react';
import { Animated, ImageBackground, Pressable, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { icons } from '@/constants/icons';
import { paddings } from '@/constants/paddings';
import { FavoriteButton } from '@/components/common/FavoriteButton/FavoriteButton';
import { useTheme } from '@/hooks/useColorScheme';

const defaultImage = require('@/assets/images/minimun_logo.png');

interface Props {
  /** Título del template del sistema guardado */
  title: string;
  /** Provincia / ubicación */
  location: string;
  /** Texto de duración (ej: "3 Días") */
  duration: string;
  /** URL de la foto de portada */
  imageUrl: string;
  /** true mientras se está creando la copia (deshabilita el botón) */
  isCreando?: boolean;
  /** Crear una copia editable de este template */
  onCrearCopia?: () => void;
  /** Quitar de favoritos (el corazón) */
  onQuitar?: () => void;
  /** Ver el detalle del template (al tocar la card) */
  onVerDetalle?: () => void;
}

/**
 * Card de un FAVORITO (bookmark): un template del sistema que el usuario
 * guardó. A diferencia de ItineraryCard, no se edita ni se fija — su
 * acción principal es "Crear copia" (genera un itinerario propio editable).
 */
export const BookmarkCard: React.FC<Props> = ({
  title,
  location,
  duration,
  imageUrl,
  isCreando = false,
  onCrearCopia,
  onQuitar,
  onVerDetalle,
}) => {
  const { theme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(true);
  const crearScale = useRef(new Animated.Value(1)).current;

  const handleQuitar = () => {
    setIsFavorite(false);
    onQuitar?.();
  };

  const handlePressIn = () => {
    Animated.spring(crearScale, { toValue: 0.96, speed: 40, bounciness: 0, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(crearScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={onVerDetalle ? 0.85 : 1}
      onPress={onVerDetalle}
      style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      <ImageBackground
        source={imageUrl ? { uri: imageUrl } : defaultImage}
        style={[styles.imageBackground, !imageUrl && { backgroundColor: theme.surfaceNeutral }]}
        imageStyle={[styles.imageStyle, !imageUrl && { resizeMode: 'contain', transform: [{ scale: 0.6 }] }]}
      >
        <View style={styles.topActionsRow}>
          <View />
          <FavoriteButton isFavorite={isFavorite} onPress={handleQuitar} />
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
          <View style={[styles.durationBadge, { backgroundColor: theme.surfaceNeutral }]}>
            <Text style={[styles.durationText, { color: theme.textSecondary }]}>{duration}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MaterialIcons name={icons.Location} size={16} color={theme.textSecondary} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>{location}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Pressable
          onPress={onCrearCopia}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isCreando}
          style={[styles.crearButton, { backgroundColor: theme.primary, opacity: isCreando ? 0.7 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Crear una copia editable de este itinerario"
        >
          <Animated.View style={[styles.crearButtonInner, { transform: [{ scale: crearScale }] }]}>
            <MaterialIcons name="content-copy" size={18} color={theme.textInverse} />
            <Text style={[styles.crearButtonText, { color: theme.textInverse }]}>
              {isCreando ? 'Creando...' : 'Crear copia'}
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: paddings.radius.xxl,
    borderWidth: 1,
    marginBottom: paddings.spacing.xl,
    overflow: 'hidden',
  },
  imageBackground: {
    height: 140,
    justifyContent: 'flex-start',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: paddings.spacing.md,
  },
  contentContainer: {
    padding: paddings.spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: paddings.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  durationBadge: {
    borderRadius: paddings.radius.lg,
    paddingHorizontal: paddings.spacing.md,
    paddingVertical: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: paddings.spacing.sm,
  },
  locationText: {
    fontSize: 13,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: paddings.spacing.lg,
  },
  crearButton: {
    borderRadius: paddings.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crearButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  crearButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
