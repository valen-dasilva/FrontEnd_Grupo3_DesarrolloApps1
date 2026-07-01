import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, StatusBar, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '@/components/common/Header/Header';
import { EditableActivityCard } from '@/components/favorites/itinerary_edit/EditableActivityCard/EditableActivityCard';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { colors } from '@/constants/colors';
import { styles } from './ItineraryEditScreen.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { useItinerariosDetailsHook, useItinerariosHook } from '@/hooks/useItinerarios';
import { FotoItinerarioUsuario, ItemItinerarioUsuario } from '@/services/itinerariosService';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { SingleDateModal } from '@/components/common/SingleDateModal/SingleDateModal';
import { StatusModal } from '@/components/common/StatusModal/StatusModal';
import {
  ItineraryPhotoPicker,
  SelectedItineraryPhoto,
} from '@/components/favorites/itinerary_photos/ItineraryPhotoPicker/ItineraryPhotoPicker';
import { useAuth } from '@/context/AuthContext';
import {
  deleteItineraryPhotoFromStorage,
  uploadItineraryPhoto,
} from '@/services/itineraryPhotoService';
import { formatFecha } from '@/utils/dateUtils';
import Toast from 'react-native-toast-message';

type DaySectionProps = Readonly<{
  dayNum: number;
  activities: readonly ItemItinerarioUsuario[];
  onEdit: (activity: ItemItinerarioUsuario) => void;
  onDelete: (id: number, title: string) => void;
  onDeleteDay: (dayNum: number) => void;
  theme: typeof colors.light;
}>;

