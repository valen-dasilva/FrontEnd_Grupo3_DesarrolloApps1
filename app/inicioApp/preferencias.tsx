import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AventuraIcon from '../../assets/images/Icono-Aventura.svg';
import CultureIcon from '../../assets/images/Icono-Cultura.svg'; // CultureIcon fallback
import GastronomiaIcon from '../../assets/images/Icono-Gastronomia.svg';
import NaturalezaIcon from '../../assets/images/Icono-Naturaleza.svg';
import { CalendarioViaje } from '../../components/Preferencias/CalendarioViaje';
import { ProvinciaSelector } from '../../components/Preferencias/ProvinciaSelector';
import { buscarPorPreferencias } from '../../src/services/itinerarioService';
import { CATEGORIA_LABEL, CategoriaItinerario, Provincia, PROVINCIA_LABEL } from '../../src/types/itinerario';
import { Header } from '../../components/common/Header/Header';
import { useTheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

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

function formatFecha(iso: string) {
  const [y, m, d] = iso.split('-');
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${d} ${meses[Number.parseInt(m) - 1]} ${y}`;
}

export default function PreferenciasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [provincia, setProvincia] = useState<Provincia | undefined>();
  const [fechaInicio, setFechaInicio] = useState<string | undefined>();
  const [fechaFin, setFechaFin] = useState<string | undefined>();
  const [categorias, setCategorias] = useState<Set<CategoriaItinerario>>(new Set());
  const [showCalendario, setShowCalendario] = useState(false);
  const [showProvincia, setShowProvincia] = useState(false);
  const [loading, setLoading] = useState(false);

  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const toggleCategoria = (cat: CategoriaItinerario) => {
    setCategorias((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const resultados = await buscarPorPreferencias({
        provincia,
        tags: categorias.size > 0 ? Array.from(categorias) : undefined,
        fechaInicio,
        fechaFin,
      });
      router.push({
        pathname: '/inicioApp/recomendaciones',
        params: {
          resultados: JSON.stringify(resultados),
          provincia: provincia ?? '',
          etiquetas: JSON.stringify(Array.from(categorias)),
          fechaInicio: fechaInicio ?? '',
          fechaFin: fechaFin ?? '',
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert('Error al buscar', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title="Buscar"
        showBackButton={true}
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
        onAvatarPress={() => router.push('/(tabs)/perfil')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Destino */}
        <View style={styles.seccion}>
          <Text style={[styles.pregunta, { color: theme.text }]}>¿A dónde quieres ir?</Text>
          <TouchableOpacity
            style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setShowProvincia(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.inputText, { color: provincia ? theme.text : theme.textSecondary }]}>
              {provincia ? PROVINCIA_LABEL[provincia] : 'Ej: Río Negro, Salta, Buenos Aires...'}
            </Text>
            {provincia && (
              <TouchableOpacity onPress={() => setProvincia(undefined)}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Fechas */}
        <View style={styles.seccion}>
          <Text style={[styles.labelSeccion, { color: theme.textSecondary }]}>SELECCIONA DIAS</Text>
          <TouchableOpacity style={[styles.fechasRow, { backgroundColor: theme.primary }]} onPress={() => setShowCalendario(true)} activeOpacity={0.8}>
            <View style={[styles.fechaTab, { backgroundColor: theme.primary }]}>
              <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
              <Text style={styles.fechaTabTextoActivo}>
                {fechaInicio ? formatFecha(fechaInicio) : 'INICIO'}
              </Text>
            </View>
            <View style={[styles.fechaTab, { backgroundColor: theme.primary }]}>
              <Text style={styles.fechaTabTextoActivo}>
                {fechaFin ? formatFecha(fechaFin) : 'FINAL'}
              </Text>
            </View>
          </TouchableOpacity>
          {(fechaInicio || fechaFin) && (
            <TouchableOpacity onPress={() => { setFechaInicio(undefined); setFechaFin(undefined); }}>
              <Text style={[styles.limpiarFechas, { color: theme.primary }]}>Limpiar fechas</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categorías */}
        <View style={styles.seccion}>
          <Text style={[styles.pregunta, { color: theme.text }]}>¿Qué te interesa?</Text>
          <Text style={[styles.subtituloCat, { color: theme.textSecondary }]}>Selecciona todas las categorías que quieras</Text>
          <View style={styles.categoriasGrid}>
            {CATEGORIAS.map(({ value, icon }) => {
              const activa = categorias.has(value);
              const cardBg = activa 
                ? (isDark ? '#2A303D' : '#EFF4FF') 
                : theme.surface;
              const cardBorder = activa ? theme.primary : theme.border;
              const labelColor = activa ? theme.primary : theme.text;
              const iconColor = activa ? theme.primary : theme.textSecondary;

              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.categoriaCard, 
                    { 
                      backgroundColor: cardBg, 
                      borderColor: cardBorder 
                    }
                  ]}
                  onPress={() => toggleCategoria(value)}
                  activeOpacity={0.75}
                >
                  {icon(iconColor)}
                  <Text style={[styles.categoriaLabel, { color: labelColor }]}>
                    {CATEGORIA_LABEL[value]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo abajo */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.btnBuscar, { backgroundColor: theme.primary }, loading && styles.btnBuscarLoading]}
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
        <Text style={[styles.footerCaption, { color: theme.textSecondary }]}>Podrás editar cada detalle después.</Text>
      </View>

      <CalendarioViaje
        visible={showCalendario}
        onClose={() => setShowCalendario(false)}
        onConfirm={(inicio, fin) => { setFechaInicio(inicio); setFechaFin(fin); }}
        initialStart={fechaInicio}
        initialEnd={fechaFin}
      />
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
    fontWeight: '700',
    marginBottom: 12,
  },
  labelSeccion: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  subtituloCat: {
    fontSize: 13,
    marginTop: -6,
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
  },
  fechasRow: {
    flexDirection: 'row',
    gap: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fechaTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  fechaTabTextoActivo: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  limpiarFechas: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'right',
  },
  categoriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoriaCard: {
    width: '47%',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  categoriaLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  btnBuscar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
  },
  btnBuscarLoading: {
    opacity: 0.7,
  },
  btnBuscarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerCaption: {
    fontSize: 12,
  },
});
