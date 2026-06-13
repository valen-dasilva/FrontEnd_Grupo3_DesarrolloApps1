import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { AuthLayout } from '@/components/AuthLayout';
import { AuthFooterLink } from '@/components/AuthFooterLink';

export const RegisterStep1Screen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (!name || !lastName || !email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ingresa un correo electrónico válido',
      });
      return;
    }

    router.push({ pathname: '/register2', params: { name, lastName, email } });
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

      <CustomButton title="Continuar" showArrow onPress={handleContinue} style={{ marginTop: 20 }} />

      <AuthFooterLink
        text="¿Ya tenés cuenta? "
        linkText="Iniciar sesión"
        onPress={() => router.push('/login')}
      />
    </AuthLayout>
  );
};
