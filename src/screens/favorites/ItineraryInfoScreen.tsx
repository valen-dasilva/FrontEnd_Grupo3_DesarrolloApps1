import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { CardItinerarioInfoFav } from '@/components/favorites/CardItinerarioInfoFav';
import { ActivityCard } from '@/components/common/ActivityCard/ActivityCard';
import { styles } from './ItineraryInfoScreen.styles';
import { useTheme } from '@/hooks/useColorScheme';

import { useFavoritosDetailsHook } from '@/hooks/useFavoritos';
import { ItemItinerarioUsuario } from '@/services/favoritosService';
import { formatFecha } from '@/utils/dateUtils';

export default function FavoriteItineraryInfoScreen() {
    const router = useRouter();
    const { 
        id, 
        titulo, 
        provincia, 
        duracionDias, 
        fotoPortada, 
        fechaInicio, 
        fechaFin, 
        etiquetas 
    } = useLocalSearchParams<{ 
        id: string;
        titulo?: string;
        provincia?: string;
        duracionDias?: string;
        fotoPortada?: string;
        fechaInicio?: string;
        fechaFin?: string;
        etiquetas?: string;
    }>();

    const insets = useSafeAreaInsets();
    const { theme, toggleColorScheme } = useTheme();

    const {
        loadItineraryInfo,
        itineraryDetails,
        isLoading,
    } = useFavoritosDetailsHook();

    useEffect(() => {
        if (id) {
            loadItineraryInfo(Number(id));
        }
    }, [id, loadItineraryInfo]);

    const daysMap = new Map<number, ItemItinerarioUsuario[]>();
    itineraryDetails?.items?.forEach(item => {
        if (!daysMap.has(item.dia)) {
            daysMap.set(item.dia, []);
        }
        daysMap.get(item.dia)!.push(item);
    });
    const sortedDays = Array.from(daysMap.keys()).sort((a, b) => a - b);

    // Dynamic props resolving (route params with hook callback)
    const displayTitle = titulo || itineraryDetails?.titulo;
    const displayImageUrl = fotoPortada || itineraryDetails?.fotoPortada;
    const displayCategory = (etiquetas?.split(',')[0]) || itineraryDetails?.etiquetas?.[0];
    const displayDuration = duracionDias || itineraryDetails?.duracionDias;
    const displayProvincia = provincia || itineraryDetails?.provincia;

    const startDate = fechaInicio || itineraryDetails?.fechaInicio;
    const endDate = fechaFin || itineraryDetails?.fechaFin;

    const displayDateRange = (startDate && endDate)
        ? `${formatFecha(startDate)} - ${formatFecha(endDate)}`
        : undefined;

    const displayDescription = displayProvincia
        ? `Itinerario para explorar ${displayProvincia} en ${displayDuration} Días.`
        : undefined;

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color={theme.text} style={styles.loader} />;
        }

        if (!itineraryDetails) {
            return <Text style={[styles.emptyText, { color: theme.text }]}>No se encontraron detalles.</Text>;
        }

        if (sortedDays.length === 0) {
            return <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay actividades programadas.</Text>;
        }

        return sortedDays.map((day, index) => {
            const dayItems = daysMap.get(day) || [];
            const isLastDay = index === sortedDays.length - 1;
            return (
                <View key={`day-${day}`} style={[styles.dayCard, isLastDay && styles.lastDayCard, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.dayTitle, { color: theme.text }]}>Día {day}</Text>
                    {dayItems.map((item, itemIndex) => (
                        <ActivityCard
                            key={item.id}
                            time={item.hora}
                            title={item.nombreActividad}
                            subtitle={item.descripcion}
                            location={item.localidad || item.direccion}
                            isLast={itemIndex === dayItems.length - 1}
                        />
                    ))}
                </View>
            );
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.surfaceNeutral }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <Header
                title="Favoritos"
                onThemeTogglePress={toggleColorScheme}
                onAvatarPress={() => router.push('/(tabs)/perfil')}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: theme.surfaceNeutral }} contentContainerStyle={styles.scrollContent}>

                <CardItinerarioInfoFav 
                    title={displayTitle}
                    imageUrl={displayImageUrl}
                    category={displayCategory}
                    dateRange={displayDateRange}
                    description={displayDescription}
                    onBackPress={() => router.back()} 
                    onEditPress={() => router.push({ pathname: '/(tabs)/(favorite)/edicionItinerario', params: { id } })} 
                />

                {renderContent()}

            </ScrollView>
        </View>
    );
}
