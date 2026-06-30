
import { useTheme } from "@/hooks/useColorScheme";
import {
    ItinerarioEnCursoDTO, 
    ItemItinerarioUsuarioDTO,
    PROVINCIA_LABEL,
    Provincia,
} from "@/types/itinerario";
import { formatFechaCorta } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWeather } from "@/hooks/useWeather";
import { PROVINCIA_COORDS } from "@/utils/provinciaCoords";
import { fonts } from "@/constants/fonts";
import { useItineraryCalendar } from '@/hooks/useItineraryCalendar';
import Toast from 'react-native-toast-message';

// Busca la próxima actividad para mostrar en la card:
// - Si el viaje aún no empezó: primera actividad del día 1
// - Si está en curso: siguiente actividad del día actual (o la última si ya pasaron todas)
// - Si ya terminó: null
function getProximaActividad(
  fechaInicio: string,
  items: ItemItinerarioUsuarioDTO[],
): ItemItinerarioUsuarioDTO | null {
  if (!items?.length) return null;

  const hoy = new Date();
  const inicio = new Date(fechaInicio + "T00:00:00");
  const diaActual =
    Math.floor((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // El viaje todavía no empezó → mostrar la primera actividad del día 1
  if (diaActual < 1) {
    const itemsDia1 = items
      .filter((item) => item.dia === 1)
      .sort((a, b) => (a.hora ?? "").localeCompare(b.hora ?? ""));
    return itemsDia1[0] ?? items[0];
  }

  const itemsHoy = items.filter((item) => item.dia === diaActual);
  if (!itemsHoy.length) return null;

  const ahoraMinutos = hoy.getHours() * 60 + hoy.getMinutes();

  const proxima = itemsHoy
    .filter((item) => {
      if (!item.hora) return true;
      const [h, m] = item.hora.split(":").map(Number);
      return h * 60 + m >= ahoraMinutos;
    })
    .sort((a, b) => (a.hora ?? "").localeCompare(b.hora ?? ""))[0];

  // Si todas las actividades del día ya pasaron, mostramos la última
  return proxima ?? itemsHoy[itemsHoy.length - 1];
}

export default function ActiveItineraryCard({
  itinerarioActivo,
}: {
  itinerarioActivo: ItinerarioEnCursoDTO; 
}) {
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === "dark";

  const imagenPortada = { uri: itinerarioActivo.fotoPortada };
  const proximaActividad = getProximaActividad(
    itinerarioActivo.fechaInicio,
    itinerarioActivo.items,
  );

  const weatherCoords = PROVINCIA_COORDS[itinerarioActivo.provincia as Provincia] ?? null;
  const { data: weatherData } = useWeather({
    coords: weatherCoords ?? { lat: 0, lng: 0 },
    fechaInicio: itinerarioActivo.fechaInicio,
    fechaFin: itinerarioActivo.fechaFin,
  });

  // Determina qué fecha mostrar: hoy si el viaje está en curso, inicio si aún no empezó
  const todayStr = new Date().toISOString().split('T')[0];
  const targetDate = todayStr >= itinerarioActivo.fechaInicio ? todayStr : itinerarioActivo.fechaInicio;
  const todayWeather = weatherCoords && weatherData?.available
    ? weatherData.days.find((d) => d.date === targetDate) ?? null
    : null;

  const { addToCalendar, isAdding } = useItineraryCalendar();

  const handleAddToCalendar = async () => {
    try {
      const count = await addToCalendar(itinerarioActivo);
      Toast.show({
        type: 'success',
        text1: 'Calendario actualizado',
        text2: `Se agregaron ${count} actividades.`,
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'No se pudo agregar',
        text2: err.message ?? 'Verificá los permisos del calendario.',
      });
    }
  };

  // El "activo" es un itinerario propio del usuario (una copia), no un
  // template del sistema. Por eso navegamos a su pantalla de detalle
  // (itinerarioInfoFav, que carga GET /itinerarios/{id}), no a la del
  // catálogo del sistema — que devolvía 404 al usar el id de usuario.
  const handleEnCursoPress = () => {
    router.push({
      pathname: "/(tabs)/(favorite)/itinerarioInfoFav",
      params: {
        id: itinerarioActivo.idItinerarioUsuario.toString(),
        titulo: itinerarioActivo.titulo,
        provincia: itinerarioActivo.provincia,
        duracionDias: itinerarioActivo.duracionDias?.toString() ?? "",
        fotoPortada: itinerarioActivo.fotoPortada ?? "",
        fechaInicio: itinerarioActivo.fechaInicio,
        fechaFin: itinerarioActivo.fechaFin,
        etiquetas: itinerarioActivo.etiquetas?.join(",") ?? "",
        description: itinerarioActivo.descripcion ?? "",
      },
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.enCursoCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderWidth: isDark ? 1 : 0,
        },
      ]}
      activeOpacity={0.9}
      onPress={handleEnCursoPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imagenPortada}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.75)"]}
          style={styles.gradientOverlay}
        />

        {/* Badge "En curso" */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>En curso</Text>
        </View>

        {/* Título y botón de acción */}
        <View style={styles.titleOverlayRow}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {itinerarioActivo.titulo}
          </Text>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleEnCursoPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Metadatos (Fechas y Ubicación) */}
      <View style={styles.metadataRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatFechaCorta(itinerarioActivo.fechaInicio)} -{" "}
            {formatFechaCorta(itinerarioActivo.fechaFin)}
          </Text>
        </View>
        <Text style={[styles.dotSeparator, { color: theme.border }]}>•</Text>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.textSecondary}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {PROVINCIA_LABEL[itinerarioActivo.provincia] ??
              itinerarioActivo.provincia}
            , Argentina
          </Text>
        </View>
      </View>

      {/* Clima del día */}
      {todayWeather && (
        <View style={[styles.weatherRow, { borderTopColor: theme.border }]}>
          <Text style={styles.weatherEmoji}>{todayWeather.emoji}</Text>
          <Text style={[styles.weatherLabel, { color: theme.textSecondary }]}>
            {todayStr >= itinerarioActivo.fechaInicio ? 'Hoy' : 'Día 1'} · {todayWeather.maxTemp}° / {todayWeather.minTemp}° · {todayWeather.label}
          </Text>
        </View>
      )}

      {/* Sub-tarjeta de Próxima Actividad — calculada desde items o en estado de carga optimista */}
      {(proximaActividad || itinerarioActivo.isOptimistic) && (
        <View
          style={[
            styles.actividadCard,
            {
              backgroundColor: theme.surfaceNeutral,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.actividadHeader, { color: theme.primary }]}>Próxima actividad</Text>
          <View style={styles.actividadDetailsRow}>
            <Text
              style={[styles.actividadTitle, { color: theme.text }]}
              numberOfLines={1}
            >
              {itinerarioActivo.isOptimistic ? "..." : proximaActividad?.nombreActividad}
            </Text>
            {itinerarioActivo.isOptimistic ? (
              <Text style={[styles.actividadTime, { color: theme.primary }]}>...</Text>
            ) : (
              proximaActividad?.hora && (
                <Text style={[styles.actividadTime, { color: theme.primary }]}>
                  {proximaActividad.hora.substring(0, 5)}
                </Text>
              )
            )}
          </View>
        </View>
      )}
      <TouchableOpacity
        style={[styles.calendarButton, { borderTopColor: theme.border }]}
        onPress={handleAddToCalendar}
        activeOpacity={0.7}
        disabled={isAdding}
      >
        <Ionicons name="calendar-outline" size={16} color={theme.primary} />
        <Text style={[styles.calendarButtonText, { color: theme.primary }]}>
          {isAdding ? 'Agregando...' : 'Agregar al calendario del dispositivo'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  enCursoCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  imageContainer: {
    height: 220,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: fonts.family.headingBold,
  },
  titleOverlayRow: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: fonts.family.headingBold,
    flex: 1,
    marginRight: 10,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontFamily: fonts.family.bodySemiBold,
  },
  dotSeparator: {
    fontSize: 14,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
  },
  weatherEmoji: {
    fontSize: 16,
  },
  weatherLabel: {
    fontSize: 13,
    fontFamily: fonts.family.bodySemiBold,
  },
  actividadCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  actividadHeader: {
    fontSize: 11,
    textTransform: "uppercase",
    fontFamily: fonts.family.headingBold,
    letterSpacing: 0.5,
  },
  actividadDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  actividadTitle: {
    fontSize: 15,
    fontFamily: fonts.family.headingBold,
    flex: 1,
    marginRight: 8,
  },
  actividadTime: {
    fontSize: 14,
    fontFamily: fonts.family.headingBold,
  },
  calendarButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingVertical: 14,
  borderTopWidth: 1,
  },
  calendarButtonText: {
    fontSize: 14,
    fontFamily: fonts.family.bodySemiBold,
  },
});
