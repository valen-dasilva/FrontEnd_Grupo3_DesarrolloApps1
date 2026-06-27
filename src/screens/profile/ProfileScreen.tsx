import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import { styles } from './ProfileScreen.styles';
import { AvatarCard } from '@/components/perfil/AvatarCard/AvatarCard';
import { OpcionRow } from '@/components/perfil/OpcionRow/OpcionRow';
import { SeccionRecorrido } from '@/components/perfil/SeccionRecorrido/SeccionRecorrido';
import { useEstadisticas } from '@/hooks/useEstadisticas';
import { useItinerariosHook } from '@/hooks/useItinerarios';

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { logout } = useAuth();

  const { data: estadisticas } = useEstadisticas();
  const { listItinerarioResumen } = useItinerariosHook();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Header title="Perfil" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <AvatarCard />

        <Text style={[styles.sectionLabel, { color: theme.gray }]}>SEGURIDAD Y CUENTA</Text>

        <OpcionRow 
          icono={icons.Person}
          label="Editar Usuario"
          onPress={() => router.push('/(tabs)/perfilApp/editarUsuario')}
        />
        <OpcionRow
          icono={icons.Lock}
          label="Cambiar Contraseña"
          onPress={() => router.push('/(tabs)/perfilApp/cambiarContrasena')}
        />

        <Text style={[styles.sectionLabel, { color: theme.gray }]}>MI RECORRIDO POR ARGENTINA</Text>

        <SeccionRecorrido
          estadisticas={estadisticas}
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
