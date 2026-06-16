import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { AuthLayout } from '@/components/AuthLayout';
import { AuthFooterLink } from '@/components/AuthFooterLink';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/api';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const handleRegister = async () => {
    if (!name || !lastName || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ingresa un correo electrónico válido',
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
        iconName="person-outline"
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <CustomInput
        iconName="person-outline"
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      
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
        placeholder="Contraseña"
        secureTextEntry={hidePassword}
        onEyePress={() => setHidePassword(!hidePassword)}
        value={password}
        onChangeText={setPassword}
      />

      <CustomInput
        iconName="key-outline"
        placeholder="Confirmar contraseña"
        secureTextEntry={hidePassword}
        showEyeButton={false}
        onEyePress={() => setHidePassword(!hidePassword)}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <CustomButton
        title={submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        showArrow
        onPress={handleRegister}
        disabled={submitting}
        style={{ marginTop: 20 }}
      />

      <AuthFooterLink
        text="¿Ya tenés cuenta? "
        linkText="Iniciar sesión"
        onPress={() => router.push('/login')}
      />
    </AuthLayout>
  );
};
