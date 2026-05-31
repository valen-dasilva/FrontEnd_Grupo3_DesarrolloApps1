import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header/Header';
import { CardItinerarioInfoFav } from '../../components/favorites_components/Card-Itinerario-Info-Fav';
import { ActivityCard } from '../../components/common/ActivityCard/ActivityCard';
import { styles } from './itinerarioInfoFav.styles';
import { useTheme } from '@/hooks/use-color-scheme';
import { colors } from '../../constants/colors';

export default function FavoriteItineraryInfoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme, toggleColorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? colors.dark : colors.light;

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
                    onEditPress={() => router.push('/edicionItinerario')} 
                />

                <View style={[styles.dayCard, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.dayTitle, { color: theme.text }]}>Día 1</Text>

                    <ActivityCard
                        time="00:00"
                        title="Llegada y Check-in"
                        subtitle="Restaurante Local"
                        location="Ubicacion"
                    />
                    <ActivityCard
                        time="00:00"
                        title="Llegada y Check-in"
                        subtitle="Restaurante Local"
                        location="Ubicacion"
                    />
                    <ActivityCard
                        time="00:00"
                        title="Llegada y Check-in"
                        subtitle="Restaurante Local"
                        location="Ubicacion"
                        isLast={true}
                    />
                </View>

                <View style={[styles.dayCard, styles.lastDayCard, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.dayTitle, { color: theme.text }]}>Día 2</Text>

                    <ActivityCard
                        time="00:00"
                        title="Llegada y Check-in"
                        subtitle="Restaurante Local"
                        location="Ubicacion"
                    />
                    <ActivityCard
                        time="00:00"
                        title="Llegada y Check-in"
                        subtitle="Restaurante Local"
                        location="Ubicacion"
                    />
                    <ActivityCard
                        time="00:00"
                        title="Llegada y Check-in"
                        subtitle="Restaurante Local"
                        location="Ubicacion"
                        isLast={true}
                    />
                </View>

            </ScrollView>
        </View>
    );
}
