import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useColorScheme';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

const MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? '';

interface LocationPickerModalProps {
  visible: boolean;
  onSelect: (address: string) => void;
  onClose: () => void;
}

export function LocationPickerModal({ visible, onSelect, onClose }: LocationPickerModalProps) {
  const { theme } = useTheme();
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      // Pequeño delay para que el modal termine de abrirse antes de enfocar
      const timer = setTimeout(() => {
        autocompleteRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleSelect = (_: any, details: any) => {
    const address = details?.formatted_address ?? details?.name ?? '';
    if (address) {
      onSelect(address);
      onClose();
    }
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
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Buscar ubicación
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cerrar buscador de ubicación"
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>
        </View>

        {/* Autocomplete */}
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder="Escribí una dirección o lugar..."
          onPress={handleSelect}
          fetchDetails
          query={{
            key: MAPS_KEY,
            language: 'es',
            components: 'country:ar',
          }}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
          listViewDisplayed="auto"
          styles={{
            container: {
              flex: 1,
            },
            textInputContainer: {
              paddingHorizontal: paddings.spacing.lg,
              paddingTop: paddings.spacing.md,
              paddingBottom: paddings.spacing.sm,
              backgroundColor: theme.background,
            },
            textInput: {
              height: 50,
              borderRadius: paddings.radius.sm,
              borderWidth: 1,
              borderColor: theme.primary,
              backgroundColor: theme.inputBg,
              color: theme.text,
              fontSize: fonts.size.md,
              paddingHorizontal: paddings.spacing.md,
              fontFamily: fonts.family.bodyRegular,
            },
            listView: {
              backgroundColor: theme.surface,
              marginHorizontal: paddings.spacing.lg,
              borderRadius: paddings.radius.sm,
              borderWidth: 1,
              borderColor: theme.border,
            },
            row: {
              backgroundColor: theme.surface,
              paddingHorizontal: paddings.spacing.md,
              paddingVertical: paddings.spacing.md,
            },
            separator: {
              height: 1,
              backgroundColor: theme.border,
            },
            description: {
              color: theme.text,
              fontFamily: fonts.family.bodyRegular,
              fontSize: fonts.size.sm,
            },
            poweredContainer: {
              display: 'none',
            },
          }}
          renderLeftButton={() => (
            <View style={styles.searchIcon}>
              <Ionicons name="search" size={20} color={theme.textSecondary} />
            </View>
          )}
        />
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
  searchIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: paddings.spacing.sm,
    height: 50,
  },
});
