import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { colors } from '../../../constants/colors';
import { styles } from './EditActivityFormulary.styles';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface ActivityFormValues {
  title: string;
  description: string;
  time: string;
  location: string;
}

export interface EditActivityFormularyProps {
  initialValues: ActivityFormValues;
  onSave: (values: ActivityFormValues) => void;
  onCancel: () => void;
}

export const EditActivityFormulary: React.FC<EditActivityFormularyProps> = ({
  initialValues,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [time, setTime] = useState(initialValues.time);
  const [location, setLocation] = useState(initialValues.location);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const handleSave = () => {
    onSave({
      title: title.trim(),
      description: description.trim(),
      time: time.trim(),
      location: location.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.formContainer, { backgroundColor: theme.surface }]}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Título de la actividad</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Ej. Trekking Glaciar"
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel="Título de la actividad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ej. Caminata sobre el hielo con grampones."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              accessibilityLabel="Descripción de la actividad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Hora</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
              value={time}
              onChangeText={setTime}
              placeholder="Ej. 09:00"
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel="Hora de la actividad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Ubicación</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
              value={location}
              onChangeText={setLocation}
              placeholder="Ej. Parque Nacional Los Glaciares"
              placeholderTextColor={theme.textSecondary}
              accessibilityLabel="Ubicación de la actividad"
            />
          </View>

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
