import { Stack, useRouter, type Href } from 'expo-router';
import React from 'react';
import {
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
import { FullScreenLoader } from '@/components/common/FullScreenLoader/FullScreenLoader';
import { GroupCard } from '@/components/group/GroupCard';
import { EmptyState } from '@/components/favorites/favorite_principal/EmptyState/EmptyState';
import { useGroupsHook } from '@/hooks/useGroups';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { GroupSummary } from '@/types/grupo';

export default function GroupsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { groups, isLoading, error, loadGroups } = useGroupsHook();

  const handleCreateGroup = () => {
    router.push('/(tabs)/(group)/crearGrupo' as Href);
  };

  const handleJoinGroup = () => {
    router.push('/(tabs)/(group)/unirseGrupo' as Href);
  };

  const handleGroupPress = (group: GroupSummary) => {
    router.push(
      `/(tabs)/(group)/detalleGrupo?idGrupo=${group.idGrupo}` as Href,
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyWrapper}>
      <EmptyState
        title="Aún no tienes grupos"
        description="Creá un grupo o unite con un código de invitación para empezar a planificar viajes juntos."
        iconName={icons.Groups}
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header title="Grupos" onThemeTogglePress={toggleColorScheme} />

      <View style={styles.actions}>
        <Pressable
          onPress={handleCreateGroup}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name={icons.Add} size={20} color={theme.textInverse} />
          <Text style={[styles.actionButtonText, { color: theme.textInverse }]}>Crear grupo</Text>
        </Pressable>

        <Pressable
          onPress={handleJoinGroup}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.surfaceHighlight },
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name={icons.Link} size={20} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>Unirse</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <FullScreenLoader message="Cargando grupos..." />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.idGrupo.toString()}
          renderItem={({ item }) => (
            <GroupCard group={item} onPress={() => handleGroupPress(item)} />
          )}
          contentContainerStyle={styles.list}
          refreshing={isLoading}
          onRefresh={loadGroups}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  actions: {
    flexDirection: 'row',
    gap: paddings.spacing.md,
    paddingHorizontal: paddings.spacing.lg,
    paddingVertical: paddings.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: paddings.radius.md,
    gap: 8,
  },
  actionButtonText: {
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
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: paddings.spacing.lg,
  },
});
