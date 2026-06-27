import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { AuthLayout } from '@/components/AuthLayout';
import { AuthFooterLink } from '@/components/AuthFooterLink';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/api';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    <AuthLayout
      headerSubtitle="Planificá tu próxima aventura por Argentina de manera simple y sin fricciones."
      sheetTitle="Comienza tu viaje"
      sheetSubtitle="Ingresá para sincronizar tus itinerarios y descubrir lugares únicos."
    >
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
        eyeButtonDisabled = {password.length === 0}
        onChangeText={setPassword}
      /> 

      <CustomButton
        title={submitting ? 'Ingresando...' : 'Continuar'}
        showArrow
        onPress={handleLogin}
        disabled={submitting}
        style={{ marginTop: 20 }}
      />

      <AuthFooterLink
        text="¿No tenés cuenta? "
        linkText="Crear cuenta"
        onPress={() => router.push('/register')}
      />
    </AuthLayout>
  );
};
