import React, { useState, type ReactNode } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { styles } from './Card-Itinerario-Explorar.styles';

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
}: Props) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

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
          isFavorite: String(isFavorite)
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
        <TouchableOpacity 
          style={[
            styles.heartButton, 
            { 
              backgroundColor: isDark ? '#11131A' : '#FFFFFF', 
              borderColor: theme.border, 
              borderWidth: isDark ? 1 : 0 
            }
          ]} 
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <MaterialIcons
            name={isFavorite ? icons.FavoriteFilled : icons.FavoriteOutline}
            size={fonts.size.xl}
            color={isFavorite ? theme.danger : theme.textSecondary}
          />
        </TouchableOpacity>

        {/* Category */}
        <View style={[
          styles.categoryBadge, 
          { 
            backgroundColor: isDark ? '#11131A' : '#FFFFFF', 
            borderColor: theme.border, 
            borderWidth: isDark ? 1 : 0 
          }
        ]}>
          <MaterialIcons name={icons.Museum} size={fonts.size.lg} color={theme.primary} />
          <Text style={[styles.categoryText, { color: theme.text }]}>{category}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>

        <View style={styles.headerRow}>
          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          {/* Rating */}
          <View style={[styles.ratingBadge, { backgroundColor: isDark ? '#2A303D' : '#FEF9C3' }]}>
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
