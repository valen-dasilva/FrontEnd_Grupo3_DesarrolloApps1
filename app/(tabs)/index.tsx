import React from 'react';
import { Dimensions, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header/Header';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const handleEnCursoPress = () => {
    // Navegar al detalle del itinerario pre-existente
    router.push('/explorarApp/itinerarioInfo');
  };

  const handlePreferenciasPress = () => {
    router.push('/inicioApp/preferencias');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      {/* Cabecera Unificada utilizando el componente de Tobias */}
      <Header title="Inicio" />

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mensaje de Bienvenida */}
        <View style={styles.greetingContainer}>
          <Text style={[styles.greetingTitle, { color: theme.text }]}>¡Hola, Viajero!</Text>
          <Text style={[styles.greetingSubtitle, { color: theme.textSecondary }]}>¿A dónde te llevará tu próxima aventura?</Text>
        </View>

        {/* Sección Viaje en Curso */}
        <TouchableOpacity
          style={[
            styles.enCursoCard, 
            { 
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderWidth: isDark ? 1 : 0
            }
          ]}
          activeOpacity={0.9}
          onPress={handleEnCursoPress}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/bariloche_escapada.png')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            {/* Degradado premium para asegurar la legibilidad del texto en blanco */}
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.75)']}
              style={styles.gradientOverlay}
            />

            {/* Badge flotante "En curso" */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>En curso</Text>
            </View>

            {/* Título flotante y botón de acción */}
            <View style={styles.titleOverlayRow}>
              <Text style={styles.cardTitle}>Escapada a Bariloche</Text>
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
              <Ionicons name="calendar-outline" size={16} color={isDark ? theme.textSecondary : "#6B7280"} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>12 Oct - 18 Oct</Text>
            </View>
            <Text style={[styles.dotSeparator, { color: isDark ? '#4B5563' : '#D1D5DB' }]}>•</Text>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={isDark ? theme.textSecondary : "#6B7280"} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>Río Negro, Argentina</Text>
            </View>
          </View>

          {/* Sub-tarjeta de la Próxima Actividad */}
          <View style={[
            styles.actividadCard, 
            { 
              backgroundColor: isDark ? '#191D26' : '#F5F7FF',
              borderColor: isDark ? '#2A303C' : '#EEF2FF'
            }
          ]}>
            <Text style={styles.actividadHeader}>Próxima actividad</Text>
            <View style={styles.actividadDetailsRow}>
              <Text style={[styles.actividadTitle, { color: theme.text }]}>Excursión Circuito Chico</Text>
              <Text style={styles.actividadTime}>10:00 AM</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Sección Buscar por Preferencias */}
        <TouchableOpacity
          style={styles.yellowCard}
          activeOpacity={0.95}
          onPress={handlePreferenciasPress}
        >
          <View style={styles.circle}>
            <MaterialCommunityIcons name="map-marker-plus" size={28} color="#FFB020" />
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
    fontFamily: 'Inter-Bold',
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  greetingSubtitle: {
    fontSize: 16,
    marginTop: 6,
    lineHeight: 22,
  },
  enCursoCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  imageContainer: {
    height: 220,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  titleOverlayRow: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
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
    textTransform: 'uppercase',
    color: '#6366F1',
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  actividadDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  actividadTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  actividadTime: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  yellowCard: {
    backgroundColor: '#FFC837',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFC837',
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  yellowCardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    fontWeight: 'bold',
    marginTop: 14,
  },
});
