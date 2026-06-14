import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { styles } from './CardItinerarioInfo.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { formatDateRange } from '@/utils/dateUtils';
import { FavoriteButton } from '../common/FavoriteButton/FavoriteButton';
import { CategoryBadge } from '../common/CategoryBadge/CategoryBadge';

type Props = {
  idItinerario?: number;
  title?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  description?: string;
  image?: string;
  isFavorite?: boolean;
  idFavorito?: number;
  onBackPress?: () => void;
  onEditPress?: () => void;
  onDownloadPress?: () => void;
};

export function ItineraryInfoCard({
  idItinerario,
  title = "Teatro Colón",
  category = "Cultura",
  startDate,
  endDate,
  dateRange,
  description = "Visita guiada por el emblemático Teatro Colón, descubriendo su historia, arquitectura y secretos detrás del escenario.",
  image,
  isFavorite = false,
  idFavorito,
  onBackPress,
  onEditPress,
  onDownloadPress
}: Props) {
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { isFav, toggleFavorite: handleFavoriteToggle } = useFavoriteToggle(
    idItinerario,
    isFavorite,
    idFavorito
  );

  const resolvedDateRange = dateRange || (startDate && endDate 
    ? formatDateRange(startDate, endDate) 
    : "15 Oct - 22 Oct, 2024");

  return (
    <View>
      {/** Image container */}
      <View style={styles.imageContainer}>
        {/** Overlay image with text */}
        {image ? (
          <Image source={{ uri: image }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.card }]} />
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
                  backgroundColor: isDark ? theme.background : '#FFFFFF',
                  borderColor: theme.border,
                  borderWidth: isDark ? 1 : 0
                }
              ]} 
              onPress={onBackPress}
            >
              <MaterialIcons name={icons.ArrowBack} size={fonts.size.xl} color={theme.text} />
            </TouchableOpacity>
            {/** Heart button */}
            <FavoriteButton
              isFavorite={isFav}
              onPress={handleFavoriteToggle}
              style={[
                styles.circularContainer,
                {
                  backgroundColor: isDark ? theme.background : '#FFFFFF',
                  borderColor: theme.border,
                  borderWidth: isDark ? 1 : 0
                }
              ]}
            />
          </View>

          {/** Bottom info container */}
          <View style={styles.bottomInfoContainer}>
            {/** Category badge */}
            <CategoryBadge
              category={category}
              style={styles.categoryBadge}
            />
            <Text style={styles.title}>{title}</Text>
            <View style={[styles.datesRow, { justifyContent: 'space-between', width: '100%', flexDirection: 'row' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name={icons.CalendarToday} size={fonts.size.md} color={theme.textInverse} />
                <Text style={styles.datesText}>{resolvedDateRange}</Text>
              </View>
              {(onEditPress || onDownloadPress) && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                  {onDownloadPress && (
                    <TouchableOpacity onPress={onDownloadPress}>
                      <MaterialIcons name={icons.Download} size={23} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                  {onEditPress && (
                    <TouchableOpacity onPress={onEditPress}>
                      <MaterialIcons name={icons.Edit} size={23} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
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
