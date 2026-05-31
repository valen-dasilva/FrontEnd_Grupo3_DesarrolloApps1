import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CATEGORIA_LABEL,
  CategoriaItinerario,
  ItinerarioSistemaResumenDTO,
  Provincia,
  PROVINCIA_LABEL,
} from '../../src/types/itinerario';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

function formatFechaCorta(iso: string) {
  if (!iso) return '';
  const [m, d] = iso.split('-');
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${Number.parseInt(d)} ${meses[Number.parseInt(m) - 1]}`;
}

function CardResultado({ item }: Readonly<{ item: ItinerarioSistemaResumenDTO }>) {
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
      <View style={styles.cardImageContainer}>
        {item.fotoPortada ? (
          <Image source={{ uri: item.fotoPortada }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={[styles.cardImage, styles.cardImageFallback, { backgroundColor: isDark ? '#2A303D' : '#F3F4F6' }]}>
            <Ionicons name="image-outline" size={40} color={theme.textSecondary} />
          </View>
        )}
        <View style={styles.provinciasBadge}>
          <Text style={styles.provinciasBadgeText}>
            {PROVINCIA_LABEL[item.provincia] ?? item.provincia}
          </Text>
        </View>
        {Boolean(item.fechaInicio && item.fechaFin) && (
          <View style={styles.fechaBadge}>
            <Ionicons name="calendar-outline" size={12} color="#FFFFFF" />
            <Text style={styles.fechaBadgeText}>
              {`${formatFechaCorta(item.fechaInicio)} - ${formatFechaCorta(item.fechaFin)}, ${item.fechaFin.split('-')[0]}`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.cardTitulo, { color: theme.text }]}>{item.titulo}</Text>
        <Text style={[styles.cardDescripcion, { color: theme.textSecondary }]} numberOfLines={3}>
          {item.descripcion}
        </Text>
        <View style={styles.etiquetasRow}>
          {item.etiquetas?.map((e) => (
            <View key={e} style={[styles.etiqueta, { backgroundColor: isDark ? '#2A303D' : '#F3F4F6' }]}>
              <Text style={[styles.etiquetaText, { color: theme.textSecondary }]}>{CATEGORIA_LABEL[e] ?? e}</Text>
            </View>
          ))}
          {item.duracionDias != null && (
            <View style={[styles.etiqueta, styles.etiquetaDias, { backgroundColor: isDark ? '#192C56' : '#EFF4FF' }]}>
              <Ionicons name="time-outline" size={12} color={theme.primary} />
              <Text style={[styles.etiquetaText, { color: theme.primary }]}>
                {`${item.duracionDias} días`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function RecomendacionesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const params = useLocalSearchParams<{
    resultados: string;
    provincia: string;
    etiquetas: string;
    fechaInicio: string;
    fechaFin: string;
  }>();

  const resultados: ItinerarioSistemaResumenDTO[] = params.resultados
    ? JSON.parse(params.resultados)
    : [];

  const etiquetas: CategoriaItinerario[] = params.etiquetas
    ? JSON.parse(params.etiquetas)
    : [];
  const provinciaLabel = params.provincia
    ? PROVINCIA_LABEL[params.provincia as Provincia] ?? params.provincia
    : null;

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header azul de resultados */}
      <View style={[
        styles.headerAzul, 
        { 
          backgroundColor: isDark ? theme.surface : '#2F65E3',
          borderBottomWidth: isDark ? 1 : 0,
          borderBottomColor: theme.border
        }
      ]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? theme.primary : '#FFFFFF'} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerLabel, isDark && { color: theme.textSecondary }]}>RESULTADOS PARA</Text>
          <Text style={[styles.headerTitulo, isDark && { color: theme.text }]}>{provinciaLabel ?? 'Argentina'}</Text>
          <View style={styles.chipsRow}>
            {Boolean(params.fechaInicio && params.fechaFin) && (
              <View style={[styles.chip, isDark && { backgroundColor: '#2A303D' }]}>
                <Ionicons name="calendar-outline" size={12} color="#FFFFFF" />
                <Text style={styles.chipText}>
                  {resultados[0]?.duracionDias
                    ? `${resultados[0].duracionDias} días`
                    : `${formatFechaCorta(params.fechaInicio)} - ${formatFechaCorta(params.fechaFin)}`}
                </Text>
              </View>
            )}
            {etiquetas.length > 0 && (
              <View style={[styles.chip, isDark && { backgroundColor: '#2A303D' }]}>
                <Ionicons name="pricetag-outline" size={12} color="#FFFFFF" />
                <Text style={styles.chipText}>
                  {etiquetas.map((e) => CATEGORIA_LABEL[e]).join(' y ')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Lista de resultados */}
      <ScrollView
        style={[styles.lista, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.listaContent}
        showsVerticalScrollIndicator={false}
      >
        {resultados.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Sin resultados</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Probá con otros filtros o fechas distintas.
            </Text>
            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: theme.primary }]} onPress={() => router.back()}>
              <Text style={styles.emptyBtnText}>Volver a preferencias</Text>
            </TouchableOpacity>
          </View>
        ) : (
          resultados.map((item) => <CardResultado key={item.idItinerario} item={item} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerAzul: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backBtn: {
    marginTop: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
  // Card de resultado
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImageContainer: {
    height: 180,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  provinciasBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  provinciasBadgeText: {
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
  fechaBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardDescripcion: {
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
  etiquetaText: {
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
  // Empty state
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
