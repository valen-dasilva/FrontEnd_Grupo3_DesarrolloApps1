import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Header } from '@/components/common/Header/Header';
import { FullScreenLoader } from '@/components/common/FullScreenLoader/FullScreenLoader';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { UserAvatar } from '@/components/common/UserAvatar/UserAvatar';
import { WeatherStrip } from '@/components/common/WeatherStrip/WeatherStrip';
import {
  ActivityFormValues,
  EditActivityFormulary,
} from '@/components/favorites/editActivityFormulary/EditActivityFormulary';
import { useGroupItineraryHook } from '@/hooks/useGroupItinerary';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useColorScheme';
import { formatHora } from '@/utils/dateUtils';
import { PROVINCIA_COORDS } from '@/utils/provinciaCoords';
import { Provincia } from '@/types/itinerario';
import {
  GroupItineraryAttendance,
  GroupItineraryItem,
  GroupItineraryItemRequest,
} from '@/types/itinerarioGrupo';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

type Tone = 'green' | 'red' | 'neutral';

// A nivel de módulo (no dentro del componente) para no remontar los avatares
// en cada render/poll, lo que causaría parpadeo.
function AttendanceRow({
  tone,
  label,
  people,
  theme,
}: {
  tone: Tone;
  label: string;
  people: GroupItineraryAttendance[];
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  if (people.length === 0) return null;
  const dotColor = tone === 'green' ? theme.lightgreen : tone === 'red' ? theme.danger : theme.textSecondary;
  return (
    <View style={styles.attRow}>
      <View style={styles.attRowHeader}>
        <View style={[styles.attDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.attLabel, { color: theme.text }]}>
          {label} · {people.length}
        </Text>
      </View>
      <View style={styles.attAvatars}>
        {people.map((p) => (
          <View key={p.usuarioId} style={styles.attChip}>
            <UserAvatar uri={p.fotoPerfil ?? undefined} nombre={p.nombreUsuario} size={26} />
            <Text style={[styles.attChipName, { color: theme.textSecondary }]} numberOfLines={1}>
              {p.nombreUsuario.split(' ')[0]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function GroupItineraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { idGrupo } = useLocalSearchParams<{ idGrupo: string }>();
  const groupId = Number(idGrupo);
  const validGroupId = Number.isNaN(groupId) ? null : groupId;
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const myId = user?.idUsuario;

  const {
    itinerary,
    isLoading,
    error,
    loadItinerary,
    proposeItem,
    updateItem,
    confirmItem,
    removeItem,
    toggleAttendance,
    isProposing,
    isUpdating,
    isConfirming,
    isDeleting,
  } = useGroupItineraryHook(validGroupId);

  const soyCreador = itinerary?.soyCreador ?? false;
  const busy = isProposing || isUpdating || isConfirming || isDeleting;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroupItineraryItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmActionId, setConfirmActionId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const weatherCoords = useMemo(() => {
    if (!itinerary) return null;
    return PROVINCIA_COORDS[itinerary.provincia as Provincia] ?? null;
  }, [itinerary]);

  const dias = useMemo(() => {
    if (!itinerary) return [];
    const total = Math.max(itinerary.duracionDias, ...itinerary.items.map((i) => i.dia), 1);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [itinerary]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItinerary();
    setRefreshing(false);
  };

  const openNew = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const openEdit = (item: GroupItineraryItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveActivity = async (values: ActivityFormValues) => {
    const request: GroupItineraryItemRequest = {
      nombreActividad: values.title,
      descripcion: values.description,
      localidad: values.location,
      direccion: values.location,
      dia: values.day,
      hora: values.time,
    };
    try {
      if (editingItem) {
        await updateItem(editingItem.id, request);
      } else {
        await proposeItem(request);
      }
      setModalVisible(false);
      setEditingItem(null);
    } catch {
      // el hook ya muestra el Alert de error
    }
  };

  const handleConfirm = async () => {
    if (confirmActionId !== null) {
      await confirmItem(confirmActionId);
      setConfirmActionId(null);
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      await removeItem(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const canEdit = (item: GroupItineraryItem) =>
    (item.estado === 'CONFIRMADO' && soyCreador) ||
    (item.estado === 'PROPUESTO' && item.propuestoPorId === myId);

  const canDelete = (item: GroupItineraryItem) =>
    soyCreador || (item.estado === 'PROPUESTO' && item.propuestoPorId === myId);

  const renderItem = (item: GroupItineraryItem, index: number) => {
    const van = item.asistencias.filter((a) => a.asiste === true);
    const noVan = item.asistencias.filter((a) => a.asiste === false);
    const sinResponder = item.asistencias.filter((a) => a.asiste === null);
    const esPropuesta = item.estado === 'PROPUESTO';

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(Math.min(index, 6) * 60).duration(280)}
        layout={LinearTransition.springify().damping(18)}
        style={[styles.card, { backgroundColor: theme.surface, borderColor: esPropuesta ? theme.primary : theme.border }]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            {item.hora ? (
              <View style={styles.horaRow}>
                <MaterialIcons name={icons.Schedule} size={14} color={theme.primary} />
                <Text style={[styles.hora, { color: theme.primary }]}>{formatHora(item.hora)}</Text>
              </View>
            ) : null}
            <Text style={[styles.actividad, { color: theme.text }]}>{item.nombreActividad}</Text>
          </View>
          {esPropuesta && (
            <View style={[styles.badge, { backgroundColor: theme.surfaceHighlight }]}>
              <MaterialIcons name={icons.Schedule} size={12} color={theme.primary} />
              <Text style={[styles.badgeText, { color: theme.primary }]}>Propuesta</Text>
            </View>
          )}
        </View>

        {item.localidad ? (
          <View style={styles.metaRow}>
            <MaterialIcons name={icons.Location} size={14} color={theme.textSecondary} />
            <Text style={[styles.localidad, { color: theme.textSecondary }]} numberOfLines={1}>
              {item.localidad}
            </Text>
          </View>
        ) : null}
        {item.descripcion ? (
          <Text style={[styles.descripcion, { color: theme.textSecondary }]}>{item.descripcion}</Text>
        ) : null}

        {esPropuesta && (
          <Text style={[styles.propuestaPor, { color: theme.textSecondary }]}>
            Propuesta por {item.nombrePropuestoPor}
          </Text>
        )}

        {/* Asistencia (solo actividades confirmadas) */}
        {!esPropuesta && (
          <View style={styles.attendanceBlock}>
            <View style={styles.attendanceButtons}>
              <Pressable
                onPress={() => toggleAttendance(item.id, true)}
                style={({ pressed }) => [
                  styles.attBtn,
                  {
                    backgroundColor: item.miAsistencia === true ? theme.lightgreen : theme.surfaceHighlight,
                    borderColor: item.miAsistencia === true ? theme.lightgreen : theme.border,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <MaterialIcons
                  name={icons.ThumbUp}
                  size={16}
                  color={item.miAsistencia === true ? theme.textInverse : theme.primary}
                />
                <Text style={[styles.attBtnText, { color: item.miAsistencia === true ? theme.textInverse : theme.primary }]}>
                  Voy
                </Text>
              </Pressable>
              <Pressable
                onPress={() => toggleAttendance(item.id, false)}
                style={({ pressed }) => [
                  styles.attBtn,
                  {
                    backgroundColor: item.miAsistencia === false ? theme.danger : theme.surfaceHighlight,
                    borderColor: item.miAsistencia === false ? theme.danger : theme.border,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <MaterialIcons
                  name={icons.ThumbUpOffAlt}
                  size={16}
                  color={item.miAsistencia === false ? theme.textInverse : theme.textSecondary}
                />
                <Text style={[styles.attBtnText, { color: item.miAsistencia === false ? theme.textInverse : theme.textSecondary }]}>
                  No voy
                </Text>
              </Pressable>
            </View>

            <View style={[styles.attLists, { borderTopColor: theme.border }]}>
              <AttendanceRow tone="green" label="Van" people={van} theme={theme} />
              <AttendanceRow tone="red" label="No van" people={noVan} theme={theme} />
              <AttendanceRow tone="neutral" label="Sin responder" people={sinResponder} theme={theme} />
            </View>
          </View>
        )}

        {/* Acciones */}
        {(canEdit(item) || canDelete(item) || (soyCreador && esPropuesta)) && (
          <View style={styles.actions}>
            {soyCreador && esPropuesta && (
              <Pressable
                onPress={() => setConfirmActionId(item.id)}
                disabled={busy}
                style={({ pressed }) => [styles.actionChip, { backgroundColor: theme.primary }, (pressed || busy) && { opacity: 0.7 }]}
              >
                <MaterialIcons name={icons.Check} size={16} color={theme.textInverse} />
                <Text style={[styles.actionChipText, { color: theme.textInverse }]}>Confirmar</Text>
              </Pressable>
            )}
            {canEdit(item) && (
              <Pressable
                onPress={() => openEdit(item)}
                disabled={busy}
                style={({ pressed }) => [styles.actionChip, { backgroundColor: theme.surfaceHighlight }, (pressed || busy) && { opacity: 0.7 }]}
              >
                <MaterialIcons name={icons.Edit} size={16} color={theme.primary} />
                <Text style={[styles.actionChipText, { color: theme.primary }]}>Editar</Text>
              </Pressable>
            )}
            {canDelete(item) && (
              <Pressable
                onPress={() => setConfirmDeleteId(item.id)}
                disabled={busy}
                style={({ pressed }) => [styles.actionChip, { backgroundColor: theme.surfaceHighlight }, (pressed || busy) && { opacity: 0.7 }]}
              >
                <MaterialIcons name={icons.Delete} size={16} color={theme.danger} />
                <Text style={[styles.actionChipText, { color: theme.danger }]}>
                  {soyCreador && esPropuesta ? 'Rechazar' : 'Eliminar'}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  const badgeForModal = editingItem
    ? editingItem.estado === 'PROPUESTO'
      ? { label: 'Propuesta', tone: 'proposed' as const }
      : { label: 'Confirmada', tone: 'confirmed' as const }
    : !soyCreador
      ? { label: 'Quedará como propuesta', tone: 'proposed' as const }
      : null;

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Itinerario del grupo" onThemeTogglePress={toggleColorScheme} />
        <FullScreenLoader />
      </View>
    );
  }

  if (error || !itinerary) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <Header title="Itinerario del grupo" showBackButton onBackPress={() => router.back()} onThemeTogglePress={toggleColorScheme} />
        <Animated.View entering={FadeIn.duration(300)} style={styles.centered}>
          <MaterialIcons name={icons.Poll} size={48} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Todavía no hay itinerario</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            El itinerario compartido se crea cuando el grupo finaliza una encuesta.
          </Text>
          <Pressable
            onPress={() => router.push(`/(tabs)/(group)/encuestas?idGrupo=${groupId}` as Href)}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && { opacity: 0.8 }]}
          >
            <Text style={[styles.primaryButtonText, { color: theme.textInverse }]}>Ir a las encuestas</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title={itinerary.titulo}
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        {itinerary.fotoPortada ? (
          <Animated.Image entering={FadeIn.duration(400)} source={{ uri: itinerary.fotoPortada }} style={styles.cover} />
        ) : null}

        {weatherCoords && (
          <WeatherStrip coords={weatherCoords} fechaInicio={itinerary.fechaInicio} fechaFin={itinerary.fechaFin} />
        )}

        {dias.map((dia) => {
          const items = itinerary.items
            .filter((i) => i.dia === dia)
            .sort((a, b) => (a.hora ?? '').localeCompare(b.hora ?? ''));
          return (
            <View key={dia} style={styles.daySection}>
              <Text style={[styles.dayTitle, { color: theme.text }]}>Día {dia}</Text>
              {items.length === 0 ? (
                <Text style={[styles.emptyDay, { color: theme.textSecondary }]}>Sin actividades aún.</Text>
              ) : (
                items.map(renderItem)
              )}
            </View>
          );
        })}

        <Pressable
          onPress={openNew}
          disabled={busy}
          style={({ pressed }) => [styles.proposeButton, { backgroundColor: theme.primary }, (pressed || busy) && { opacity: 0.85 }]}
        >
          <MaterialIcons name={icons.Add} size={20} color={theme.textInverse} />
          <Text style={[styles.proposeButtonText, { color: theme.textInverse }]}>
            {soyCreador ? 'Agregar actividad' : 'Proponer actividad'}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={false} onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
          <Header
            title={editingItem ? 'Editar actividad' : 'Proponer actividad'}
            showBackButton
            onBackPress={() => setModalVisible(false)}
            onThemeTogglePress={toggleColorScheme}
          />
          <EditActivityFormulary
            initialValues={
              editingItem
                ? {
                    title: editingItem.nombreActividad,
                    description: editingItem.descripcion || '',
                    time: editingItem.hora || '',
                    location: editingItem.localidad || '',
                    day: editingItem.dia,
                  }
                : { title: '', description: '', time: '', location: '', day: 1 }
            }
            duracionDias={itinerary.duracionDias}
            onSave={handleSaveActivity}
            onCancel={() => setModalVisible(false)}
            statusBadge={badgeForModal}
          />
        </View>
      </Modal>

      <ConfirmAlert
        visible={confirmActionId !== null}
        title="Confirmar actividad"
        message="Al confirmarla, todos los miembros van a poder marcar si asisten o no."
        cancelText="Cancelar"
        confirmText="Confirmar"
        loading={isConfirming}
        onCancel={() => setConfirmActionId(null)}
        onConfirm={handleConfirm}
      />

      <ConfirmAlert
        visible={confirmDeleteId !== null}
        title="Eliminar actividad"
        message="¿Seguro que querés eliminar esta actividad del itinerario del grupo?"
        cancelText="Cancelar"
        confirmText="Eliminar"
        loading={isDeleting}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: paddings.spacing.lg, gap: paddings.spacing.md },
  scroll: { padding: paddings.spacing.lg, paddingBottom: paddings.spacing.xxxl },
  cover: { width: '100%', height: 160, borderRadius: paddings.radius.md, marginBottom: paddings.spacing.lg },
  daySection: { marginBottom: paddings.spacing.lg },
  dayTitle: { fontFamily: fonts.family.headingBold, fontSize: fonts.size.lg, marginBottom: paddings.spacing.sm },
  emptyDay: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.sm, marginBottom: paddings.spacing.sm },
  card: { borderRadius: paddings.radius.md, borderWidth: 1, padding: paddings.spacing.md, marginBottom: paddings.spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardHeaderLeft: { flex: 1 },
  horaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hora: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.sm },
  actividad: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.md, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  localidad: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.sm, flex: 1 },
  descripcion: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.sm, marginTop: 4 },
  propuestaPor: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.xs, marginTop: 6, fontStyle: 'italic' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: paddings.radius.sm },
  badgeText: { fontFamily: fonts.family.bodySemiBold, fontSize: fonts.size.xs },
  attendanceBlock: { marginTop: paddings.spacing.md, gap: paddings.spacing.sm },
  attendanceButtons: { flexDirection: 'row', gap: paddings.spacing.sm },
  attBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: paddings.radius.sm, borderWidth: 1 },
  attBtnText: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.sm },
  attLists: { borderTopWidth: 1, paddingTop: paddings.spacing.sm, gap: paddings.spacing.sm },
  attRow: { gap: 6 },
  attRowHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  attDot: { width: 8, height: 8, borderRadius: 4 },
  attLabel: { fontFamily: fonts.family.bodySemiBold, fontSize: fonts.size.xs },
  attAvatars: { flexDirection: 'row', flexWrap: 'wrap', gap: paddings.spacing.sm, paddingLeft: 14 },
  attChip: { alignItems: 'center', width: 44, gap: 2 },
  attChipName: { fontSize: 10, fontFamily: fonts.family.bodyRegular, maxWidth: 44, textAlign: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: paddings.spacing.sm, marginTop: paddings.spacing.md },
  actionChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, height: 34, borderRadius: paddings.radius.sm },
  actionChipText: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.sm },
  proposeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: paddings.radius.md, marginTop: paddings.spacing.md },
  proposeButtonText: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.md },
  emptyTitle: { fontFamily: fonts.family.headingBold, fontSize: fonts.size.lg, textAlign: 'center' },
  emptyText: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.md, textAlign: 'center' },
  primaryButton: { paddingHorizontal: 24, height: 48, borderRadius: paddings.radius.md, justifyContent: 'center', marginTop: paddings.spacing.sm },
  primaryButtonText: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.md },
});
