import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import { CategoriaItinerario } from '@/src/types/itinerario';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { styles } from './Filtro-Categorias-Carrusel.styles';

const CATEGORIES = [
  { id: 1, enumValue: CategoriaItinerario.NATURALEZA, name: "Naturaleza", image: <MaterialIcons name={icons.Landscape} size={fonts.size.xxl} color={colors.lightgreen} /> },
  { id: 2, enumValue: CategoriaItinerario.GASTRONOMIA, name: "Gastronomia", image: <MaterialIcons name={icons.Restaurant} size={fonts.size.xxl} color={colors.orange || colors.warning} /> },
  { id: 3, enumValue: CategoriaItinerario.CULTURA, name: "Cultura", image: <MaterialIcons name={icons.Museum} size={fonts.size.xxl} color={colors.primary} /> },
  { id: 4, enumValue: CategoriaItinerario.AVENTURA, name: "Aventura", image: <MaterialIcons name={icons.Hiking} size={fonts.size.xxl} color={colors.brownlight} /> },
];

interface CategoriesCarouselProps {
  selectedCategory?: CategoriaItinerario;
  onCategorySelect: (category: CategoriaItinerario | undefined) => void;
}

export function CategoriesCarousel({ selectedCategory, onCategorySelect }: CategoriesCarouselProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Categorias</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.enumValue;
          return (
            <TouchableOpacity 
              key={category.id} 
              onPress={() => {
                onCategorySelect(isSelected ? undefined : category.enumValue);
              }}
              style={[
                styles.card, 
                { 
                  backgroundColor: isSelected ? theme.primary + '1A' : theme.surface, 
                  borderColor: isSelected ? theme.primary : theme.border 
                }
              ]}
            >
              <View style={styles.iconWrapper}>{category.image}</View>
              <Text style={[styles.categoryLabel, { color: isSelected ? theme.primary : theme.text }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