function DaySection({ dayNum, activities, onEdit, onDelete, onDeleteDay, theme }: DaySectionProps) {
  const dayActivities = activities.filter((act) => act.dia === dayNum);
  return (
    <View style={styles.daySection}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.dayTitle, { color: theme.textSecondary }]}>{`Día ${dayNum}`}</Text>
        <TouchableOpacity
          onPress={() => onDeleteDay(dayNum)}
          style={{ padding: 4 }}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar Día ${dayNum}`}
        >
          <MaterialIcons name="delete" size={20} color={theme.danger} />
        </TouchableOpacity>
      </View>
      <View style={styles.activityList}>
        {dayActivities.length > 0 ? (
          dayActivities.map((activity, actIdx) => (
            <EditableActivityCard
              key={activity.id == null ? `${dayNum}-fallback-${actIdx}` : `${dayNum}-${activity.id}`}
              time={activity.hora}
              title={activity.nombreActividad}
              description={activity.descripcion}
              location={activity.direccion || activity.localidad}
              onEditPress={() => onEdit(activity)}
              onDeletePress={() => onDelete(activity.id, activity.nombreActividad)}
            />
          ))
        ) : (
          <Text style={[styles.emptyDayText, { color: theme.textSecondary }]}>
            Sin actividades todavía
          </Text>
        )}
      </View>
    </View>
  );
}

export default function EdicionItinerarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const {
      loadItineraryInfo,
      itineraryDetails,
      isLoading,
      quitItem,
      editItem,
      putItineraryTitle,
      putItineraryFechaInicio,
      addPhoto,
      quitPhoto,
      isMutatingPhotos,
      reduceItineraryDuration,
  } = useItinerariosDetailsHook();

  const { quitItinerary } = useItinerariosHook();

  useFocusEffect(
    useCallback(() => {
        if (id) {
            loadItineraryInfo(Number(id));
        }
    }, [id, loadItineraryInfo])
  );

  const activities = itineraryDetails?.items || [];
  const [title, setTitle] = useState(itineraryDetails?.titulo || 'Cargando...');
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [deleteDayTarget, setDeleteDayTarget] = useState<number | null>(null);
  const [pendingPhotos, setPendingPhotos] = useState<SelectedItineraryPhoto[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const [photoDeleteTarget, setPhotoDeleteTarget] = useState<FotoItinerarioUsuario | null>(null);
  const [showFechaModal, setShowFechaModal] = useState(false);
  const [statusModal, setStatusModal] = useState<{ visible: boolean; state: 'loading' | 'success'; type: 'fecha' | 'deleteDay' }>({
    visible: false,
    state: 'loading',
    type: 'fecha'
  });

  const [showDeleteItineraryAlert, setShowDeleteItineraryAlert] = useState(false);
  
  React.useEffect(() => {
      if (itineraryDetails) {
          setTitle(itineraryDetails.titulo);
      }
  }, [itineraryDetails]);

  const handleEditActivity = (activity: ItemItinerarioUsuario) => {
    router.push({
      pathname: '/(tabs)/(favorite)/editActivityFormulary',
      params: {
        idItinerario: id,
        idItem: String(activity.id),
        day: String(activity.dia),
        time: activity.hora,
        title: activity.nombreActividad,
        description: activity.descripcion,
        location: activity.direccion || activity.localidad,
        duracionDias: String(itineraryDetails?.duracionDias || 1),
      },
    });
  };

  const handleDeleteActivity = (idItem: number, activityTitle: string) => {
    setDeleteTarget({ id: idItem, title: activityTitle });
  };

  const handleDeleteDay = async (dayNum: number) => {
    if (totalDias === 1) {
      setShowDeleteItineraryAlert(true);
      return;
    }
    const dayActivities = activities.filter(act => act.dia === dayNum);
    if (dayActivities.length > 0) {
      setDeleteDayTarget(dayNum);
    } else {
      await processDeleteDay(dayNum);
    }
  };

  const processDeleteDay = async (dayNum: number) => {
    if (!id) return;
    setStatusModal({ visible: true, state: 'loading', type: 'deleteDay' });
    try {
      const activitiesToDelete = activities.filter(act => act.dia === dayNum);
      const activitiesToMove = activities.filter(act => act.dia > dayNum);

      if (activitiesToDelete.length > 0) {
        await Promise.allSettled(activitiesToDelete.map(act => quitItem(Number(id), act.id)));
      }

      if (activitiesToMove.length > 0) {
        await Promise.allSettled(activitiesToMove.map(act => 
          editItem(Number(id), act.id, {
            nombreActividad: act.nombreActividad,
            descripcion: act.descripcion,
            localidad: act.localidad,
            direccion: act.direccion,
            dia: act.dia - 1,
            hora: act.hora
          })
        ));
      }

      await reduceItineraryDuration(Number(id));

      setStatusModal({ visible: false, state: 'success', type: 'deleteDay' });
      Toast.show({
        type: 'success',
        text1: 'Día eliminado',
        text2: `El Día ${dayNum} fue eliminado correctamente.`,
      });
    } catch (err) {
      console.error('Error al procesar eliminación del día:', err);
      setStatusModal({ visible: false, state: 'loading', type: 'deleteDay' });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo eliminar el día por completo.',
      });
    } finally {
      setDeleteDayTarget(null);
    }
  };

  // Botón único a nivel itinerario: abre el formulario sin un día prefijado.
  // Ahí el usuario elige un día existente o crea uno nuevo (lo pidió la
  // cátedra: que agregar actividad no quede atado a un día puntual).
  const handleAddActivity = () => {
    router.push({
      pathname: '/(tabs)/(favorite)/editActivityFormulary',
      params: {
        idItinerario: id,
        day: '',
        time: '',
        title: '',
        description: '',
        location: '',
        duracionDias: String(itineraryDetails?.duracionDias || 1),
      },
    });
  };

  const processSinglePhotoUpload = async (photo: SelectedItineraryPhoto) => {
    let uploadedUrl: string | null = null;
    try {
      const uploaded = await uploadItineraryPhoto(user!.idUsuario, photo);
      uploadedUrl = uploaded.url;
      await addPhoto(Number(id), uploadedUrl);
      return true;
    } catch (error) {
      if (uploadedUrl) {
        await deleteItineraryPhotoFromStorage(uploadedUrl).catch(console.warn);
      }
      throw error;
    }
  };

  const handleUploadPhotos = async () => {
    if (!user || !id || pendingPhotos.length === 0) return;

    let uploadedCount = 0;
    setIsUploadingPhotos(true);
    try {
      for (const photo of pendingPhotos) {
        try {
          await processSinglePhotoUpload(photo);
          uploadedCount += 1;
          setPendingPhotos((current) => current.filter((item) => item.key !== photo.key));
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'No se pudo subir una foto',
            text2: error instanceof Error ? error.message : 'Revisá tu conexión e intentá nuevamente.',
          });
          break;
        }
      }

      if (uploadedCount > 0) {
        Toast.show({
          type: 'success',
          text1: uploadedCount === 1 ? 'Foto agregada' : 'Fotos agregadas',
          text2: `${uploadedCount} ${uploadedCount === 1 ? 'foto se guardó' : 'fotos se guardaron'} correctamente.`,
        });
      }
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoDeleteTarget || !id) return;

    setIsDeletingPhoto(true);
    try {
      await quitPhoto(Number(id), photoDeleteTarget.id);
      Toast.show({
        type: 'success',
        text1: 'Foto eliminada',
        text2: 'La foto se quitó del itinerario.',
      });
    } catch (err) {
      console.error('Error al eliminar foto:', err);
    } finally {
      setIsDeletingPhoto(false);
      setPhotoDeleteTarget(null);
    }
  };

  // Guarda el título si quedó pendiente. El onBlur del input ya lo guarda,
  // pero si el usuario toca "Guardar y salir" con el campo enfocado el blur
  // puede no haber disparado: este es el respaldo.
  const guardarTituloPendiente = async () => {
    if (id && itineraryDetails && title.trim() && title.trim() !== itineraryDetails.titulo) {
      await putItineraryTitle(Number(id), title.trim());
    }
  };

  const goToDetalle = () => {
    if (!id) return;
    router.replace({
      pathname: '/(tabs)/(favorite)/itinerarioInfoFav',
      params: { id },
    });
  };

  const handleGoBack = async () => {
    await guardarTituloPendiente();
    goToDetalle();
  };

  const handleGuardarYSalir = async () => {
    await guardarTituloPendiente();
    Toast.show({
      type: 'success',
      text1: 'Cambios guardados',
      text2: 'Tu itinerario quedó actualizado.',
    });
    goToDetalle();
  };

  const handleChangeFechaInicio = async (fecha: string) => {
    if (!id) return;
    setStatusModal({ visible: true, state: 'loading', type: 'fecha' });
    try {
      await putItineraryFechaInicio(Number(id), fecha);
      setStatusModal({ visible: true, state: 'success', type: 'fecha' });
    } catch {
      setStatusModal({ visible: false, state: 'loading', type: 'fecha' });
    }
  };

  const totalDias = Math.max(itineraryDetails?.duracionDias ?? 1, 1);
  const days = Array.from({ length: totalDias }, (_, i) => i + 1);
  const existingPhotos = itineraryDetails?.fotos ?? [];
  const isManagingPhotos = isUploadingPhotos || isMutatingPhotos || isDeletingPhoto;

  const getStatusModalTitle = () => {
    if (statusModal.state === 'loading') {
      return statusModal.type === 'fecha' ? 'Actualizando fecha...' : 'Eliminando día...';
    }
    return statusModal.type === 'fecha' ? '¡Fecha actualizada!' : '¡Día eliminado!';
  };

  const getStatusModalMessage = () => {
    if (statusModal.state === 'loading') {
      return statusModal.type === 'fecha' ? 'Estamos reprogramando tu itinerario.' : 'Eliminando actividades y reordenando tu viaje...';
    }
    return statusModal.type === 'fecha' ? 'El viaje quedó reprogramado correctamente.' : 'El día fue eliminado correctamente.';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Editar Itinerario"
        showBackButton={true}
        onBackPress={handleGoBack}
        onThemeTogglePress={toggleColorScheme}
        onAvatarPress={() => router.push('/(tabs)/perfil')}
      />

      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !itineraryDetails ? (
           <ActivityIndicator size="large" color={theme.text} style={styles.loader} />
        ) : (
            <>
                <View style={styles.titleInputWrapper}>
                  <CustomInput
                    value={title}
                    onChangeText={setTitle}
                    label="Título del Itinerario"
                    onBlur={() => {
                        if (itineraryDetails && title.trim() && title.trim() !== itineraryDetails.titulo) {
                            putItineraryTitle(Number(id), title.trim());
                        }
                    }}
                  />
                </View>

                {itineraryDetails && (
                  <View style={styles.fechaWrapper}>
                    <TouchableOpacity
                      style={[styles.fechaField, { backgroundColor: theme.surface, borderColor: theme.border }]}
                      onPress={() => setShowFechaModal(true)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="event" size={22} color={theme.primary} />
                      <View style={styles.fechaFieldText}>
                        <Text style={[styles.fechaFieldLabel, { color: theme.textSecondary }]}>
                          Inicio del viaje
                        </Text>
                        <Text style={[styles.fechaFieldValue, { color: theme.text }]}>
                          {itineraryDetails.fechaInicio ? formatFecha(itineraryDetails.fechaInicio) : 'Elegir fecha'}
                        </Text>
                      </View>
                      <View style={[styles.fechaDuration, { backgroundColor: theme.surfaceNeutral }]}>
                        <Text style={[styles.fechaDurationText, { color: theme.textSecondary }]}>
                          {totalDias} {totalDias === 1 ? 'día' : 'días'}
                        </Text>
                      </View>
                      <MaterialIcons name="edit" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.photoSection}>
                  <ItineraryPhotoPicker
                    photos={pendingPhotos}
                    onChange={setPendingPhotos}
                    existingPhotos={existingPhotos}
                    onRemoveExisting={setPhotoDeleteTarget}
                    disabled={isManagingPhotos}
                  />
                  {pendingPhotos.length > 0 && (
                    <CustomButton
                      title={isUploadingPhotos ? 'Subiendo fotos...' : 'Guardar fotos seleccionadas'}
                      onPress={handleUploadPhotos}
                      disabled={isManagingPhotos}
                    />
                  )}
                </View>

                {days.map((dayNum) => (
                  <DaySection
                    key={`day-${dayNum}`}
                    dayNum={dayNum}
                    activities={activities}
                    onEdit={handleEditActivity}
                    onDelete={handleDeleteActivity}
                    onDeleteDay={handleDeleteDay}
                    theme={theme}
                  />
                ))}

                <View style={styles.addActivityWrapper}>
                  <TouchableOpacity
                    style={[styles.addActivityButton, { borderColor: theme.primary }]}
                    onPress={handleAddActivity}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                  >
                    <MaterialIcons name="add" size={20} color={theme.primary} />
                    <Text style={[styles.addActivityText, { color: theme.primary }]}>
                      Agregar actividad
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonWrapper}>
                  <CustomButton title="Guardar y salir" onPress={handleGuardarYSalir} />
                </View>
            </>
        )}
      </ScrollView>

      <ConfirmAlert
        visible={deleteTarget !== null}
        title="Eliminar Actividad"
        message={`¿Estás seguro de que deseas eliminar la actividad "${deleteTarget?.title}"?`}
        confirmText="Eliminar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await quitItem(Number(id), deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />

      <ConfirmAlert
        visible={deleteDayTarget !== null}
        title="Eliminar Día"
        message={`¿Estás seguro de que deseas eliminar el Día ${deleteDayTarget}? Todas las actividades asociadas se perderán y los días posteriores se reajustarán.`}
        confirmText="Eliminar Día"
        onCancel={() => setDeleteDayTarget(null)}
        onConfirm={async () => {
          if (deleteDayTarget !== null) {
            await processDeleteDay(deleteDayTarget);
          }
        }}
      />

      <ConfirmAlert
        visible={photoDeleteTarget !== null}
        title="Eliminar Foto"
        message="¿Estás seguro de que deseas eliminar esta foto del itinerario?"
        confirmText="Eliminar"
        loading={isDeletingPhoto}
        onCancel={() => setPhotoDeleteTarget(null)}
        onConfirm={handleDeletePhoto}
      />

      <ConfirmAlert
        visible={showDeleteItineraryAlert}
        title="¿Eliminar itinerario?"
        message="No pueden haber itinerarios sin días. ¿Quieres eliminar el itinerario completo?"
        confirmText="Sí"
        cancelText="No"
        onCancel={() => setShowDeleteItineraryAlert(false)}
        onConfirm={async () => {
          setShowDeleteItineraryAlert(false);
          if (id) {
            try {
              await quitItinerary(Number(id));
              Toast.show({
                type: 'success',
                text1: 'Itinerario eliminado',
                text2: 'El itinerario fue eliminado por completo.',
              });
              router.replace('/(tabs)/favoritos');
            } catch (err) {
              console.error('Error al eliminar itinerario completo:', err);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo eliminar el itinerario.',
              });
            }
          }
        }}
      />

      <SingleDateModal
        visible={showFechaModal}
        initialDate={itineraryDetails?.fechaInicio}
        title="Inicio del viaje"
        confirmLabel="Guardar fecha"
        onClose={() => setShowFechaModal(false)}
        onConfirm={handleChangeFechaInicio}
      />

      <StatusModal
        visible={statusModal.visible}
        state={statusModal.state}
        title={getStatusModalTitle()}
        message={getStatusModalMessage()}
        actionLabel="Listo"
        onAction={() => setStatusModal({ ...statusModal, visible: false })}
      />
    </View>
  );
}
