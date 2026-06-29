import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Platform, Alert, TouchableOpacity, Animated, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/common/Header/Header';
import { CardItinerarioInfoFav } from '@/components/favorites/CardItinerarioInfoFav';
import { ActivityCard } from '@/components/common/ActivityCard/ActivityCard';
import { styles } from './ItineraryInfoScreen.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusModal } from '@/components/common/StatusModal/StatusModal';

import { useItinerariosDetailsHook } from '@/hooks/useItinerarios';
import { ItemItinerarioUsuario } from '@/services/itinerariosService';
import { formatFecha } from '@/utils/dateUtils';
import { WeatherStrip } from '@/components/common/WeatherStrip/WeatherStrip';
import { PROVINCIA_COORDS } from '@/utils/provinciaCoords';
import { Provincia } from '@/types/itinerario';
import { useWeather } from '@/hooks/useWeather';
import { isBadWeather, getDiaDate } from '@/utils/weatherUtils';

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
        completarViaje,
        isCompletando,
    } = useItinerariosDetailsHook();

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
        // Mostramos TODOS los días según la duración (no solo los que tienen
        // actividad): un itinerario de 6 días se ve con sus 6 días, vacíos o no.
        if (!itineraryDetails) return { daysMap: map, sortedDays: [] as number[] };
        const totalDias = Math.max(itineraryDetails.duracionDias ?? 1, ...Array.from(map.keys()), 1);
        const sorted = Array.from({ length: totalDias }, (_, i) => i + 1);
        return { daysMap: map, sortedDays: sorted };
    }, [itineraryDetails]);

    // Dynamic props resolving (route params with hook callback)
    const displayTitle = titulo || itineraryDetails?.titulo;
    const displayImageUrl = fotoPortada || itineraryDetails?.fotoPortada;
    const displayImages = useMemo(() => {
        const detailImages = (itineraryDetails?.fotos ?? []).map((foto) => foto.url);
        return detailImages.length > 0 ? detailImages : displayImageUrl ? [displayImageUrl] : [];
    }, [displayImageUrl, itineraryDetails?.fotos]);
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

    const yaCompletado = itineraryDetails?.completado ?? false;

    const [completarModal, setCompletarModal] = useState<{ visible: boolean; state: 'loading' | 'success' }>({
        visible: false,
        state: 'loading',
    });

    const confettiRef = useRef<any>(null);

    // Animaciones del botón "completar": bounce al tocar + relleno verde al completar
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fillAnim = useRef(new Animated.Value(itineraryDetails?.completado ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(fillAnim, {
            toValue: yaCompletado ? 1 : 0,
            duration: 350,
            useNativeDriver: false, // backgroundColor/borderColor no soportan native driver
        }).start();
    }, [yaCompletado, fillAnim]);

    const playBounce = useCallback(() => {
        scaleAnim.stopAnimation();
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: false }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 90, useNativeDriver: false }),
        ]).start();
    }, [scaleAnim]);

    // Confirmación cross-platform: Alert.alert no abre diálogo en Expo web (queda
    // mudo y el botón "no hace nada"); window.confirm sí funciona en web.
    const confirmarCompletar = useCallback((onConfirm: () => void) => {
        const titulo = '¿Marcar como completado?';
        const cuerpo = 'Esto sumará el viaje a tus estadísticas y coloreará la provincia en el mapa.';
        if (Platform.OS === 'web') {
            if (typeof window !== 'undefined' && window.confirm(`${titulo}\n\n${cuerpo}`)) {
                onConfirm();
            }
        } else {
            Alert.alert(titulo, cuerpo, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Completar viaje', style: 'default', onPress: onConfirm },
            ]);
        }
    }, []);

    const handleCompletarViaje = useCallback(() => {
        if (yaCompletado || isCompletando) return;
        playBounce();
        confirmarCompletar(async () => {
            setCompletarModal({ visible: true, state: 'loading' });
            try {
                await completarViaje(Number(id));
                setCompletarModal({ visible: true, state: 'success' });
                confettiRef.current?.start();
            } catch {
                setCompletarModal({ visible: false, state: 'loading' });
                Toast.show({
                    type: 'error',
                    text1: 'No se pudo completar',
                    text2: 'Revisá tu conexión e intentá de nuevo.',
                });
            }
        });
    }, [yaCompletado, isCompletando, playBounce, confirmarCompletar, completarViaje, id]);

    const completarIconColor = yaCompletado ? theme.textInverse : theme.primary;
    const completarBg = fillAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0,0)', theme.lightgreen],
    });
    const completarBorder = fillAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.primary, theme.lightgreen],
    });

    const weatherCoords = useMemo(() => {
        const prov = (displayProvincia as Provincia) ?? null;
        return prov ? PROVINCIA_COORDS[prov] ?? null : null;
    }, [displayProvincia]);

    const { data: weatherData } = useWeather({
        coords: weatherCoords ?? { lat: 0, lng: 0 },
        fechaInicio: startDate ?? '',
        fechaFin: endDate ?? '',
    });

    const renderHeader = useCallback(() => (
        <>
            <CardItinerarioInfoFav
                title={displayTitle}
                imageUrl={displayImageUrl}
                images={displayImages}
                category={displayCategory}
                dateRange={displayDateRange}
                description={displayDescription}
                onBackPress={() => router.replace({
                    pathname: '/(tabs)/favoritos',
                    params: { vista: 'misViajes' },
                })}
                onEditPress={() => router.replace({ pathname: '/(tabs)/(favorite)/edicionItinerario', params: { id } })}
            />
            {weatherCoords && startDate && endDate && (
                <WeatherStrip
                    coords={weatherCoords}
                    fechaInicio={startDate}
                    fechaFin={endDate}
                />
            )}
            <TouchableOpacity
                style={styles.completarBtnWrapper}
                onPress={handleCompletarViaje}
                disabled={yaCompletado || isCompletando}
                activeOpacity={0.85}
            >
                <Animated.View
                    style={[
                        styles.completarBtn,
                        {
                            transform: [{ scale: scaleAnim }],
                            backgroundColor: completarBg,
                            borderColor: completarBorder,
                        },
                    ]}
                >
                    <MaterialIcons
                        name={yaCompletado ? 'check-circle' : 'flag'}
                        size={20}
                        color={completarIconColor}
                    />
                    <Text style={[styles.completarBtnText, { color: completarIconColor }]}>
                        {isCompletando ? 'Guardando...' : yaCompletado ? '¡Viaje completado!' : 'Marcar como completado'}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </>
    ), [displayTitle, displayImageUrl, displayImages, displayCategory, displayDateRange, displayDescription, id, router, yaCompletado, isCompletando, handleCompletarViaje, scaleAnim, completarBg, completarBorder, completarIconColor, weatherCoords, startDate, endDate]);

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

        const diaDate = startDate ? getDiaDate(startDate, day) : null;
        const diaWeather = diaDate && weatherData?.available
            ? weatherData.days.find((d) => d.date === diaDate) ?? null
            : null;
        const badWeatherEmoji = diaWeather && isBadWeather(diaWeather.weatherCode)
            ? diaWeather.emoji
            : null;

        return (
            <View style={[styles.dayCard, isLastDay && styles.lastDayCard, { backgroundColor: theme.surface }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.dayTitle, { color: theme.text }]}>Día {day}</Text>
                    {badWeatherEmoji && (
                        <Text style={{ fontSize: 16 }}>{badWeatherEmoji}</Text>
                    )}
                </View>
                {dayItems.length > 0 ? (
                    dayItems.map((item, itemIndex) => (
                        <ActivityCard
                            key={item.id != null ? `${day}-${item.id}` : `${day}-fallback-${itemIndex}`}
                            time={item.hora}
                            title={item.nombreActividad}
                            subtitle={item.descripcion}
                            location={item.localidad || item.direccion}
                            isLast={itemIndex === dayItems.length - 1}
                        />
                    ))
                ) : (
                    <Text style={[styles.emptyDayText, { color: theme.textSecondary }]}>
                        Sin actividades programadas
                    </Text>
                )}
            </View>
        );
    }, [theme, sortedDays, daysMap, startDate, weatherData]);

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

            <StatusModal
                visible={completarModal.visible}
                state={completarModal.state}
                title={completarModal.state === 'loading' ? 'Completando viaje...' : '¡Viaje completado!'}
                message={completarModal.state === 'loading'
                    ? 'Estamos sumándolo a tus estadísticas.'
                    : 'Se sumó a tu recorrido y coloreamos la provincia en el mapa.'}
                actionLabel="Listo"
                onAction={() => setCompletarModal({ visible: false, state: 'loading' })}
            />
            <ConfettiCannon
                ref={confettiRef}
                count={120}
                origin={{ x: Dimensions.get('window').width / 2, y: -10 }}
                fallSpeed={2500}
                autoStart={false}
            />
        </View>
    );
}
