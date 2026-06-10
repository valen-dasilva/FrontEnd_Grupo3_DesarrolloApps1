import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import TeatroColonIcon from '../../assets/images/Imagen-Teatro-Colon.svg';
import { styles } from './Card-Itinerario-Info.styles';
import { useTheme } from '@/hooks/use-color-scheme';
import { postItinerario, deleteItinerario } from '@/src/services/favoritosService';

type Props = {
  idItinerario?: number;
  title?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  image?: string;
  isFavorite?: boolean;
  idFavorito?: number;
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

function formatDateRange(startStr?: string, endStr?: string): string {
  if (!startStr || !endStr) return "Sin fechas";
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Sin fechas";

    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    const startDay = start.getDate();
    const startMonth = months[start.getMonth()];
    
    const endDay = end.getDate();
    const endMonth = months[end.getMonth()];
    const endYear = end.getFullYear();
    
    if (start.getMonth() === end.getMonth()) {
      return `${startDay} - ${endDay} ${startMonth}, ${endYear}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${endYear}`;
    }
  } catch {
    return "Sin fechas";
  }
}

export function ItineraryInfoCard({
  idItinerario,
  title = "Teatro Colón",
  category = "Cultura",
  startDate,
  endDate,
  description = "Visita guiada por el emblemático Teatro Colón, descubriendo su historia, arquitectura y secretos detrás del escenario.",
  image,
  isFavorite = false,
  idFavorito,
  onBackPress
}: Props) {
  const [fav, setFav] = useState(isFavorite);
  const [favId, setFavId] = useState<number | undefined>(idFavorito);
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setFav(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    setFavId(idFavorito);
  }, [idFavorito]);

  const handleFavoriteToggle = async () => {
    if (idItinerario === undefined) {
      console.warn("Cannot toggle favorite: idItinerario is undefined");
      return;
    }
    const nextFav = !fav;
    setFav(nextFav);
    try {
      if (nextFav) {
        const res = await postItinerario(idItinerario);
        setFavId(res.id);
      } else {
        if (favId !== undefined) {
          await deleteItinerario(favId);
          setFavId(undefined);
        } else {
          console.warn("Cannot delete favorite: favId is undefined");
        }
      }
    } catch (error) {
      setFav(!nextFav);
      console.error("Error toggling favorite:", error);
    }
  };

  const categoryIcon = categoryIconMap[category || ''] || icons.Museum;

  const dateRange = startDate && endDate 
    ? formatDateRange(startDate, endDate) 
    : "15 Oct - 22 Oct, 2024";

  return (
    <View>
      {/** Image container */}
      <View style={styles.imageContainer}>
        {/** Overlay image with text */}
        {image ? (
          <Image source={{ uri: image }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <TeatroColonIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFillObject} />
        )}

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
              onPress={handleFavoriteToggle}
            >
              <MaterialIcons
                name={fav ? icons.FavoriteFilled : icons.FavoriteOutline}
                size={fonts.size.xl}
                color={fav ? theme.danger : theme.textSecondary}
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

