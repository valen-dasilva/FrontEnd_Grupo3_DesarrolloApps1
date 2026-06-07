import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { BottomSheet } from '../../components/BottomSheet';
import { HeaderLogo } from '../../components/HeaderLogo';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/constants/colors';

export const RegisterStep1Screen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

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

            <CustomButton title="Continuar" showArrow onPress={handleContinue} style={styles.buttonSpacing} />

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.textSecondary }]}>¿Ya tenés cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.loginLink, { color: theme.primary }]}>Iniciar sesión</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
