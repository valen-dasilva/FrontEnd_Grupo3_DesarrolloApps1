import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams } from 'expo-router';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '@/src/context/AuthContext';
import { ApiError } from '@/src/services/api';

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
    <AuthLayout
      headerSubtitle="¡Regístrate en segundos y comienza a planificar! Tu próxima aventura te espera."
      sheetTitle="Comienza tu viaje"
      sheetSubtitle="Ingresá para sincronizar tus itinerarios y descubrir lugares únicos."
    >
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
        style={{ marginTop: 20 }}
      />
    </AuthLayout>
  );
};
