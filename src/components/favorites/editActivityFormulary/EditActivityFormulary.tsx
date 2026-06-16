import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, Alert } from 'react-native';
import { styles } from './EditActivityFormulary.styles';
import { useTheme } from '@/hooks/useColorScheme';
import { CustomInput } from '@/components/CustomInput';
import { formatHora } from '@/utils/dateUtils';

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
  onSave: (values: ActivityFormValues) => void;
  onCancel: () => void;
}

export const EditActivityFormulary: React.FC<EditActivityFormularyProps> = ({
  initialValues,
  duracionDias,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [time, setTime] = useState(formatHora(initialValues.time));
  const [location, setLocation] = useState(initialValues.location);
  const [day, setDay] = useState(initialValues.day || 1);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [localDuracionDias, setLocalDuracionDias] = useState(duracionDias);

  const { theme } = useTheme();

  const isTimeValid = (t: string) => {
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
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
    const formattedHH = (valHH > 23 ? 23 : valHH).toString().padStart(2, '0');

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

    const cleaned = text.replace(/[^0-9]/g, '');
    const formatted = formatCleanedDigits(cleaned);
    updateTimeAndValidate(formatted);
  };

  const handleSave = () => {
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
    onSave({
      title: title.trim(),
      description: description.trim(),
      time: time.trim(),
      location: location.trim(),
      day,
    });
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
                onPress={() => setLocalDuracionDias(prev => prev + 1)}
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

          <CustomInput
            label="Ubicación"
            value={location}
            onChangeText={setLocation}
            placeholder="Ej. Parque Nacional Los Glaciares"
            accessibilityLabel="Ubicación de la actividad"
          />

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: theme.primary },
              pressed && styles.pressedState
            ]}
            accessibilityRole="button"
            accessibilityLabel="Guardar cambios de la actividad"
          >
            <Text style={[styles.saveButtonText, { color: theme.textInverse }]}>Guardar cambios</Text>
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
