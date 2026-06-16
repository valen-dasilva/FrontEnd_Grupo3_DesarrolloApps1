
import { useTheme } from "@/hooks/useColorScheme";
import {
    ItinerarioEnCursoDTO,
    ItemItinerarioUsuarioDTO,
    PROVINCIA_LABEL,
} from "@/types/itinerario";
import { formatFechaCorta } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  const handleEnCursoPress = () => {
    router.push({
      pathname: "/(tabs)/(favorite)/itinerarioInfoFav",
      params: {
        id: itinerarioActivo.idItinerarioUsuario.toString(),
        titulo: itinerarioActivo.titulo,
        provincia: itinerarioActivo.provincia,
        duracionDias: String(itinerarioActivo.duracionDias),
        fotoPortada: itinerarioActivo.fotoPortada ?? "",
        fechaInicio: itinerarioActivo.fechaInicio,
        fechaFin: itinerarioActivo.fechaFin,
        etiquetas: itinerarioActivo.etiquetas?.join(","),
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
            color={isDark ? theme.textSecondary : "#6B7280"}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatFechaCorta(itinerarioActivo.fechaInicio)} -{" "}
            {formatFechaCorta(itinerarioActivo.fechaFin)}
          </Text>
        </View>
        <Text
          style={[
            styles.dotSeparator,
            { color: isDark ? "#4B5563" : "#D1D5DB" },
          ]}
        >
          •
        </Text>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-outline"
            size={16}
            color={isDark ? theme.textSecondary : "#6B7280"}
          />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {PROVINCIA_LABEL[itinerarioActivo.provincia] ??
              itinerarioActivo.provincia}
            , Argentina
          </Text>
        </View>
      </View>

      {/* Sub-tarjeta de Próxima Actividad — calculada desde items o en estado de carga optimista */}
      {(proximaActividad || itinerarioActivo.isOptimistic) && (
        <View
          style={[
            styles.actividadCard,
            {
              backgroundColor: isDark ? "#191D26" : "#F5F7FF",
              borderColor: isDark ? "#2A303C" : "#EEF2FF",
            },
          ]}
        >
          <Text style={styles.actividadHeader}>Próxima actividad</Text>
          <View style={styles.actividadDetailsRow}>
            <Text
              style={[styles.actividadTitle, { color: theme.text }]}
              numberOfLines={1}
            >
              {itinerarioActivo.isOptimistic ? "..." : proximaActividad?.nombreActividad}
            </Text>
            {itinerarioActivo.isOptimistic ? (
              <Text style={styles.actividadTime}>...</Text>
            ) : (
              proximaActividad?.hora && (
                <Text style={styles.actividadTime}>
                  {proximaActividad.hora.substring(0, 5)}
                </Text>
              )
            )}
          </View>
        </View>
      )}
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
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
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
    fontFamily: "Inter-Bold",
    fontWeight: "bold",
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
    fontWeight: "500",
  },
  dotSeparator: {
    fontSize: 14,
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
    color: "#6366F1",
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
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
    fontFamily: "Inter-Bold",
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  actividadTime: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Inter-Bold",
    color: "#2563EB",
  },
});
