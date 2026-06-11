import ActiveItineraryCard from "@/components/common/ActiveItineraryCard/ActiveItineraryCard";
import { Header } from "@/components/common/Header/Header";
import { colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/src/context/AuthContext";
import { getItinerarioEnCurso } from "@/src/services/itinerarioService";
import { ItinerarioEnCursoDTO } from "@/src/types/itinerario";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? colors.dark : colors.light;
  const { user } = useAuth();

  const [itinerarioActivo, setItinerarioActivo] =
    useState<ItinerarioEnCursoDTO | null>(null);
  const [loadingItinerario, setLoadingItinerario] = useState(true);

  // Al montar, intenta cargar el itinerario en curso del usuario
  useEffect(() => {
    if (!user) {
      setLoadingItinerario(false);
      return;
    }
    setLoadingItinerario(true);
    getItinerarioEnCurso(user.idUsuario).then((data) => {
      setItinerarioActivo(data);
      setLoadingItinerario(false);
    });
  }, [user]);

  const handlePreferenciasPress = () => {
    router.push("/inicioApp/preferencias");
  };

  // Fuente de imagen: URL de Supabase Storage si existe, imagen local como fallback
  const imagenPortada = itinerarioActivo?.fotoPortada;

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      <Header title="Inicio" />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mensaje de Bienvenida */}
        <View style={styles.greetingContainer}>
          <Text style={[styles.greetingTitle, { color: theme.text }]}>
            ¡Hola, {user?.nombre}!
          </Text>
          <Text
            style={[styles.greetingSubtitle, { color: theme.textSecondary }]}
          >
            ¿A dónde te llevará tu próxima aventura?
          </Text>
        </View>

        {/* Sección Viaje en Curso */}
        {loadingItinerario ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Cargando tu viaje...
            </Text>
          </View>
        ) : itinerarioActivo ? (
          /* Card con datos reales del itinerario activo */
          <ActiveItineraryCard itinerarioActivo={itinerarioActivo} />
        ) : (
          /* Estado vacío: no hay viaje en curso */
          <View
            style={[
              styles.sinViajeCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: isDark ? 1 : 0,
              },
            ]}
          >
            <Ionicons
              name="map-outline"
              size={36}
              color={theme.textSecondary}
            />
            <Text style={[styles.sinViajeTitle, { color: theme.text }]}>
              No tenés viajes en curso
            </Text>
            <Text
              style={[styles.sinViajeSubtitle, { color: theme.textSecondary }]}
            >
              Buscá un itinerario y armá tu próxima aventura.
            </Text>
            <TouchableOpacity
              style={[styles.sinViajeCTA, { backgroundColor: theme.primary }]}
              onPress={handlePreferenciasPress}
              activeOpacity={0.85}
            >
              <Text style={styles.sinViajeCTAText}>Explorar itinerarios</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sección Buscar por Preferencias */}
        <TouchableOpacity
          style={styles.yellowCard}
          activeOpacity={0.95}
          onPress={handlePreferenciasPress}
        >
          <View style={styles.circle}>
            <MaterialCommunityIcons
              name="map-marker-plus"
              size={28}
              color="#FFB020"
            />
          </View>
          <Text style={styles.yellowCardTitle}>Buscar por preferencias</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  greetingContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  greetingTitle: {
    fontSize: 32,
    fontFamily: "Inter-Bold",
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  greetingSubtitle: {
    fontSize: 16,
    marginTop: 6,
    lineHeight: 22,
  },
  loadingCard: {
    height: 120,
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
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
  sinViajeCard: {
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sinViajeTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    marginTop: 4,
  },
  sinViajeSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  sinViajeCTA: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  sinViajeCTAText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
  yellowCard: {
    backgroundColor: "#FFC837",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFC837",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 24,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  yellowCardTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#111827",
    fontWeight: "bold",
    marginTop: 14,
  },
});
