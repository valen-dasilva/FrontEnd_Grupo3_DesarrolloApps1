import { colors } from '@/constants/colors';
import { fonts } from '@/constants/fonts';
import { icons } from '@/constants/icons';
import { paddings } from '@/constants/paddings';
import { Provincia, PROVINCIA_LABEL } from '@/src/types/itinerario';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ProvinciaSelector } from '@/components/Preferencias/ProvinciaSelector';

interface FiltrosDeBusquedaProps {
  selectedProvincia?: Provincia;
  onProvinciaChange: (provincia: Provincia | undefined) => void;
}

export function FiltrosDeBusqueda({ selectedProvincia, onProvinciaChange }: FiltrosDeBusquedaProps) {
  const [showProvincia, setShowProvincia] = useState(false);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <View style={styles.seccion}>
      <Text style={[styles.pregunta, { color: theme.text }]}>¿A dónde quieres ir?</Text>
      <TouchableOpacity
        style={[
          styles.inputRow,
          {
            backgroundColor: theme.surface,
            borderColor: isDark ? theme.border : colors.borderDark,
          }
        ]}
        onPress={() => setShowProvincia(true)}
        activeOpacity={0.7}
      >
        <MaterialIcons name={icons.AddItinerary} size={fonts.size.lg} color={theme.textSecondary} />
        <Text style={[
          styles.inputText,
          { color: selectedProvincia ? theme.text : theme.textSecondary }
        ]}>
          {selectedProvincia ? PROVINCIA_LABEL[selectedProvincia] : 'Ej: Río Negro, Salta, Buenos Aires...'}
        </Text>
        {selectedProvincia && (
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            onProvinciaChange(undefined);
          }}>
            <MaterialIcons name="cancel" size={fonts.size.lg} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <ProvinciaSelector
        visible={showProvincia}
        onClose={() => setShowProvincia(false)}
        onSelect={(p) => {
          onProvinciaChange(p);
          setShowProvincia(false);
        }}
        selected={selectedProvincia}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  seccion: {
    marginTop: paddings.spacing.xxxl - 4,
  },
  pregunta: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.headingBold,
    color: colors.text,
    marginBottom: paddings.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: paddings.spacing.sm + 2,
    backgroundColor: colors.surface,
    borderRadius: paddings.radius.sm + 4,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: paddings.spacing.md + 2,
    paddingVertical: paddings.spacing.md + 2,
  },
  inputText: {
    flex: 1,
    fontSize: fonts.size.sm + 1,
    fontFamily: fonts.family.bodyRegular,
    color: colors.text,
  },
});