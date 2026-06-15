import { ItinerarioEnCursoDTO } from "@/types/itinerario";
import ActiveItineraryCard from "@/components/common/ActiveItineraryCard/ActiveItineraryCard";
import { Header } from "@/components/common/Header/Header";

import { useTheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/context/AuthContext";
import { getItinerarioEnCurso, buscarPorPreferencias } from "@/services/itinerarioService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/services/queryClient";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme, theme } = useTheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const { data: itinerarioActivo = null, isLoading: loadingItinerario } = useQuery({
    queryKey: ['activeItinerary'],
    queryFn: async () => {
      // Si hay una mutación de pin en curso, no hacemos la llamada al backend y usamos lo que está en caché (optimista)
      const isPinning = queryClient.isMutating({ mutationKey: ['pinItinerary'] }) > 0;
      if (isPinning) {
        const cached = queryClient.getQueryData<ItinerarioEnCursoDTO | null>(['activeItinerary']);
        if (cached !== undefined) {
          return cached;
        }
      }
      return getItinerarioEnCurso();
    },
    enabled: !!user,
  });

  // Prefecth inicial en background de la pestaña Explorar
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['exploreSearch', { provincia: undefined, categoria: undefined }],
      queryFn: () => buscarPorPreferencias({ provincia: undefined, tags: undefined }),
    });
  }, []);

  const handlePreferenciasPress = () => {
    router.push("/(tabs)/inicioApp/preferencias");
  };

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
