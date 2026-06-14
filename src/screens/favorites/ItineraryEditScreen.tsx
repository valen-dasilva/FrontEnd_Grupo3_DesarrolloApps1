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
import { useFavoritosDetailsHook } from '@/hooks/useFavoritos';
import { ItemItinerarioUsuario } from '@/services/favoritosService';
import { ConfirmAlert } from '@/components/common/ConfirmAlert/ConfirmAlert';

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

  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const {
      loadItineraryInfo,
      itineraryDetails,
      isLoading,
      quitItem
  } = useFavoritosDetailsHook();

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

  const handleGoBack = () => {
    router.back();
  };

  const days = Array.from(new Set(activities.map((act) => act.dia))).sort((a, b) => a - b);
  if (days.length === 0) days.push(1);

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
                  <CustomInput value={title} onChangeText={setTitle} label="Título del Itinerario" />
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
    </View>
  );
}
