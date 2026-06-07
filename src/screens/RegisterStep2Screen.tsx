import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams } from 'expo-router';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { BottomSheet } from '../../components/BottomSheet';
import { HeaderLogo } from '../../components/HeaderLogo';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

// Debe coincidir con la validación del backend (RegisterRequest.contrasenia).
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const RegisterStep2Screen: React.FC = () => {
  const { name, lastName, email } = useLocalSearchParams<{
    name: string;
    lastName: string;
    email: string;
  }>();
  const { register } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const handleRegister = async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Las contraseñas no coinciden',
      });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número',
      });
      return;
    }

    setSubmitting(true);
    try {
      await register({
        nombre: name,
        apellido: lastName,
        email: email.trim(),
        contrasenia: password,
      });
      Toast.show({
        type: 'success',
        text1: '¡Registro exitoso!',
        text2: `Bienvenido, ${name || ''}`,
      });
      // La navegación a /(tabs) la maneja el guard del layout al cambiar el token.
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'No se pudo conectar con el servidor';
      Toast.show({ type: 'error', text1: 'Error', text2: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.topSection}>
            <HeaderLogo 
              title="TuristeAR" 
              subtitle="¡Regístrate en segundos y comienza a planificar! Tu próxima aventura te espera." 
            />
          </View>

          <BottomSheet>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Comienza tu viaje</Text>
              <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>Ingresá para sincronizar tus itinerarios y descubrir lugares únicos.</Text>
            </View>
            
            <CustomInput
              iconName="key-outline"
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <CustomInput
              iconName="key-outline"
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <CustomButton
              title={submitting ? 'Creando cuenta...' : 'Ingresar'}
              showArrow
              onPress={handleRegister}
              disabled={submitting}
              style={styles.buttonSpacing}
            />
          </BottomSheet>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonSpacing: {
    marginTop: 20,
  },
});
