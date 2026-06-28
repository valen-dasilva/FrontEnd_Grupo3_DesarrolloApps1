import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StatusBar, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { OptionItineraryDetail } from '@/components/group/OptionItineraryDetail';
import { usePollOptionDetailHook } from '@/hooks/usePolls';
import { useTheme } from '@/hooks/useColorScheme';
import { fonts } from '@/constants/fonts';

export default function OptionDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { idGrupo, idEncuesta, idOpcion } = useLocalSearchParams<{
    idGrupo: string;
    idEncuesta: string;
    idOpcion: string;
  }>();
  const groupId = Number(idGrupo);
  const pollId = Number(idEncuesta);
  const optionId = Number(idOpcion);
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { detail, isLoading, error } = usePollOptionDetailHook(
    Number.isNaN(groupId) ? null : groupId,
    Number.isNaN(pollId) ? null : pollId,
    Number.isNaN(optionId) ? null : optionId,
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Detalle de opción" onThemeTogglePress={toggleColorScheme} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Detalle de opción" onThemeTogglePress={toggleColorScheme} />
        <View style={styles.centered}>
          <Text style={[styles.error, { color: theme.danger }]}>
            {error || 'No se pudo cargar el detalle de la opción.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Detalle de opción"
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <OptionItineraryDetail itinerary={detail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
