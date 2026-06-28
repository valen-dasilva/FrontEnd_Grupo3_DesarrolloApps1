import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Header } from '@/components/common/Header/Header';
import { PollCard } from '@/components/group/PollCard';
import { usePollsHook } from '@/hooks/usePolls';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { PollSummary } from '@/types/poll';

export default function PollsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { idGrupo } = useLocalSearchParams<{ idGrupo: string }>();
  const groupId = Number(idGrupo);
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { polls, isLoading, error, loadPolls } = usePollsHook(
    Number.isNaN(groupId) ? null : groupId,
  );

  const handleCreatePoll = () => {
    router.push(`/(tabs)/(group)/crearEncuesta?idGrupo=${groupId}` as Href);
  };

  const handlePollPress = (poll: PollSummary) => {
    router.push(
      `/(tabs)/(group)/detalleEncuesta?idGrupo=${groupId}&idEncuesta=${poll.idEncuesta}` as Href,
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name={icons.Poll} size={64} color={theme.button_gray} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No hay encuestas</Text>
      <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
        Creá la primera encuesta para decidir el próximo destino del grupo.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Encuestas"
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <Pressable
        onPress={handleCreatePoll}
        style={({ pressed }) => [
          styles.createButton,
          { backgroundColor: theme.primary },
          pressed && { opacity: 0.8 },
        ]}
      >
        <MaterialIcons name={icons.Add} size={20} color={theme.textInverse} />
        <Text style={[styles.createButtonText, { color: theme.textInverse }]}>Nueva encuesta</Text>
      </Pressable>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.idEncuesta.toString()}
          renderItem={({ item }) => <PollCard poll={item} onPress={() => handlePollPress(item)} />}
          contentContainerStyle={styles.list}
          refreshing={isLoading}
          onRefresh={loadPolls}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: paddings.radius.md,
    marginHorizontal: paddings.spacing.lg,
    marginVertical: paddings.spacing.md,
    gap: 8,
  },
  createButtonText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  list: {
    padding: paddings.spacing.lg,
    paddingBottom: paddings.spacing.xxxl,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    textAlign: 'center',
    paddingHorizontal: paddings.spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: paddings.spacing.xxxl,
  },
  emptyTitle: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.lg,
    marginTop: paddings.spacing.md,
  },
  emptyDescription: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    textAlign: 'center',
    marginTop: paddings.spacing.sm,
  },
});
