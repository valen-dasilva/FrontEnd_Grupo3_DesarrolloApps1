import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, StatusBar, Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { EditableActivityCard } from '@/components/favorites/itinerary_edit/EditableActivityCard/EditableActivityCard';
import { CustomButton } from '@/components/CustomButton';
import { CreateActivityCard } from '@/components/favorites/itinerary_edit/CreateActivityCard/CreateActivityCard';
import { CustomInput } from '@/components/CustomInput';
import { colors } from '@/constants/colors';
import { styles } from './ItineraryEditScreen.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { useItinerariosDetailsHook } from '@/hooks/useItinerarios';
import { FotoItinerarioUsuario, ItemItinerarioUsuario } from '@/services/itinerariosService';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';
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
import Toast from 'react-native-toast-message';

type DaySectionProps = Readonly<{
  dayNum: number;
  activities: readonly ItemItinerarioUsuario[];
  onEdit: (activity: ItemItinerarioUsuario) => void;
  onDelete: (id: number, title: string) => void;
  onAdd: (dayNum: number) => void;
  theme: typeof colors.light;
}>;

function DaySection({ dayNum, activities, onEdit, onDelete, onAdd, theme }: DaySectionProps) {
  const dayActivities = activities.filter((act) => act.dia === dayNum);
  return (
    <View style={styles.daySection}>
      <Text style={[styles.dayTitle, { color: theme.textSecondary }]}>{`Día ${dayNum}`}</Text>
      <View style={styles.activityList}>
        {dayActivities.map((activity) => (
          <EditableActivityCard
            key={activity.id}
            time={activity.hora}
            title={activity.nombreActividad}
            description={activity.descripcion}
            location={activity.direccion || activity.localidad}
            onEditPress={() => onEdit(activity)}
            onDeletePress={() => onDelete(activity.id, activity.nombreActividad)}
          />
        ))}
        <CreateActivityCard onPress={() => onAdd(dayNum)} />
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
  const [photoDeleteTarget, setPhotoDeleteTarget] = useState<FotoItinerarioUsuario | null>(null);

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

  const handleAddActivity = (dayNum: number) => {
    router.push({
      pathname: '/(tabs)/(favorite)/editActivityFormulary',
      params: {
        idItinerario: id,
        day: String(dayNum),
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

    const target = photoDeleteTarget;
    try {
      await quitPhoto(Number(id), target.id);
      try {
        await deleteItineraryPhotoFromStorage(target.url);
      } catch (error) {
        console.warn('No se pudo limpiar la foto de Storage:', error);
        Toast.show({
          type: 'info',
          text1: 'Foto eliminada',
          text2: 'La imagen se quitó del itinerario, pero su limpieza quedó pendiente.',
        });
      }
    } finally {
      setPhotoDeleteTarget(null);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const days = Array.from(new Set(activities.map((act) => act.dia))).sort((a, b) => a - b);
  if (days.length === 0) days.push(1);
  const existingPhotos = itineraryDetails?.fotos ?? [];
  const isManagingPhotos = isUploadingPhotos || isMutatingPhotos;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Editar Itinerario"
        showBackButton={true}
        onBackPress={() => router.back()}
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
                        if (itineraryDetails && title !== itineraryDetails.titulo) {
                            putItineraryTitle(Number(id), title);
                        }
                    }}
                  />
                </View>

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
                    onAdd={handleAddActivity}
                    theme={theme}
                  />
                ))}

                {activities.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                      No hay actividades en este itinerario.
                    </Text>
                    <CreateActivityCard onPress={() => handleAddActivity(1)} />
                  </View>
                )}

                <View style={styles.buttonWrapper}>
                  <CustomButton title="Volver a Detalles" onPress={handleGoBack} />
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
        visible={photoDeleteTarget !== null}
        title="Eliminar Foto"
        message="¿Estás seguro de que deseas eliminar esta foto del itinerario?"
        confirmText="Eliminar"
        onCancel={() => setPhotoDeleteTarget(null)}
        onConfirm={handleDeletePhoto}
      />
    </View>
  );
}
