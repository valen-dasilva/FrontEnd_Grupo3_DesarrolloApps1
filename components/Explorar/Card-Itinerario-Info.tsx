import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import TeatroColonIcon from '../../assets/images/Imagen-Teatro-Colon.svg';
import { styles } from './Card-Itinerario-Info.styles';

type Props = {
  title?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  image?: string;
  isFavorite?: boolean;
  onBackPress?: () => void;
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
  title = "Teatro Colón",
  category = "Cultura",
  startDate,
  endDate,
  description = "Visita guiada por el emblemático Teatro Colón, descubriendo su historia, arquitectura y secretos detrás del escenario.",
  image,
  isFavorite = false,
  onBackPress
}: Props) {
  const [fav, setFav] = useState(isFavorite);

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
            <TouchableOpacity style={styles.circularContainer} onPress={onBackPress}>
              <MaterialIcons name={icons.ArrowBack} size={fonts.size.xl} color={colors.black} />
            </TouchableOpacity>
            {/** Heart button */}
            <TouchableOpacity style={styles.circularContainer} onPress={() => setFav(!fav)}>
              <MaterialIcons
                name={fav ? icons.FavoriteFilled : icons.FavoriteOutline}
                size={fonts.size.xl}
                color={fav ? colors.danger : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/** Bottom info container */}
          <View style={styles.bottomInfoContainer}>
            {/** Category badge */}
            <View style={styles.categoryBadge}>
              <MaterialIcons name={icons.Museum} size={fonts.size.lg} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.datesRow}>
              <MaterialIcons name={icons.CalendarToday} size={fonts.size.md} color={colors.textInverse} />
              <Text style={styles.datesText}>{dateRange}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  );
}

