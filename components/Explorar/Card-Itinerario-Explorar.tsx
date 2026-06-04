import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './Card-Itinerario-Explorar.styles';

type Props = {
  title: string;
  description: string;
  category: string;
  image: string;
  rating?: string;
  duration?: string;
};

export function ExploreItineraryCard({
  title,
  description,
  category,
  image,
  rating = "0",
  duration,
}: Props) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push('/explorarApp/itinerarioInfo')}
    >

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover" />

        {/* Heart Icon */}
        <TouchableOpacity style={styles.heartButton} onPress={() => setIsFavorite(!isFavorite)}>
          <MaterialIcons
            name={isFavorite ? icons.FavoriteFilled : icons.FavoriteOutline}
            size={fonts.size.xl}
            color={isFavorite ? colors.danger : colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Category */}
        <View style={styles.categoryBadge}>
          <MaterialIcons name={icons.Museum} size={fonts.size.lg} color={colors.primary} />
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>

        <View style={styles.headerRow}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Rating */}
          <View style={styles.ratingBadge}>
            <MaterialIcons name={icons.Star} size={fonts.size.sm} color={colors.warning} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Duration */}
        {duration && (
          <View style={styles.durationRow}>
            <MaterialIcons name={icons.Schedule} size={fonts.size.md} color={colors.textSecondary} />
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}

      </View>
    </TouchableOpacity>
  );
}

