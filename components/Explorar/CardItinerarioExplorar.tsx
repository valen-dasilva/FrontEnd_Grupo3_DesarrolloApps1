import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-color-scheme';
import { styles } from './CardItinerarioExplorar.styles';
import { useFavoriteToggle } from '@/src/hooks/useFavoriteToggle';
import { FavoriteButton } from '../common/FavoriteButton/FavoriteButton';
import { CategoryBadge } from '../common/CategoryBadge/CategoryBadge';

type Props = {
  idItinerario: number;
  title: string;
  description: string;
  category: string;
  image: string;
  rating?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  isFavorite?: boolean;
  idFavorito?: number;
};

export function ExploreItineraryCard({
  idItinerario,
  title,
  description,
  category,
  image,
  rating = "0",
  duration,
  startDate,
  endDate,
  isFavorite = false,
  idFavorito,
}: Props) {
  const router = useRouter();
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { isFav, favId, toggleFavorite } = useFavoriteToggle(
    idItinerario,
    isFavorite,
    idFavorito
  );

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/explorarApp/itinerarioInfo',
        params: {
          idItinerario: String(idItinerario),
          title,
          description,
          category,
          image,
          startDate: startDate ?? '',
          endDate: endDate ?? '',
          isFavorite: String(isFav),
          idFavorito: favId !== undefined ? String(favId) : '',
        }
      })}
    >

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover" />

        {/* Heart Button */}
        <FavoriteButton
          isFavorite={isFav}
          onPress={toggleFavorite}
          style={[
            styles.heartButton,
            {
              backgroundColor: isDark ? theme.background : '#FFFFFF',
              borderColor: theme.border,
              borderWidth: isDark ? 1 : 0
            }
          ]}
        />

        {/* Category */}
        <CategoryBadge
          category={category}
          style={styles.categoryBadge}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>

        <View style={styles.headerRow}>
          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          {/* Rating */}
          <View style={[styles.ratingBadge, { backgroundColor: isDark ? theme.surfaceHighlight : '#FEF9C3' }]}>
            <MaterialIcons name={icons.Star} size={fonts.size.sm} color={theme.warning} />
            <Text style={[styles.ratingText, { color: theme.text }]}>{rating}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>

        {/* Duration */}
        {duration && (
          <View style={styles.durationRow}>
            <MaterialIcons name={icons.Schedule} size={fonts.size.md} color={isDark ? theme.textSecondary : "#6B7280"} />
            <Text style={[styles.durationText, { color: theme.textSecondary }]}>{duration}</Text>
          </View>
        )}

      </View>
    </TouchableOpacity>
  );
}
