// Grilla de categorías seleccionables en la pantalla de preferencias.
// Contiene la definición del array CATEGORIAS (íconos SVG + valor enum) y
// renderiza una CategoriaCard por cada opción, manejando el estado activo/inactivo.
// Se extrae de preferencias.tsx para dejar esa pantalla enfocada solo en el flujo de búsqueda.

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useColorScheme';
import { CategoriaItinerario } from '@/types/itinerario';
import { CategoriaCard } from './CategoriaCard';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { colors } from '@/constants/colors';

// Mapeo de cada categoría a su ícono.
const CATEGORIAS: { value: CategoriaItinerario; icon: (color: string) => React.ReactNode }[] = [
  { value: CategoriaItinerario.NATURALEZA, icon: () => <MaterialIcons name={icons.Landscape} size={fonts.size.xxxl} color={colors.lightgreen} /> },
  { value: CategoriaItinerario.GASTRONOMIA, icon: () => <MaterialIcons name={icons.Restaurant} size={fonts.size.xxxl} color={colors.orange || colors.warning} /> },
  { value: CategoriaItinerario.AVENTURA, icon: () => <MaterialIcons name={icons.Hiking} size={fonts.size.xxxl} color={colors.brownlight} /> },
  { value: CategoriaItinerario.CULTURA, icon: () => <MaterialIcons name={icons.Museum} size={fonts.size.xxxl} color={colors.primary} /> },
  { value: CategoriaItinerario.NOCHE, icon: () => <MaterialIcons name={icons.Nightlife} size={fonts.size.xxxl} color={colors.gray} />, },
  { value: CategoriaItinerario.COMPRA, icon: () => <MaterialIcons name={icons.ShoppingBag} size={fonts.size.xxxl} color={colors.orange} />, },
];

interface CategoriaGridProps {
  seleccionadas: Set<CategoriaItinerario>;
  onToggle: (cat: CategoriaItinerario) => void;
  titulo?: string;
  subtitulo?: string;
}

export function CategoriaGrid({
  seleccionadas,
  onToggle,
  titulo = '¿Qué te interesa?',
  subtitulo = 'Selecciona todas las categorías que quieras',
}: CategoriaGridProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.seccion}>
      <Text style={[styles.pregunta, { color: theme.text }]}>{titulo}</Text>
      <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
        {subtitulo}
      </Text>
      <View style={styles.grid}>
        {CATEGORIAS.map(({ value, icon }) => (
          <CategoriaCard
            key={value}
            value={value}
            icon={icon}
            activa={seleccionadas.has(value)}
            onPress={() => onToggle(value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seccion: {
    marginTop: 28,
  },
  pregunta: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 13,
    marginTop: -6,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
