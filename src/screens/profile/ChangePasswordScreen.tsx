import { Stack, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { changePassword } from '@/services/userService';
import { MaterialIcons } from '@expo/vector-icons';
import { icons } from '@/constants/icons';
import Toast from 'react-native-toast-message';
import { CustomInput } from '@/components/CustomInput';
import { FormActionButtons } from '@/components/common/FormActionButtons';
import { Header } from '@/components/common/Header/Header';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './ChangePasswordScreen.styles';

export default function CambiarContrasenaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setActual('');
      setNueva('');
      setConfirmar('');
    }, [])
  );

  const handleSave = async () => {
    if (!actual.trim() || !nueva.trim() || !confirmar.trim()) {
      Toast.show({ type: 'error', text1: 'Campos incompletos', text2: 'Completá todos los campos.' });
      return;
    }
    if (nueva.length < 6) {
      Toast.show({ type: 'error', text1: 'Contraseña muy corta', text2: 'Mínimo 6 caracteres.' });
      return;
    }
    if (nueva !== confirmar) {
      Toast.show({ type: 'error', text1: 'No coinciden', text2: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    if (!user) return;

    try {
      setLoading(true);
      await changePassword(user.idUsuario, {
        contraseniaActual: actual,
        contraseniaNueva: nueva,
      });
      Toast.show({ type: 'success', text1: 'Contraseña actualizada', text2: 'Tu contraseña se cambió correctamente.' });
      router.navigate('/(tabs)/perfil');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message || 'No se pudo cambiar la contraseña.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title="Cambiar contraseña"
        showBackButton={true}
        onBackPress={() => router.navigate('/(tabs)/perfil')}
      />
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={[styles.lockCircle, { backgroundColor: theme.avatarBg }]}>
          <MaterialIcons name={icons.Lock} size={26} color={theme.primary} />
        </View>

        <Text style={[styles.bigTitle, { color: theme.text }]}>Protege tu cuenta</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Ingrese su contraseña actual y elija una nueva para proteger su
          cuenta. Asegúrese de que sea única y difícil de desifrar.
        </Text>

        <CustomInput
          label="Contraseña actual"
          placeholder="••••••••"
          secureTextEntry
          value={actual}
          onChangeText={setActual}
          eyeButtonDisabled = {actual.length === 0}
        />

        <CustomInput
          label="Nueva contraseña"
          placeholder="••••••••"
          secureTextEntry
          value={nueva}
          onChangeText={setNueva}
          eyeButtonDisabled = {nueva.length === 0}
        />

        <CustomInput
          label="Confirmar nueva contraseña"
          placeholder="••••••••"
          secureTextEntry
          value={confirmar}
          onChangeText={setConfirmar}
          eyeButtonDisabled = {confirmar.length === 0}
        />

        <FormActionButtons 
          loading={loading}
          onSave={handleSave}
          onCancel={() => router.navigate('/(tabs)/perfil')}
        />
      </ScrollView>
    </View>
  );
}