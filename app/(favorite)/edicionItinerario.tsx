import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header/Header';
import { ActivityCard } from '../../components/favorites_components/itinerary_edit/ActivityCard/ActivityCard';
import { Button } from '../../components/favorites_components/itinerary_edit/Button/Button';
import { CreateActivityCard } from '../../components/favorites_components/itinerary_edit/CreateActivityCard/CreateActivityCard';
import { InputTitulo } from '../../components/favorites_components/itinerary_edit/InputTittle/InputTitulo';
import { colors } from '../../constants/colors';
import { styles } from './edicionItinerario.styles';
import { useTheme } from '@/hooks/use-color-scheme';

// Mock de datos
const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    day: 1,
    time: '09:00',
    title: 'Trekking Glaciar Perito Moreno',
    description: 'Caminata sobre el hielo con grampones.',
    location: 'Parque Nacional Los Glaciares',
  },
  {
    id: 'act-2',
    day: 1,
    time: '13:30',
    title: 'Almuerzo en Refugio',
    description: 'Comida típica patagónica con vista al glaciar.',
    location: 'Refugio Perito Moreno',
  },
  {
    id: 'act-3',
    day: 1,
    time: '16:00',
    title: 'Navegación Safari Náutico',
    description: 'Paseo en barco frente a la pared del glaciar.',
    location: 'Puerto Bajo las Sombras',
  },
  {
    id: 'act-4',
    day: 2,
    time: '10:00',
    title: 'Sendero Laguna de los Tres',
    description: 'Caminata exigente con vistas al cerro Fitz Roy.',
    location: 'El Chaltén',
  },
  {
    id: 'act-5',
    day: 2,
    time: '14:00',
    title: 'Pícnic en Laguna Capri',
    description: 'Descanso y almuerzo frente al Fitz Roy.',
    location: 'Laguna Capri',
  },
  {
    id: 'act-6',
    day: 2,
    time: '18:00',
    title: 'Cena en La Cervecería',
    description: 'Cerveza artesanal y comida patagónica.',
    location: 'El Chaltén Centro',
  },
];

type ActivityParams = {
  updatedActivityId?: string;
  updatedTitle?: string;
  updatedDescription?: string;
  updatedTime?: string;
  updatedLocation?: string;
  updatedDay?: string;
};

type Activity = typeof INITIAL_ACTIVITIES[0];

// Extracted to avoid nesting > 4 levels inside useEffect → setActivities
function applyActivityUpdate(prev: Activity[], params: ActivityParams): Activity[] {
  const exists = prev.some((act) => act.id === params.updatedActivityId);
  if (exists) {
    return prev.map((act) => {
      if (act.id !== params.updatedActivityId) return act;
      return {
        ...act,
        title: params.updatedTitle || act.title,
        description: params.updatedDescription || act.description,
        time: params.updatedTime || act.time,
        location: params.updatedLocation || act.location,
        day: params.updatedDay ? Number.parseInt(params.updatedDay, 10) : act.day,
      };
    });
  }
  return [
    ...prev,
    {
      id: params.updatedActivityId!,
      title: params.updatedTitle || 'Nueva Actividad',
      description: params.updatedDescription || '',
      time: params.updatedTime || '12:00',
      location: params.updatedLocation || '',
      day: params.updatedDay ? Number.parseInt(params.updatedDay, 10) : 1,
    },
  ];
}

// Extracted to keep doDelete's chain at ≤ 4 levels (component → fn → doDelete → setActivities cb)
function withoutActivity(prev: Activity[], id: string): Activity[] {
  return prev.filter((act) => act.id !== id);
}

type DaySectionProps = Readonly<{
  dayNum: number;
  activities: ReadonlyArray<Activity>;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string, title: string) => void;
  onAdd: (dayNum: number) => void;
  theme: typeof colors.light;
}>;

// Extracted to avoid nesting > 4 levels inside the ScrollView render
function DaySection({ dayNum, activities, onEdit, onDelete, onAdd, theme }: DaySectionProps) {
  const dayActivities = activities.filter((act) => act.day === dayNum);
  return (
    <View style={styles.daySection}>
      <Text style={[styles.dayTitle, { color: theme.textSecondary }]}>{`Día ${dayNum}`}</Text>
      <View style={styles.activityList}>
        {dayActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            time={activity.time}
            title={activity.title}
            description={activity.description}
            location={activity.location}
            onEditPress={() => onEdit(activity)}
            onDeletePress={() => onDelete(activity.id, activity.title)}
          />
        ))}
        <CreateActivityCard onPress={() => onAdd(dayNum)} />
      </View>
    </View>
  );
}

export default function EdicionItinerarioScreen() {
  const [title, setTitle] = useState('Explorando la Patagonia');
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { colorScheme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const params = useLocalSearchParams<ActivityParams>();

  useEffect(() => {
    if (params.updatedActivityId) {
      setActivities((prev) => applyActivityUpdate(prev, params));
    }
  }, [
    params.updatedActivityId,
    params.updatedTitle,
    params.updatedDescription,
    params.updatedTime,
    params.updatedLocation,
    params.updatedDay,
  ]);

  const handleEditActivity = (activity: typeof INITIAL_ACTIVITIES[0]) => {
    router.push({
      pathname: '/edit_activity_formulary',
      params: {
        id: activity.id,
        day: String(activity.day),
        time: activity.time,
        title: activity.title,
        description: activity.description,
        location: activity.location,
      },
    });
  };

  const handleDeleteActivity = (id: string, activityTitle: string) => {
    // Named handler avoids a 5th nesting level inside Alert.alert → onPress
    const doDelete = () => setActivities((prev) => withoutActivity(prev, id));
    Alert.alert(
      'Eliminar Actividad',
      `¿Estás seguro de que deseas eliminar la actividad "${activityTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: doDelete },
      ]
    );
  };

  const handleAddActivity = (dayNum: number) => {
    const newId = `act-${Date.now()}`;
    router.push({
      pathname: '/edit_activity_formulary',
      params: {
        id: newId,
        day: String(dayNum),
        time: '',
        title: '',
        description: '',
        location: '',
      },
    });
  };

  const handleSaveChanges = () => {
    Alert.alert(
      'Cambios Guardados',
      `El itinerario "${title}" con ${activities.length} actividades ha sido guardado con éxito.`,
      [{ text: 'Aceptar', onPress: () => router.back() }]
    );
  };

  // Group activities by day
  const days = Array.from(new Set(activities.map((act) => act.day))).sort((a, b) => a - b);

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
        <View style={styles.titleInputWrapper}>
          <InputTitulo value={title} onChangeText={setTitle} />
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
          <View style={{ padding: 20, alignItems: 'center', width: '100%' }}>
            <Text style={{ color: theme.textSecondary, fontFamily: 'Inter_400Regular', marginBottom: 16 }}>
              No hay actividades en este itinerario.
            </Text>
            <CreateActivityCard onPress={() => handleAddActivity(1)} />
          </View>
        )}

        <View style={styles.buttonWrapper}>
          <Button label="Guardar cambios" onPress={handleSaveChanges} />
        </View>
      </ScrollView>
    </View>
  );
}
