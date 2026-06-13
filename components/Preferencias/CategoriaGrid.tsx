// Grilla de categorías seleccionables en la pantalla de preferencias.
// Contiene la definición del array CATEGORIAS (íconos SVG + valor enum) y
// renderiza una CategoriaCard por cada opción, manejando el estado activo/inactivo.
// Se extrae de preferencias.tsx para dejar esa pantalla enfocada solo en el flujo de búsqueda.

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AventuraIcon from '@/assets/images/Icono-Aventura.svg';
import CultureIcon from '@/assets/images/Icono-Cultura.svg';
import GastronomiaIcon from '@/assets/images/Icono-Gastronomia.svg';
import NaturalezaIcon from '@/assets/images/Icono-Naturaleza.svg';

import { useTheme } from '@/hooks/use-color-scheme';
import { CategoriaItinerario } from '@/src/types/itinerario';
import { CategoriaCard } from './CategoriaCard';

// Mapeo de cada categoría a su ícono.
// Las SVG no necesitan color (ya tienen su paleta), las de Ionicons/MaterialCommunity sí.
const CATEGORIAS: { value: CategoriaItinerario; icon: (color: string) => React.ReactNode }[] = [
  { value: CategoriaItinerario.NATURALEZA, icon: () => <NaturalezaIcon width={28} height={28} /> },
  { value: CategoriaItinerario.GASTRONOMIA, icon: () => <GastronomiaIcon width={28} height={28} /> },
  { value: CategoriaItinerario.AVENTURA, icon: () => <AventuraIcon width={28} height={28} /> },
  { value: CategoriaItinerario.CULTURA, icon: () => <CultureIcon width={28} height={28} /> },
  {
    value: CategoriaItinerario.NOCHE,
    icon: (color) => <Ionicons name="moon-outline" size={28} color={color} />,
  },
  {
    value: CategoriaItinerario.COMPRA,
    icon: (color) => <MaterialCommunityIcons name="shopping-outline" size={28} color={color} />,
  },
];

interface CategoriaGridProps {
  seleccionadas: Set<CategoriaItinerario>;
  onToggle: (cat: CategoriaItinerario) => void;
}

export function CategoriaGrid({ seleccionadas, onToggle }: CategoriaGridProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.seccion}>
      <Text style={[styles.pregunta, { color: theme.text }]}>¿Qué te interesa?</Text>
      <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
        Selecciona todas las categorías que quieras
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
