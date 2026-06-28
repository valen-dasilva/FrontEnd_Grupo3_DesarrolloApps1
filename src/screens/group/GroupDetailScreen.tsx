import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Header } from '@/components/common/Header/Header';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { useGroupDetailsHook, useGroupsHook } from '@/hooks/useGroups';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { GroupMember } from '@/types/grupo';
import { getCountdownText } from '@/utils/dateUtils';

export default function GroupDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { idGrupo } = useLocalSearchParams<{ idGrupo: string }>();
  const groupId = Number(idGrupo);
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { user } = useAuth();
  const {
    group,
    isLoading,
    error,
    invitation,
    regenerateInvitation,
    isLoadingInvitation,
    isRegenerating,
  } = useGroupDetailsHook(Number.isNaN(groupId) ? null : groupId);
  const { leaveGroup, isLeaving } = useGroupsHook();

  const [countdown, setCountdown] = useState('');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    if (!invitation) return;
    setCountdown(getCountdownText(invitation.fechaExpiracion));
    const interval = setInterval(() => {
      setCountdown(getCountdownText(invitation.fechaExpiracion));
    }, 60000);
    return () => clearInterval(interval);
  }, [invitation]);

  const handleCopyCode = async () => {
    if (!invitation) return;
    const text = invitation.codigo;
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // ignore
        }
      }
    } else {
      await Clipboard.setStringAsync(text);
    }
    Toast.show({
      type: 'success',
      text1: 'Código copiado',
      position: 'bottom',
    });
  };

  const confirmLeave = () => {
    setShowLeaveConfirm(true);
  };

  const handleLeave = async () => {
    if (Number.isNaN(groupId)) return;
    await leaveGroup(groupId);
    setShowLeaveConfirm(false);
    router.replace('/(tabs)/grupo' as Href);
  };

  const handleCreatePoll = () => {
    router.push(`/(tabs)/(group)/crearEncuesta?idGrupo=${groupId}` as Href);
  };

  const handleViewPolls = () => {
    router.push(`/(tabs)/(group)/encuestas?idGrupo=${groupId}` as Href);
  };

  const renderMember = ({ item }: { item: GroupMember }) => (
    <View style={[styles.memberCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {item.fotoPerfil ? (
        <Image source={{ uri: item.fotoPerfil }} style={styles.avatarImage} />
      ) : (
        <View style={[styles.avatar, { backgroundColor: theme.avatarBg }]}>
          <Text style={[styles.avatarText, { color: theme.primary }]}>
            {item.nombre[0] ?? ''}
          </Text>
        </View>
      )}
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: theme.text }]}>{item.nombre}</Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: theme.surfaceHighlight }]}>
        <Text style={[styles.roleText, { color: theme.primary }]}>
          {item.rol === 'CREADOR' ? 'Creador' : 'Miembro'}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Grupo" onThemeTogglePress={toggleColorScheme} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  if (error || !group) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Grupo" onThemeTogglePress={toggleColorScheme} />
        <View style={styles.centered}>
          <Text style={[styles.error, { color: theme.danger }]}>
            {error || 'No se pudo cargar el grupo.'}
          </Text>
        </View>
      </View>
    );
  }

  const isCreator = group.creadorId === user?.idUsuario;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title={group.nombre}
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {group.fotoPortada ? (
          <Image source={{ uri: group.fotoPortada }} style={styles.cover} />
        ) : (
          <View style={[styles.coverPlaceholder, { backgroundColor: theme.surfaceHighlight }]}>
            <MaterialIcons name={icons.Groups} size={48} color={theme.primary} />
          </View>
        )}

        {group.descripcion ? (
          <Text style={[styles.groupDescription, { color: theme.textSecondary }]}>
            {group.descripcion}
          </Text>
        ) : null}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Código de invitación</Text>

          {isCreator && (
            <Pressable
              onPress={regenerateInvitation}
              disabled={isRegenerating}
              style={({ pressed }) => [
                styles.generateButton,
                { backgroundColor: theme.primary },
                (pressed || isRegenerating) && { opacity: 0.7 },
              ]}
            >
              {isRegenerating ? (
                <ActivityIndicator size="small" color={theme.textInverse} />
              ) : (
                <>
                  <MaterialIcons name={icons.Link} size={24} color={theme.textInverse} />
                  <Text style={[styles.generateButtonText, { color: theme.textInverse }]}>
                    Generar código
                  </Text>
                </>
              )}
            </Pressable>
          )}

          {isLoadingInvitation ? (
            <View style={styles.invitationLoader}>
              <ActivityIndicator color={theme.primary} />
            </View>
          ) : invitation ? (
            <View style={[styles.codeCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.codeRow}>
                <MaterialIcons name={icons.Link} size={20} color={theme.primary} />
                <Text style={[styles.code, { color: theme.text }]}>{invitation.codigo}</Text>
              </View>
              <View style={styles.codeActions}>
                <Pressable
                  onPress={handleCopyCode}
                  style={({ pressed }) => [
                    styles.codeAction,
                    { backgroundColor: theme.surfaceHighlight },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <MaterialIcons name={icons.ContentCopy} size={18} color={theme.primary} />
                  <Text style={[styles.codeActionText, { color: theme.primary }]}>Copiar</Text>
                </Pressable>
              </View>
              <View style={styles.timerRow}>
                <MaterialIcons name={icons.Timer} size={14} color={theme.textSecondary} />
                <Text style={[styles.timerText, { color: theme.textSecondary }]}>
                  Expira en {countdown || getCountdownText(invitation.fechaExpiracion)}
                </Text>
              </View>
            </View>
          ) : (
            !isCreator && (
              <Text style={[styles.error, { color: theme.textSecondary }]}>
                No hay un código activo.
              </Text>
            )
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Miembros</Text>
          <FlatList
            data={group.miembros}
            keyExtractor={(item) => item.idUsuario.toString()}
            renderItem={renderMember}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleViewPolls}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.surfaceHighlight },
              pressed && { opacity: 0.8 },
            ]}
          >
            <MaterialIcons name={icons.Poll} size={20} color={theme.primary} />
            <Text style={[styles.actionButtonText, { color: theme.primary }]}>Ver encuestas</Text>
          </Pressable>

          <Pressable
            onPress={handleCreatePoll}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.8 },
            ]}
          >
            <MaterialIcons name={icons.Add} size={20} color={theme.textInverse} />
            <Text style={[styles.actionButtonText, { color: theme.textInverse }]}>Crear encuesta</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={confirmLeave}
          style={({ pressed }) => [
            styles.leaveButton,
            { backgroundColor: theme.surface, borderColor: theme.danger },
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name={icons.ExitToApp} size={20} color={theme.danger} />
          <Text style={[styles.leaveButtonText, { color: theme.danger }]}>Abandonar grupo</Text>
        </Pressable>
      </ScrollView>

      <ConfirmAlert
        visible={showLeaveConfirm}
        title="Abandonar grupo"
        message="¿Estás seguro de que querés abandonar este grupo? Si sos el último miembro, el grupo se eliminará."
        cancelText="Cancelar"
        confirmText="Abandonar"
        loading={isLeaving}
        onCancel={() => setShowLeaveConfirm(false)}
        onConfirm={handleLeave}
      />
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
    paddingHorizontal: paddings.spacing.lg,
  },
  scroll: {
    padding: paddings.spacing.lg,
    paddingBottom: paddings.spacing.xxxl,
  },
  groupDescription: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    lineHeight: 22,
    marginBottom: paddings.spacing.lg,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: paddings.radius.md,
    marginBottom: paddings.spacing.lg,
  },
  coverPlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: paddings.radius.md,
    marginBottom: paddings.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: paddings.spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.lg,
    marginBottom: paddings.spacing.md,
  },
  codeCard: {
    padding: paddings.spacing.md,
    borderRadius: paddings.radius.md,
    borderWidth: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.xxl,
    marginLeft: paddings.spacing.sm,
    letterSpacing: 2,
  },
  codeActions: {
    flexDirection: 'row',
    gap: paddings.spacing.md,
    marginTop: paddings.spacing.md,
  },
  codeAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: paddings.radius.sm,
    gap: 6,
  },
  codeActionText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.sm,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  invitationLoader: {
    paddingVertical: paddings.spacing.lg,
    alignItems: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: paddings.spacing.md,
  },
  timerText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginLeft: 4,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: paddings.spacing.md,
    borderRadius: paddings.radius.md,
    borderWidth: 1,
    marginBottom: paddings.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarText: {
    fontFamily: fonts.family.headingBold,
    fontSize: fonts.size.md,
  },
  memberInfo: {
    flex: 1,
    marginLeft: paddings.spacing.md,
  },
  memberName: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
  },
  memberEmail: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: paddings.radius.sm,
  },
  roleText: {
    fontFamily: fonts.family.bodySemiBold,
    fontSize: fonts.size.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: paddings.spacing.md,
    marginBottom: paddings.spacing.lg,
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
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: paddings.radius.md,
    borderWidth: 1,
    gap: 8,
  },
  leaveButtonText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: paddings.radius.md,
    gap: 10,
    marginBottom: paddings.spacing.md,
  },
  generateButtonText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.lg,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
