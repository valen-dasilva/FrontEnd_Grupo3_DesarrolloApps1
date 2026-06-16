import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Platform } from 'react-native';
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
        etiquetas,
        description
    } = useLocalSearchParams<{ 
        id: string;
        titulo?: string;
        provincia?: string;
        duracionDias?: string;
        fotoPortada?: string;
        fechaInicio?: string;
        fechaFin?: string;
        etiquetas?: string;
        description?: string;
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

    const { daysMap, sortedDays } = useMemo(() => {
        const map = new Map<number, ItemItinerarioUsuario[]>();
        itineraryDetails?.items?.forEach(item => {
            if (!map.has(item.dia)) {
                map.set(item.dia, []);
            }
            map.get(item.dia)!.push(item);
        });
        const sorted = Array.from(map.keys()).sort((a, b) => a - b);
        return { daysMap: map, sortedDays: sorted };
    }, [itineraryDetails?.items]);

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

    const displayDescription = description || itineraryDetails?.descripcion || (displayProvincia
        ? `Itinerario para explorar ${displayProvincia} en ${displayDuration} Días.`
        : undefined);

    const renderHeader = useCallback(() => (
        <CardItinerarioInfoFav 
            title={displayTitle}
            imageUrl={displayImageUrl}
            category={displayCategory}
            dateRange={displayDateRange}
            description={displayDescription}
            onBackPress={() => router.back()}
            onEditPress={() => router.push({ pathname: '/(tabs)/(favorite)/edicionItinerario', params: { id } })} 
        />
    ), [displayTitle, displayImageUrl, displayCategory, displayDateRange, displayDescription, id, router]);

    const renderEmptyComponent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color={theme.text} style={styles.loader} />;
        }

        if (!itineraryDetails) {
            return <Text style={[styles.emptyText, { color: theme.text }]}>No se encontraron detalles.</Text>;
        }

        return <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay actividades programadas.</Text>;
    };

    const renderItem = useCallback(({ item: day, index }: { item: number; index: number }) => {
        const dayItems = daysMap.get(day) || [];
        const isLastDay = index === sortedDays.length - 1;
        return (
            <View style={[styles.dayCard, isLastDay && styles.lastDayCard, { backgroundColor: theme.surface }]}>
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
    }, [theme, sortedDays, daysMap]);

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.surfaceNeutral }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <Header
                title="Favoritos"
                onThemeTogglePress={toggleColorScheme}
                onAvatarPress={() => router.push('/(tabs)/perfil')}
            />

            <FlatList
                data={isLoading || !itineraryDetails ? [] : sortedDays}
                renderItem={renderItem}
                keyExtractor={(day) => `day-${day}`}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyComponent}
                style={{ backgroundColor: theme.surfaceNeutral }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={2} // Renderiza sólo 2 días inicialmente
                maxToRenderPerBatch={3} // Carga en lotes pequeños de 3
                windowSize={3} // Ventana reducida para optimizar memoria
                removeClippedSubviews={Platform.OS === 'android'} // Remueve subviews invisibles en Android
            />
        </View>
    );
}
