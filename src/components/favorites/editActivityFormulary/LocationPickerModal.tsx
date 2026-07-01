import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

const MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? '';
// fetch directo: los FlatList internos de librerías de autocomplete no propagan
// el tap correctamente bajo New Architecture (Expo SDK 54).
const AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

interface Prediction {
  place_id: string;
  description: string;
}

interface LocationPickerModalProps {
  visible: boolean;
  onSelect: (address: string) => void;
  onClose: () => void;
}

export function LocationPickerModal({ visible, onSelect, onClose }: LocationPickerModalProps) {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  // Enfoca el input al abrir y limpia el estado al cerrar (para la próxima vez).
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
    setQuery('');
    setPredictions([]);
  }, [visible]);

  // Búsqueda con debounce: espera 350ms desde la última tecla antes de pegarle
  // a Google, para no disparar una request por cada caracter.
  useEffect(() => {
    const text = query.trim();
    if (text.length < 2) {
      setPredictions([]);
      return;
    }
    const timer = setTimeout(() => fetchPredictions(text), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchPredictions = async (text: string) => {
    if (!MAPS_KEY) return;
    setLoading(true);
    try {
      const url =
        `${AUTOCOMPLETE_URL}?input=${encodeURIComponent(text)}` +
        `&key=${MAPS_KEY}&language=es&components=country:ar`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === 'OK') {
        setPredictions(json.predictions ?? []);
      } else {
        setPredictions([]);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (prediction: Prediction) => {
    onSelect(prediction.description);
    onClose();
  };

  const handleUseManual = () => {
    const text = query.trim();
    if (!text) return;
    onSelect(text);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Buscar ubicación</Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cerrar buscador de ubicación"
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>

        {/* Input de búsqueda */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchBox, { backgroundColor: theme.inputBg, borderColor: theme.primary }]}>
            <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Escribí una dirección o lugar..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Usar dirección manual */}
        {query.trim().length >= 2 && (
          <View style={styles.manualWrapper}>
            <Pressable
              onPress={handleUseManual}
              style={({ pressed }) => [
                styles.manualButton,
                { backgroundColor: theme.surfaceHighlight, borderColor: theme.primary },
                pressed && { opacity: 0.75 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Usar la dirección escrita manualmente"
            >
              <Ionicons name="map-outline" size={18} color={theme.primary} />
              <Text style={[styles.manualText, { color: theme.primary }]}>
                Usar esta dirección
              </Text>
            </Pressable>
          </View>
        )}

        {/* Resultados */}
        <ScrollView
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <ActivityIndicator color={theme.primary} style={styles.loader} />
          )}

          {!loading && query.trim().length >= 2 && predictions.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No se encontraron resultados
            </Text>
          )}

          {predictions.map((p) => (
            <Pressable
              key={p.place_id}
              onPress={() => handleSelect(p)}
              style={({ pressed }) => [
                styles.row,
                { borderBottomColor: theme.border },
                pressed && { backgroundColor: theme.surfaceNeutral },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar ${p.description}`}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={theme.textSecondary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowText, { color: theme.text }]} numberOfLines={2}>
                {p.description}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paddings.spacing.lg,
    paddingVertical: paddings.spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.headingBold,
  },
  searchWrapper: {
    paddingHorizontal: paddings.spacing.lg,
    paddingTop: paddings.spacing.md,
    paddingBottom: paddings.spacing.sm,
  },
  manualWrapper: {
    paddingHorizontal: paddings.spacing.lg,
    paddingBottom: paddings.spacing.sm,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderRadius: paddings.radius.sm,
  },
  manualText: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: paddings.radius.sm,
    paddingHorizontal: paddings.spacing.md,
  },
  searchIcon: {
    marginRight: paddings.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: fonts.size.md,
    fontFamily: fonts.family.bodyRegular,
    height: '100%',
  },
  list: {
    flex: 1,
    paddingHorizontal: paddings.spacing.lg,
  },
  loader: {
    marginTop: paddings.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: paddings.spacing.lg,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodyRegular,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: paddings.spacing.md,
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: paddings.spacing.sm,
  },
  rowText: {
    flex: 1,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.bodyRegular,
  },
});
