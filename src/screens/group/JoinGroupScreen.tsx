import { Stack, useRouter, type Href } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { useGroupsHook } from '@/hooks/useGroups';
import { useTheme } from '@/hooks/useColorScheme';
import { ApiError } from '@/services/api';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export default function JoinGroupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { joinGroup, isJoining } = useGroupsHook();

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleJoin = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setErrorMessage('Ingresá un código de invitación.');
      return;
    }

    try {
      setErrorMessage(null);
      const group = await joinGroup(trimmedCode);
      if (group) {
        router.replace(
          `/(tabs)/(group)/detalleGrupo?idGrupo=${group.idGrupo}` as Href,
        );
      }
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'No se pudo unir al grupo.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Unirse a grupo"
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Ingresá el código de invitación que te compartió el creador del grupo.
          </Text>

          <CustomInput
            label="Código de invitación"
            placeholder="Ej: ABC123"
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setErrorMessage(null);
            }}
            autoCapitalize="characters"
            maxLength={20}
          />

          {errorMessage && (
            <Text style={[styles.errorText, { color: theme.danger }]}>{errorMessage}</Text>
          )}

          <View style={styles.spacer} />

          <CustomButton
            title={isJoining ? 'Uniéndose...' : 'Unirse al grupo'}
            onPress={handleJoin}
            disabled={isJoining}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    padding: paddings.spacing.lg,
    paddingBottom: paddings.spacing.xxxl,
  },
  description: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    lineHeight: 22,
    marginBottom: paddings.spacing.lg,
  },
  spacer: {
    flex: 1,
    minHeight: paddings.spacing.xxxl,
  },
  errorText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginTop: paddings.spacing.sm,
  },
});
