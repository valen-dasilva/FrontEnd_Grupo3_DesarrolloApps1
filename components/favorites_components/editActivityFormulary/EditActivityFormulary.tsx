import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './EditActivityFormulary.styles';
import { useTheme } from '@/hooks/use-color-scheme';
import { CustomInput } from '@/components/CustomInput';

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

  const { theme } = useTheme();

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

          <CustomInput
            label="Hora"
            value={time}
            onChangeText={setTime}
            placeholder="Ej. 09:00"
            accessibilityLabel="Hora de la actividad"
          />

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
