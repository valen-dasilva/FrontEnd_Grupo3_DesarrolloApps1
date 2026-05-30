import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { COLORS } from '../styles/colors';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { BottomSheet } from '../../components/BottomSheet';
import { HeaderLogo } from '../../components/HeaderLogo';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos',
      });
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), contrasenia: password });
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Inicio de sesión correcto',
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
              subtitle="Planificá tu próxima aventura por Argentina de manera simple y sin fricciones." 
            />
          </View>

          <BottomSheet>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Comienza tu viaje</Text>
              <Text style={[styles.sheetSubtitle, { color: theme.textSecondary }]}>Ingresá para sincronizar tus itinerarios y descubrir lugares únicos.</Text>
            </View>
            
            <CustomInput
              iconName="mail-outline"
              placeholder="Tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            
            <CustomInput
              iconName="key-outline"
              placeholder="********"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <CustomButton
              title={submitting ? 'Ingresando...' : 'Continuar'}
              showArrow
              onPress={handleLogin}
              disabled={submitting}
              style={styles.buttonSpacing}
            />

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: theme.textSecondary }]}>¿No tenés cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/register1')}>
                <Text style={[styles.registerLink, { color: theme.primary }]}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
