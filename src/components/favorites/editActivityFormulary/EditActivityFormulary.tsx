import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, Alert, StyleSheet } from 'react-native';
import { styles } from './EditActivityFormulary.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { CustomInput } from '@/components/CustomInput';
import { formatHora } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { LocationPickerModal } from './LocationPickerModal';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

export interface ActivityFormValues {
  title: string;
  description: string;
  time: string;
  location: string;
  day: number;
}

export interface EditActivityFormularyProps {
  initialValues: ActivityFormValues;
  duracionDias: number;
  existingActivities?: Array<{ id: number; dia: number; hora: string }>;
  currentActivityId?: number;
  onSave: (values: ActivityFormValues) => Promise<void>;
  onCancel: () => void;
}

export const EditActivityFormulary: React.FC<EditActivityFormularyProps> = ({
  initialValues,
  duracionDias,
  existingActivities = [],
  currentActivityId,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [time, setTime] = useState(formatHora(initialValues.time));
  const [location, setLocation] = useState(initialValues.location);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [day, setDay] = useState(initialValues.day || 1);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localDuracionDias, setLocalDuracionDias] = useState(Math.max(duracionDias, initialValues.day || 1));

  useEffect(() => {
    setLocalDuracionDias(Math.max(duracionDias, initialValues.day || 1));
  }, [duracionDias, initialValues.day]);

  const { theme } = useTheme();

  const isTimeValid = (t: string) => {
    const regex = /^([0-1]\d|2[0-3]):[0-5]\d$/;
    return regex.test(t);
  };

  const formatCleanedDigits = (cleaned: string): string => {
    if (cleaned.length === 0) return '';
    if (cleaned.length === 1) return cleaned;

    if (cleaned.length === 2) {
      const valHH = Number.parseInt(cleaned, 10);
      return valHH > 23 ? '23' : cleaned;
    }

    const hh = cleaned.slice(0, 2);
    const mm = cleaned.slice(2, 4);

    const valHH = Number.parseInt(hh, 10);
    const formattedHH = Math.min(valHH, 23).toString().padStart(2, '0');

    if (mm.length === 0) {
      return formattedHH;
    }

    const valMM = Number.parseInt(mm, 10);
    const formattedMM = valMM > 59 ? '59' : mm;

    return `${formattedHH}:${formattedMM}`;
  };

  const updateTimeAndValidate = (formatted: string) => {
    setTime(formatted);
    if (formatted.length > 0 && !isTimeValid(formatted)) {
      setTimeError('Formato inválido (HH:mm)');
    } else {
      setTimeError(null);
    }
  };

  const handleTimeChange = (text: string) => {
    // Si el usuario borra específicamente los dos puntos
    if (time.endsWith(':') && text.length === time.length - 1) {
      const newTime = text.slice(0, -1);
      updateTimeAndValidate(newTime);
      return;
    }

    const cleaned = text.replace(/\D/g, '');
    const formatted = formatCleanedDigits(cleaned);
    updateTimeAndValidate(formatted);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Campo obligatorio', 'Por favor ingresa un título para la actividad.');
      return;
    }
    if (!time.trim()) {
      Alert.alert('Campo obligatorio', 'Por favor ingresa la hora de la actividad.');
      return;
    }
    if (!isTimeValid(time)) {
      setTimeError('Formato inválido (HH:mm)');
      Alert.alert('Formato de hora inválido', 'Por favor ingresa la hora en formato HH:mm (ej. 09:00).');
      return;
    }
    
    // Verificar que la hora no pise otra actividad en el mismo día
    const conflict = existingActivities.find(
      (act) => act.dia === day && act.hora && act.hora.substring(0, 5) === time && act.id !== currentActivityId
    );
    if (conflict) {
      setTimeError('Horario ocupado');
      Alert.alert(
        'Conflicto de horario',
        'Ya tienes otra actividad programada a esta misma hora en este día. Por favor elige un horario distinto.'
      );
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        time: time.trim(),
        location: location.trim(),
        day,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.formContainer, { backgroundColor: theme.surface }]}>

          {/* Day Selector */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Día de la actividad</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysContainer}
            >
              {Array.from({ length: localDuracionDias }, (_, i) => i + 1).map((d) => {
                const isSelected = day === d;
                return (
                  <Pressable
                    key={d}
                    onPress={() => setDay(d)}
                    style={({ pressed }) => [
                      styles.dayButton,
                      isSelected
                        ? { backgroundColor: theme.primary, borderColor: theme.primary }
                        : { backgroundColor: theme.surfaceNeutral, borderColor: theme.border },
                      pressed && styles.pressedState
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Seleccionar Día ${d}`}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        { color: isSelected ? theme.textInverse : theme.text }
                      ]}
                    >
                      Día {d}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => {
                  // Crear un día nuevo y dejarlo seleccionado: así "agregar
                  // actividad → + día" queda en un solo gesto claro.
                  setLocalDuracionDias(prev => {
                    const nuevoDia = prev + 1;
                    setDay(nuevoDia);
                    return nuevoDia;
                  });
                }}
                style={({ pressed }) => [
                  styles.dayButton,
                  { backgroundColor: theme.surfaceNeutral, borderColor: theme.border },
                  pressed && styles.pressedState
                ]}
                accessibilityRole="button"
                accessibilityLabel="Añadir día"
              >
                <Text style={[styles.dayButtonText, { color: theme.text }]}>+</Text>
              </Pressable>
            </ScrollView>
          </View>

          <CustomInput
            label="Título de la actividad"
            value={title}
            onChangeText={setTitle}
            placeholder="Ej. Trekking Glaciar"
            accessibilityLabel="Título de la actividad"
          />

          <CustomInput
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            placeholder="Ej. Caminata sobre el hielo con grampones."
            multiline
            numberOfLines={4}
            style={styles.textArea}
            accessibilityLabel="Descripción de la actividad"
          />

          <View style={styles.fieldContainer}>
            <CustomInput
              label="Hora (HH:mm)"
              value={time}
              onChangeText={handleTimeChange}
              placeholder="Ej. 09:00"
              keyboardType="number-pad"
              maxLength={5}
              accessibilityLabel="Hora de la actividad"
            />
            {timeError ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {timeError}
              </Text>
            ) : null}
          </View>

          {/* Campo de ubicación — modal en nativo, texto libre en web */}
          {Platform.OS !== 'web' ? (
            <>
              <View style={locationStyles.wrapper}>
                <Text style={[locationStyles.label, { color: theme.text }]}>Ubicación</Text>
                <Pressable
                  onPress={() => setLocationModalVisible(true)}
                  style={({ pressed }) => [
                    locationStyles.field,
                    { backgroundColor: theme.inputBg, borderColor: theme.border },
                    pressed && locationStyles.fieldPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Seleccionar ubicación de la actividad"
                >
                  <Ionicons name="location-outline" size={20} color={theme.textSecondary} style={locationStyles.pinIcon} />
                  <Text
                    style={[
                      locationStyles.fieldText,
                      { color: location ? theme.text : theme.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {location || 'Buscar lugar o dirección...'}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>
              <LocationPickerModal
                visible={locationModalVisible}
                onSelect={(address) => setLocation(address)}
                onClose={() => setLocationModalVisible(false)}
              />
            </>
          ) : (
            <CustomInput
              label="Ubicación"
              value={location}
              onChangeText={setLocation}
              placeholder="Ej. Parque Nacional Los Glaciares"
              accessibilityLabel="Ubicación de la actividad"
            />
          )}

          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: theme.primary },
              (pressed || isSaving) && styles.pressedState,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Guardar cambios de la actividad"
          >
            <Text style={[styles.saveButtonText, { color: theme.textInverse }]}>
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.cancelButton,
              { backgroundColor: theme.danger },
              pressed && styles.pressedState
            ]}
            accessibilityRole="button"
            accessibilityLabel="Cancelar cambios de la actividad"
          >
            <Text style={[styles.cancelButtonText, { color: theme.textInverse }]}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const locationStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: paddings.spacing.sm,
  },
  label: {
    fontSize: fonts.size.sm,
    fontWeight: '600',
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: paddings.radius.sm,
    paddingHorizontal: paddings.spacing.sm,
  },
  fieldPressed: {
    opacity: 0.7,
  },
  pinIcon: {
    marginRight: paddings.spacing.xs,
  },
  fieldText: {
    flex: 1,
    fontSize: fonts.size.md,
    fontFamily: fonts.family.bodyRegular,
  },
});
