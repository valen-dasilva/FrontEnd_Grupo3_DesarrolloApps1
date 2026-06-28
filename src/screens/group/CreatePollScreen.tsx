import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Header } from '@/components/common/Header/Header';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { useFavoritosHook } from '@/hooks/useFavoritos';
import { useItinerariosHook } from '@/hooks/useItinerarios';
import { usePollsHook } from '@/hooks/usePolls';
import { useTheme } from '@/hooks/useColorScheme';
import { icons } from '@/constants/icons';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';
import { SelectableItineraryOption } from '@/types/poll';

export default function CreatePollScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { idGrupo } = useLocalSearchParams<{ idGrupo: string }>();
  const groupId = Number(idGrupo);
  const { colorScheme, theme, toggleColorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const { favoritos, isLoading: loadingFavorites } = useFavoritosHook();
  const { listItinerarioResumen, isLoading: loadingItineraries } = useItinerariosHook();
  const { createPoll, isCreating } = usePollsHook(Number.isNaN(groupId) ? null : groupId);

  const [selected, setSelected] = useState<SelectableItineraryOption[]>([]);
  const [pollName, setPollName] = useState('');

  const isSelected = (option: SelectableItineraryOption) => {
    return selected.some((s) => s.id === option.id && s.type === option.type);
  };

  const toggleOption = (option: SelectableItineraryOption) => {
    setSelected((prev) => {
      const exists = prev.some((s) => s.id === option.id && s.type === option.type);
      if (exists) {
        return prev.filter((s) => !(s.id === option.id && s.type === option.type));
      }
      return [...prev, option];
    });
  };

  const handleCreate = async () => {
    if (selected.length < 2) {
      Alert.alert('Error', 'Seleccioná al menos 2 opciones.');
      return;
    }

    const uniqueIds = new Set(selected.map((s) => `${s.type}-${s.id}`));
    if (uniqueIds.size !== selected.length) {
      Alert.alert('Error', 'No podés seleccionar opciones duplicadas.');
      return;
    }

    const request = {
      nombre: pollName.trim() || undefined,
      opciones: selected.map((s) => ({
        idItinerarioSistema: s.type === 'system' ? s.id : null,
        idItinerarioUsuario: s.type === 'user' ? s.id : null,
      })),
    };

    const poll = await createPoll(request);
    if (poll) {
      router.replace(
        `/(tabs)/(group)/detalleEncuesta?idGrupo=${groupId}&idEncuesta=${poll.idEncuesta}` as Href,
      );
    }
  };

  const renderOption = (option: SelectableItineraryOption) => {
    const selectedFlag = isSelected(option);
    return (
      <Pressable
        key={`${option.type}-${option.id}`}
        onPress={() => toggleOption(option)}
        style={({ pressed }) => [
          styles.optionCard,
          {
            backgroundColor: theme.surface,
            borderColor: selectedFlag ? theme.primary : theme.border,
          },
          selectedFlag && styles.selectedBorder,
          pressed && { opacity: 0.8 },
        ]}
      >
        {option.fotoPortada ? (
          <Image source={{ uri: option.fotoPortada }} style={styles.optionCover} contentFit="cover" />
        ) : (
          <View style={[styles.optionCoverPlaceholder, { backgroundColor: theme.surfaceHighlight }]}>
            <MaterialIcons name={icons.Location} size={24} color={theme.primary} />
          </View>
        )}
        <View style={styles.optionInfo}>
          <Text style={[styles.optionTitle, { color: theme.text }]} numberOfLines={2}>
            {option.titulo}
          </Text>
          <Text style={[styles.optionMeta, { color: theme.textSecondary }]}>
            {option.type === 'system' ? 'Favorito' : 'Mi viaje'}
            {option.provincia ? ` · ${option.provincia}` : ''}
            {option.duracionDias ? ` · ${option.duracionDias} días` : ''}
          </Text>
        </View>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: selectedFlag ? theme.primary : 'transparent',
              borderColor: selectedFlag ? theme.primary : theme.border,
            },
          ]}
        >
          {selectedFlag && <MaterialIcons name={icons.Check} size={18} color={theme.textInverse} />}
        </View>
      </Pressable>
    );
  };

  const isLoading = loadingFavorites || loadingItineraries;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <Header
        title="Nueva encuesta"
        showBackButton
        onBackPress={() => router.back()}
        onThemeTogglePress={toggleColorScheme}
      />

      <View style={styles.summary}>
        <CustomInput
          label="Nombre de la encuesta (opcional)"
          placeholder="Ej: ¿A dónde vamos en julio?"
          value={pollName}
          onChangeText={setPollName}
          maxLength={120}
        />
        <Text style={[styles.summaryText, { color: theme.textSecondary, marginTop: paddings.spacing.md }]}>
          Opciones seleccionadas: {selected.length}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Favoritos</Text>
          {favoritos.length === 0 ? (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>No tenés favoritos guardados.</Text>
          ) : (
            favoritos
              .map((f) => ({
                id: f.idItinerario,
                type: 'system' as const,
                titulo: f.titulo,
                fotoPortada: f.fotoPortada,
                provincia: f.provincia,
                duracionDias: f.duracionDias,
              }))
              .map(renderOption)
          )}

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: paddings.spacing.lg }]}>
            Mis viajes
          </Text>
          {listItinerarioResumen.length === 0 ? (
            <Text style={[styles.empty, { color: theme.textSecondary }]}>No tenés itinerarios propios.</Text>
          ) : (
            listItinerarioResumen
              .map((i) => ({
                id: i.id,
                type: 'user' as const,
                titulo: i.titulo,
                fotoPortada: i.fotoPortada,
                provincia: i.provincia,
                duracionDias: i.duracionDias,
              }))
              .map(renderOption)
          )}

          <CustomButton
            title="Crear encuesta"
            onPress={handleCreate}
            disabled={isCreating || selected.length < 2}
            loading={isCreating}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summary: {
    paddingHorizontal: paddings.spacing.lg,
    paddingVertical: paddings.spacing.md,
  },
  summaryText: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
  },
  scroll: {
    padding: paddings.spacing.lg,
    paddingBottom: paddings.spacing.xxxl,
  },
  sectionTitle: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.lg,
    marginBottom: paddings.spacing.md,
  },
  empty: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    marginBottom: paddings.spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: paddings.spacing.md,
    borderRadius: paddings.radius.md,
    borderWidth: 1,
    marginBottom: paddings.spacing.md,
  },
  selectedBorder: {
    borderWidth: 2,
  },
  optionCover: {
    width: 56,
    height: 56,
    borderRadius: paddings.radius.sm,
  },
  optionCoverPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: paddings.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
    marginLeft: paddings.spacing.md,
  },
  optionTitle: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.md,
  },
  optionMeta: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.sm,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
