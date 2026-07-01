// Pantalla de preferencias de búsqueda.
// El usuario elige destino, fechas y categorías antes de lanzar la búsqueda.
// La lógica de UI de cada sección fue extraída a componentes propios en components/Preferencias/.


import { useTheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from '@/components/common/Header/Header';
import { CategoriaGrid } from '@/components/Preferencias/CategoriaGrid';
import { DestinoInput } from '@/components/Preferencias/DestinoInput';
import { ProvinciaSelector } from '@/components/Preferencias/ProvinciaSelector';
import { DuracionCarousel, DuracionRango } from '@/components/Preferencias/DuracionCarousel';
import { buscarPorPreferencias } from '@/services/itinerarioService';
import {
  CategoriaItinerario,
  Provincia,
  PROVINCIA_LABEL,
} from '@/types/itinerario';

export default function PreferenciasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Estado del formulario de búsqueda. No se filtra por fecha: un itinerario
  // del sistema se define por su duración, no por cuándo se hace (alguien
  // puede querer el mismo plan en agosto o en diciembre).
  const [provincia, setProvincia] = useState<Provincia | undefined>();
  const [duracion, setDuracion] = useState<DuracionRango>();
  const [categorias, setCategorias] = useState<Set<CategoriaItinerario>>(
    new Set(),
  );

  // Control de visibilidad de los modales
  const [showProvincia, setShowProvincia] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme, toggleColorScheme } = useTheme();

  // Agrega o quita una categoría del Set de seleccionadas
  const toggleCategoria = (cat: CategoriaItinerario) => {
    setCategorias((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  // Llama al servicio, navega a recomendaciones con los resultados como params
  const handleBuscar = async () => {
    setLoading(true);
    try {
      let resultados = await buscarPorPreferencias({
        provincia,
        tags: categorias.size > 0 ? Array.from(categorias) : undefined,
      });

      if (duracion !== undefined) {
        let filtrados: typeof resultados = [];
        if (duracion === '1') {
          filtrados = resultados.filter((itinerary) => itinerary.duracionDias === 1);
        } else if (duracion === '2-3') {
          filtrados = resultados.filter((itinerary) => itinerary.duracionDias === 2 || itinerary.duracionDias === 3);
        } else if (duracion === '4+') {
          filtrados = resultados.filter((itinerary) => itinerary.duracionDias >= 4);
        }

        // Si no hay itinerarios en el rango específico, no dejamos la pantalla en blanco
        // y mostramos todos los disponibles para el destino/categoría.
        if (filtrados.length > 0) {
          resultados = filtrados;
        }
      }

      router.push({
        pathname: "/(tabs)/inicioApp/recomendaciones",
        params: {
          resultados: JSON.stringify(resultados),
          provincia: provincia ?? "",
          etiquetas: JSON.stringify(Array.from(categorias)),
          duracion: duracion ?? '',
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert("Error al buscar", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, backgroundColor: theme.background },
      ]}
    >
      <Header
        title="Buscar"
        showBackButton={true}
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
        onAvatarPress={() => router.push("/(tabs)/perfil")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sección destino */}
        <View style={styles.seccion}>
          <Text style={[styles.pregunta, { color: theme.text }]}>
            ¿A dónde quieres ir?
          </Text>
          <DestinoInput
            value={provincia ? PROVINCIA_LABEL[provincia] : undefined}
            placeholder="Ej: Río Negro, Salta, Buenos Aires..."
            onPress={() => setShowProvincia(true)}
            onClear={() => setProvincia(undefined)}
          />
        </View>

        {/* Sección duración */}
        <DuracionCarousel
          seleccionada={duracion}
          onSelect={setDuracion}
        />

        {/* Sección categorías — incluye su propio título y subtítulo */}
        <CategoriaGrid seleccionadas={categorias} onToggle={toggleCategoria} />
      </ScrollView>

      {/* Botón fijo en el fondo de la pantalla */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.btnBuscar,
            { backgroundColor: theme.primary },
            loading && styles.btnBuscarLoading,
          ]}
          onPress={handleBuscar}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="rocket-outline" size={20} color="#FFFFFF" />
              <Text style={styles.btnBuscarText}>Encontrar mi itinerario</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={[styles.footerCaption, { color: theme.textSecondary }]}>
          Podrás editar cada detalle después.
        </Text>
      </View>

      {/* Modal de lista de provincias */}
      <ProvinciaSelector
        visible={showProvincia}
        onClose={() => setShowProvincia(false)}
        onSelect={setProvincia}
        selected={provincia}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  seccion: {
    marginTop: 28,
  },
  pregunta: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  labelSeccion: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  btnBuscar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    paddingVertical: 16,
    width: "100%",
  },
  btnBuscarLoading: {
    opacity: 0.7,
  },
  btnBuscarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerCaption: {
    fontSize: 12,
  },
});
