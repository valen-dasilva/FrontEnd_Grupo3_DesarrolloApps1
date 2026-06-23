import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { styles } from './ProfileScreen.styles';
import { MapaArgentina } from '@/components/perfil/MapaArgentina/MapaArgentina';
import { MapaInteractivoModal } from '@/components/perfil/MapaArgentina/MapaInteractivoModal';
import { AvatarCard } from '@/components/perfil/AvatarCard/AvatarCard';
import { useEstadisticas } from '@/hooks/useEstadisticas';
import { useItinerariosHook } from '@/hooks/useItinerarios';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { logout } = useAuth();

  const [mapaVisible, setMapaVisible] = useState(false);
  const { data: estadisticas } = useEstadisticas();
  const { listItinerarioResumen } = useItinerariosHook();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Perfil" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <AvatarCard />

        <Text style={[styles.sectionLabel, { color: theme.gray }]}>SEGURIDAD Y CUENTA</Text>

        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/perfilApp/editarUsuario')}
        >
          <View style={styles.optionLeft}>
            <MaterialIcons name={icons.Person} size={20} color={theme.text} />
            <Text style={[styles.optionText, { color: theme.text }]}>Editar Usuario</Text>
          </View>
          <MaterialIcons name={icons['chevron.right']} size={22} color={theme.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/perfilApp/cambiarContrasena')}
        >
          <View style={styles.optionLeft}>
            <MaterialIcons name={icons.Lock} size={20} color={theme.text} />
            <Text style={[styles.optionText, { color: theme.text }]}>Cambiar Contraseña</Text>
          </View>
          <MaterialIcons name={icons['chevron.right']} size={22} color={theme.gray} />
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { color: theme.gray }]}>MI RECORRIDO POR ARGENTINA</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {estadisticas?.totalProvincias ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Provincias</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {estadisticas?.diasTotalesViajados ?? 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Días viajados</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {estadisticas?.porcentajeArgentina ?? 0}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>De Argentina</Text>
          </View>
        </View>

        {estadisticas?.provinciaFavorita && (
          <View style={[styles.favCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.favLabel, { color: theme.gray }]}>Provincia favorita</Text>
            <Text style={[styles.favValue, { color: theme.text }]}>
              {estadisticas.provinciaFavorita.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.mapaCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setMapaVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.mapaTitleRow}>
            <Text style={[styles.mapaTitle, { color: theme.text }]}>Provincias visitadas</Text>
            <MaterialIcons name="open-in-full" size={16} color={theme.gray} />
          </View>
          <MapaArgentina
            provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []}
            colorVisitada={theme.primary}
            colorNoVisitada={theme.border}
            strokeColor={theme.background}
            height={300}
          />
          {!estadisticas?.totalProvincias && (
            <Text style={[styles.mapaEmpty, { color: theme.gray }]}>
              Completá tus primeros viajes para ver el mapa
            </Text>
          )}
        </TouchableOpacity>

        <MapaInteractivoModal
          visible={mapaVisible}
          onClose={() => setMapaVisible(false)}
          provinciasVisitadas={estadisticas?.provinciasVisitadas ?? []}
          itinerarios={listItinerarioResumen}
        />

        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: theme.danger }]}
          onPress={logout}
        >
          <MaterialIcons name={icons.Logout} size={18} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
