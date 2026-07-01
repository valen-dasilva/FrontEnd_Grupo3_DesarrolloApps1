import { Stack, useFocusEffect, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Header } from '@/components/common/Header/Header';
import { FullScreenLoader } from '@/components/common/FullScreenLoader/FullScreenLoader';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import {
  ActivityFormValues,
  EditActivityFormulary,
} from '@/components/favorites/editActivityFormulary/EditActivityFormulary';
import { useGroupItineraryHook } from '@/hooks/useGroupItinerary';
import { useGroupDetailsHook } from '@/hooks/useGroups';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useColorScheme';
import { formatHora } from '@/utils/dateUtils';
import { GroupItineraryItem, GroupItineraryItemRequest } from '@/types/itinerarioGrupo';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

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

  const { group } = useGroupDetailsHook(validGroupId);
  const soyCreador = group?.soyCreador ?? false;

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
  } = useGroupItineraryHook(validGroupId);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroupItineraryItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadItinerary();
    }, [loadItinerary]),
  );

  const dias = useMemo(() => {
    if (!itinerary) return [];
    const total = Math.max(itinerary.duracionDias, ...itinerary.items.map((i) => i.dia), 1);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [itinerary]);

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

  const confirmDelete = async () => {
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

  const renderItem = (item: GroupItineraryItem) => {
    const van = item.asistencias.filter((a) => a.asiste === true);
    const noVan = item.asistencias.filter((a) => a.asiste === false);
    const sinResponder = item.asistencias.filter((a) => a.asiste === null);
    const esPropuesta = item.estado === 'PROPUESTO';

    return (
      <View
        key={item.id}
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            {item.hora ? (
              <Text style={[styles.hora, { color: theme.primary }]}>{formatHora(item.hora)}</Text>
            ) : null}
            <Text style={[styles.actividad, { color: theme.text }]}>{item.nombreActividad}</Text>
          </View>
          {esPropuesta && (
            <View style={[styles.badge, { backgroundColor: theme.surfaceHighlight }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>Propuesta</Text>
            </View>
          )}
        </View>

        {item.localidad ? (
          <Text style={[styles.localidad, { color: theme.textSecondary }]}>{item.localidad}</Text>
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
                <Text
                  style={[
                    styles.attBtnText,
                    { color: item.miAsistencia === true ? theme.textInverse : theme.primary },
                  ]}
                >
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
                <Text
                  style={[
                    styles.attBtnText,
                    { color: item.miAsistencia === false ? theme.textInverse : theme.textSecondary },
                  ]}
                >
                  No voy
                </Text>
              </Pressable>
            </View>
            <Text style={[styles.attCounts, { color: theme.textSecondary }]}>
              {van.length} {van.length === 1 ? 'va' : 'van'} · {noVan.length} no · {sinResponder.length} sin responder
            </Text>
            {van.length > 0 && (
              <Text style={[styles.attNames, { color: theme.textSecondary }]} numberOfLines={2}>
                Van: {van.map((a) => a.nombreUsuario).join(', ')}
              </Text>
            )}
          </View>
        )}

        {/* Acciones */}
        <View style={styles.actions}>
          {soyCreador && esPropuesta && (
            <Pressable
              onPress={() => confirmItem(item.id)}
              style={({ pressed }) => [styles.actionChip, { backgroundColor: theme.primary }, pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons name={icons.Check} size={16} color={theme.textInverse} />
              <Text style={[styles.actionChipText, { color: theme.textInverse }]}>Confirmar</Text>
            </Pressable>
          )}
          {canEdit(item) && (
            <Pressable
              onPress={() => openEdit(item)}
              style={({ pressed }) => [styles.actionChip, { backgroundColor: theme.surfaceHighlight }, pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons name={icons.Edit} size={16} color={theme.primary} />
              <Text style={[styles.actionChipText, { color: theme.primary }]}>Editar</Text>
            </Pressable>
          )}
          {canDelete(item) && (
            <Pressable
              onPress={() => setConfirmDeleteId(item.id)}
              style={({ pressed }) => [styles.actionChip, { backgroundColor: theme.surfaceHighlight }, pressed && { opacity: 0.8 }]}
            >
              <MaterialIcons name={icons.Delete} size={16} color={theme.danger} />
              <Text style={[styles.actionChipText, { color: theme.danger }]}>
                {soyCreador && esPropuesta ? 'Rechazar' : 'Eliminar'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
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
        <View style={styles.centered}>
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
        </View>
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

      <ScrollView contentContainerStyle={styles.scroll}>
        {itinerary.fotoPortada ? (
          <Image source={{ uri: itinerary.fotoPortada }} style={styles.cover} />
        ) : null}

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
          style={({ pressed }) => [styles.proposeButton, { backgroundColor: theme.primary }, pressed && { opacity: 0.85 }]}
        >
          <MaterialIcons name={icons.Add} size={20} color={theme.textInverse} />
          <Text style={[styles.proposeButtonText, { color: theme.textInverse }]}>
            {soyCreador ? 'Agregar actividad' : 'Proponer actividad'}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
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
        visible={confirmDeleteId !== null}
        title="Eliminar actividad"
        message="¿Seguro que querés eliminar esta actividad del itinerario del grupo?"
        cancelText="Cancelar"
        confirmText="Eliminar"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
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
  hora: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.sm },
  actividad: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.md, marginTop: 2 },
  localidad: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.sm, marginTop: 2 },
  descripcion: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.sm, marginTop: 4 },
  propuestaPor: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.xs, marginTop: 6, fontStyle: 'italic' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: paddings.radius.sm },
  badgeText: { fontFamily: fonts.family.bodySemiBold, fontSize: fonts.size.xs },
  attendanceBlock: { marginTop: paddings.spacing.md, gap: 6 },
  attendanceButtons: { flexDirection: 'row', gap: paddings.spacing.sm },
  attBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: paddings.radius.sm, borderWidth: 1 },
  attBtnText: { fontFamily: fonts.family.headingMedium, fontSize: fonts.size.sm },
  attCounts: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.xs },
  attNames: { fontFamily: fonts.family.bodyRegular, fontSize: fonts.size.xs },
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
