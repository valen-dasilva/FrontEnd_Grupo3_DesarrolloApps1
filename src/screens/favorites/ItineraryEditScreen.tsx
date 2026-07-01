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
import { useItinerariosDetailsHook } from '@/hooks/useItinerarios';
import { FotoItinerarioUsuario, ItemItinerarioUsuario } from '@/services/itinerariosService';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
import { SingleDateModal } from '@/components/common/SingleDateModal/SingleDateModal';
import { StatusModal } from '@/components/common/StatusModal/StatusModal';
import {
  ItineraryPhotoPicker,
  SelectedItineraryPhoto,
} from '@/components/favorites/itinerary_photos/ItineraryPhotoPicker/ItineraryPhotoPicker';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/services/api';
import {
  deleteItineraryPhotoFromStorage,
  uploadItineraryPhoto,
} from '@/services/itineraryPhotoService';
import { formatFecha } from '@/utils/dateUtils';
import Toast from 'react-native-toast-message';
import { LoadingOverlay } from '@/components/common/LoadingOverlay/LoadingOverlay';

type DaySectionProps = Readonly<{
  dayNum: number;
  activities: readonly ItemItinerarioUsuario[];
  onEdit: (activity: ItemItinerarioUsuario) => void;
  onDelete: (id: number, title: string) => void;
  theme: typeof colors.light;
}>;

function DaySection({ dayNum, activities, onEdit, onDelete, theme }: DaySectionProps) {
  const dayActivities = activities.filter((act) => act.dia === dayNum);
  return (
    <View style={styles.daySection}>
      <Text style={[styles.dayTitle, { color: theme.textSecondary }]}>{`Día ${dayNum}`}</Text>
      <View style={styles.activityList}>
        {dayActivities.length > 0 ? (
          dayActivities.map((activity, actIdx) => (
            <EditableActivityCard
              key={activity.id != null ? `${dayNum}-${activity.id}` : `${dayNum}-fallback-${actIdx}`}
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
      putItineraryTitle,
      putItineraryFechaInicio,
      addPhoto,
      quitPhoto,
      isMutatingPhotos,
  } = useItinerariosDetailsHook();

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
  const [pendingPhotos, setPendingPhotos] = useState<SelectedItineraryPhoto[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const [photoDeleteTarget, setPhotoDeleteTarget] = useState<FotoItinerarioUsuario | null>(null);
  const [showFechaModal, setShowFechaModal] = useState(false);
  const [fechaModal, setFechaModal] = useState<{ visible: boolean; state: 'loading' | 'success' }>({
    visible: false,
    state: 'loading',
  });
  const [isDeletingActivity, setIsDeletingActivity] = useState(false);

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

  const handleUploadPhotos = async () => {
    if (!user || !id || pendingPhotos.length === 0) return;

    let uploadedCount = 0;
    setIsUploadingPhotos(true);
    try {
      for (const photo of pendingPhotos) {
        let uploadedUrl: string;
        try {
          const uploaded = await uploadItineraryPhoto(user.idUsuario, photo);
          uploadedUrl = uploaded.url;
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'No se pudo subir una foto',
            text2: error instanceof Error ? error.message : 'Revisá tu conexión e intentá nuevamente.',
          });
          break;
        }

        try {
          await addPhoto(Number(id), uploadedUrl);
          uploadedCount += 1;
          setPendingPhotos((current) => current.filter((item) => item.key !== photo.key));
        } catch (error) {
          if (error instanceof ApiError && error.status > 0) {
            await deleteItineraryPhotoFromStorage(uploadedUrl).catch(console.warn);
          }
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
      // Solo borramos el registro en DB. El archivo en Storage queda como
      // huérfano y se limpia cuando se elimina el itinerario completo
      // (deleteMutation en useItinerarios). Evita parsear URL→path acá.
      await quitPhoto(Number(id), photoDeleteTarget.id);
      Toast.show({
        type: 'success',
        text1: 'Foto eliminada',
        text2: 'La foto se quitó del itinerario.',
      });
    } catch {
      // El hook informa el error y conserva la foto en pantalla.
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
    setFechaModal({ visible: true, state: 'loading' });
    try {
      await putItineraryFechaInicio(Number(id), fecha);
      setFechaModal({ visible: true, state: 'success' });
    } catch {
      setFechaModal({ visible: false, state: 'loading' });
    }
  };

  const totalDias = Math.max(itineraryDetails?.duracionDias ?? 1, 1);
  const days = Array.from({ length: totalDias }, (_, i) => i + 1);
  const existingPhotos = itineraryDetails?.fotos ?? [];
  const isManagingPhotos = isUploadingPhotos || isMutatingPhotos || isDeletingPhoto;

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
        loading={isDeletingActivity}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setIsDeletingActivity(true);
            await quitItem(Number(id), deleteTarget.id);
            setDeleteTarget(null);
          } finally {
            setIsDeletingActivity(false);
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

      <SingleDateModal
        visible={showFechaModal}
        initialDate={itineraryDetails?.fechaInicio}
        title="Inicio del viaje"
        confirmLabel="Guardar fecha"
        onClose={() => setShowFechaModal(false)}
        onConfirm={handleChangeFechaInicio}
      />

      <StatusModal
        visible={fechaModal.visible}
        state={fechaModal.state}
        title={fechaModal.state === 'loading' ? 'Actualizando fecha...' : '¡Fecha actualizada!'}
        message={fechaModal.state === 'loading'
          ? 'Estamos reprogramando tu itinerario.'
          : 'El viaje quedó reprogramado correctamente.'}
        actionLabel="Listo"
        onAction={() => setFechaModal({ visible: false, state: 'loading' })}
      />

      <LoadingOverlay
        visible={isUploadingPhotos}
        message="Subiendo fotos..."
      />
    </View>
  );
}
