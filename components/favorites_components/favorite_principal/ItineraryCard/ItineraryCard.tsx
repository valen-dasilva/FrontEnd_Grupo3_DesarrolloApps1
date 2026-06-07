import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useRef } from 'react';
import { Animated, ImageBackground, Pressable, Text, View } from 'react-native';
import { colors } from '../../../../constants/colors';
import { icons } from '../../../../constants/icons';
import { FavoriteButton } from '../../../common/FavoriteButton/FavoriteButton';
import { OfflineBadge } from '../../../common/OfflineBadge/OfflineBadge';
import { styles } from './ItineraryCard.styles';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface ItineraryCardProps {
  /** The main title of the itinerary */
  title: string;
  /** The location text */
  location: string;
  /** Duration text (e.g., '3 Dias') */
  duration: string;
  /** URL for the background image */
  imageUrl: string;
  /** Determines if the 'Disponible Offline' badge is shown */
  isOfflineAvailable?: boolean;
  /** Indicates if the user has marked this as favorite */
  isFavorite?: boolean;
  /** Indicates if the itinerary is pinned/highlighted */
  isPinned?: boolean;
  /** Callback triggered when the 'Ver Detalle' button is pressed */
  onPressDetail?: () => void;
  /** Callback triggered when the favorite heart icon is pressed */
  onFavoriteToggle?: () => void;
  /** Callback triggered when the pin icon is pressed */
  onPinPress?: () => void;
  /** Callback triggered when the download icon is pressed */
  onDownloadPress?: () => void;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  title,
  location,
  duration,
  imageUrl,
  isOfflineAvailable = false,
  isFavorite = true,
  isPinned = false,
  onPressDetail,
  onFavoriteToggle,
  onPinPress,
  onDownloadPress,
}) => {
  // Animation Scales
  const detailScale = useRef(new Animated.Value(1)).current;
  const downloadScale = useRef(new Animated.Value(1)).current;
  const pinScale = useRef(new Animated.Value(1)).current;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  // Animation Helper triggers
  const handlePressIn = (scaleRef: Animated.Value, targetScale: number = 0.92) => {
    Animated.spring(scaleRef, {
      toValue: targetScale,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleRef: Animated.Value) => {
    Animated.spring(scaleRef, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.topActionsRow}>
          {isOfflineAvailable ? (
            <OfflineBadge />
          ) : (
            <View /> // Empty view to maintain space-between layout for the heart icon
          )}

          <FavoriteButton
            isFavorite={isFavorite}
            onPress={onFavoriteToggle}
          />
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
          <MaterialIcons
            name={icons.Location}
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>{location}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.footerRow}>
          <Pressable
            onPress={onPressDetail}
            onPressIn={() => handlePressIn(detailScale, 0.96)}
            onPressOut={() => handlePressOut(detailScale)}
            style={[styles.detailButton, { backgroundColor: theme.primary }]}
            accessibilityRole="button"
          >
            <Animated.View style={{ transform: [{ scale: detailScale }] }}>
              <Text style={[styles.detailButtonText, { color: theme.textInverse }]}>Ver Detalle</Text>
            </Animated.View>
          </Pressable>

          <View style={styles.rightActionsGroup}>
            <Pressable
              onPress={onDownloadPress}
              onPressIn={() => handlePressIn(downloadScale, 0.90)}
              onPressOut={() => handlePressOut(downloadScale)}
              style={[
                styles.downloadButton,
                isOfflineAvailable && { backgroundColor: theme.surfaceHighlight, borderRadius: 20 }
              ]}
              accessibilityRole="button"
              accessibilityLabel={isOfflineAvailable ? "Eliminar descarga de itinerario" : "Descargar itinerario"}
            >
              <Animated.View style={{ transform: [{ scale: downloadScale }] }}>
                <MaterialIcons
                  name={icons.Download}
                  size={22}
                  color={isOfflineAvailable ? theme.primary : theme.textSecondary}
                />
              </Animated.View>
            </Pressable>

            <Pressable
              onPress={onPinPress}
              onPressIn={() => handlePressIn(pinScale, 0.90)}
              onPressOut={() => handlePressOut(pinScale)}
              style={[styles.pinButton, { backgroundColor: theme.background }]}
              accessibilityRole="button"
              accessibilityLabel={isPinned ? "Unpin itinerary" : "Pin itinerary"}
            >
              <Animated.View style={{ transform: [{ scale: pinScale }] }}>
                <MaterialIcons
                  name={icons.Pin}
                  size={22}
                  color={isPinned ? theme.warning : theme.textSecondary}
                />
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
