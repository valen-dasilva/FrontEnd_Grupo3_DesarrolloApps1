// Card de resultado de búsqueda en la pantalla de recomendaciones.
// Se extrajo de recomendaciones.tsx donde existía como componente interno.
// Muestra imagen de portada, badge de provincia, badge de fecha, título, descripción y etiquetas.
// Ningún card existente en el proyecto cubre esta combinación de elementos (ver plan de componetización).

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  CATEGORIA_LABEL,
  ItinerarioSistemaResumenDTO,
  PROVINCIA_LABEL,
} from '@/src/types/itinerario';
import { formatFechaCorta } from '../../src/utils/dateUtils';

interface CardResultadoProps {
  item: ItinerarioSistemaResumenDTO;
}

export function CardResultado({ item }: Readonly<CardResultadoProps>) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      activeOpacity={0.85}
      onPress={() => router.push('/explorarApp/itinerarioInfo')}
    >
      {/* Imagen de portada con badges superpuestos */}
      <View style={styles.imagenContenedor}>
        {item.fotoPortada ? (
          <Image source={{ uri: item.fotoPortada }} style={styles.imagen} resizeMode="cover" />
        ) : (
          // Fallback cuando no hay foto de portada
          <View style={[styles.imagen, styles.imagenFallback, { backgroundColor: isDark ? '#2A303D' : '#F3F4F6' }]}>
            <Ionicons name="image-outline" size={40} color={theme.textSecondary} />
          </View>
        )}

        {/* Badge amarillo con el nombre de la provincia, posición top-left */}
        <View style={styles.provinciaBadge}>
          <Text style={styles.provinciaBadgeTexto}>
            {PROVINCIA_LABEL[item.provincia] ?? item.provincia}
          </Text>
        </View>

        {/* Badge de fecha, solo aparece si el itinerario tiene rango de fechas definido */}
        {Boolean(item.fechaInicio && item.fechaFin) && (
          <View style={styles.fechaBadge}>
            <Ionicons name="calendar-outline" size={12} color="#FFFFFF" />
            <Text style={styles.fechaBadgeTexto}>
              {`${formatFechaCorta(item.fechaInicio)} - ${formatFechaCorta(item.fechaFin)}, ${item.fechaFin.split('-')[0]}`}
            </Text>
          </View>
        )}
      </View>

      {/* Cuerpo de la card: título, descripción y etiquetas */}
      <View style={styles.cuerpo}>
        <Text style={[styles.titulo, { color: theme.text }]}>{item.titulo}</Text>
        <Text style={[styles.descripcion, { color: theme.textSecondary }]} numberOfLines={3}>
          {item.descripcion}
        </Text>

        {/* Fila de etiquetas de categoría + etiqueta de duración */}
        <View style={styles.etiquetasRow}>
          {item.etiquetas?.map((e) => (
            <View key={e} style={[styles.etiqueta, { backgroundColor: isDark ? '#2A303D' : '#F3F4F6' }]}>
              <Text style={[styles.etiquetaTexto, { color: theme.textSecondary }]}>
                {CATEGORIA_LABEL[e] ?? e}
              </Text>
            </View>
          ))}
          {/* La etiqueta de días usa color primario para destacarse de las de categoría */}
          {item.duracionDias != null && (
            <View style={[styles.etiqueta, styles.etiquetaDias, { backgroundColor: isDark ? '#192C56' : '#EFF4FF' }]}>
              <Ionicons name="time-outline" size={12} color={theme.primary} />
              <Text style={[styles.etiquetaTexto, { color: theme.primary }]}>
                {`${item.duracionDias} días`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imagenContenedor: {
    height: 180,
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  imagenFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  provinciaBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  provinciaBadgeTexto: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  fechaBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  fechaBadgeTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cuerpo: {
    padding: 16,
    gap: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 20,
  },
  etiquetasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  etiqueta: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  etiquetaTexto: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  etiquetaDias: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
