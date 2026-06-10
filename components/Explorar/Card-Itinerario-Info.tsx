import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TeatroColonIcon from '../../assets/images/Imagen-Teatro-Colon.svg';
import { styles } from './Card-Itinerario-Info.styles';
import { useTheme } from '@/hooks/use-color-scheme';

type Props = {
  title?: string;
  category?: string;
  dateRange?: string;
  description?: string;
  onBackPress?: () => void;
};

const categoryIconMap: Record<string, string> = {
  'Cultura': icons.Museum,
  'Naturaleza': icons.Landscape,
  'Gastronomía': icons.Restaurant,
  'Gastronomia': icons.Restaurant,
  'Aventura': icons.Hiking,
  'Noche': icons.Nightlife,
  'Compras': icons.ShoppingBag,
  'Compra': icons.ShoppingBag,
};

export function ItineraryInfoCard({
  title = "Teatro Colón",
  category = "Cultura",
  dateRange = "15 Oct - 22 Oct, 2024",
  description = "Visita guiada por el emblemático Teatro Colón, descubriendo su historia, arquitectura y secretos detrás del escenario.",
  onBackPress
}: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  const categoryIcon = categoryIconMap[category || ''] || icons.Museum;

  return (
    <View>
      {/** Image container */}
      <View style={styles.imageContainer}>
        {/** Overlay image with text */}
        <TeatroColonIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFillObject} />

        {/** Dark transparent overlay */}
        <View style={styles.heroOverlay}>
          {/* Back and heart icons */}
          <View style={styles.heroTopBar}>
            {/** Back button */}
            <TouchableOpacity 
              style={[
                styles.circularContainer, 
                { 
                  backgroundColor: isDark ? '#11131A' : '#FFFFFF',
                  borderColor: theme.border,
                  borderWidth: isDark ? 1 : 0
                }
              ]} 
              onPress={onBackPress}
            >
              <MaterialIcons name={icons.ArrowBack} size={fonts.size.xl} color={theme.text} />
            </TouchableOpacity>
            {/** Heart button */}
            <TouchableOpacity 
              style={[
                styles.circularContainer, 
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
          </View>

          {/** Bottom info container */}
          <View style={styles.bottomInfoContainer}>
            {/** Category badge */}
            <View style={[
              styles.categoryBadge, 
              { 
                backgroundColor: isDark ? '#11131A' : '#FFFFFF',
                borderColor: theme.border,
                borderWidth: isDark ? 1 : 0
              }
            ]}>
              <MaterialIcons name={categoryIcon as any} size={fonts.size.lg} color={theme.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.categoryText, { color: theme.text }]}>{category}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.datesRow}>
              <MaterialIcons name={icons.CalendarToday} size={fonts.size.md} color={theme.textInverse} />
              <Text style={styles.datesText}>{dateRange}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
}

