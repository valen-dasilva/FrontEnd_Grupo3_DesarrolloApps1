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
