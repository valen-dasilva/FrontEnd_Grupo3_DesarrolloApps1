import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header/Header';
import { CardItinerarioInfoFav } from '../../components/favorites_components/Card-Itinerario-Info-Fav';
import { ActivityCard } from '../../components/common/ActivityCard/ActivityCard';
import { styles } from './itinerarioInfoFav.styles';
import { useTheme } from '@/hooks/use-color-scheme';
import { colors } from '../../constants/colors';
import { useFavoritosDetailsHook } from '../../src/hooks/favoritosHook';
import { ItemItinerarioUsuario } from '../../src/services/favoritosService';

export default function FavoriteItineraryInfoScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const { colorScheme, toggleColorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? colors.dark : colors.light;

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
    if (itineraryDetails && itineraryDetails.items) {
        itineraryDetails.items.forEach(item => {
            if (!daysMap.has(item.dia)) {
                daysMap.set(item.dia, []);
            }
            daysMap.get(item.dia)!.push(item);
        });
    }
    const sortedDays = Array.from(daysMap.keys()).sort((a, b) => a - b);

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
                    onBackPress={() => router.back()} 
                    onEditPress={() => router.push({ pathname: '/edicionItinerario', params: { id } })} 
                />

                {isLoading ? (
                    <ActivityIndicator size="large" color={theme.text} style={styles.loader} />
                ) : !itineraryDetails ? (
                    <Text style={[styles.emptyText, { color: theme.text }]}>No se encontraron detalles.</Text>
                ) : sortedDays.length === 0 ? (
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay actividades programadas.</Text>
                ) : (
                    sortedDays.map((day, index) => {
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
                    })
                )}

            </ScrollView>
        </View>
    );
}
