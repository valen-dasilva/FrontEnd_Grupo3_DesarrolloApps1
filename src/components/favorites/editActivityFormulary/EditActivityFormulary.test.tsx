import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EditActivityFormulary } from './EditActivityFormulary';
import { Alert } from 'react-native';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  surfaceHighlight: '#f5f5f5',
  primary: '#007bff',
  warning: '#ffc107',
  text: '#212529',
  textSecondary: '#6c757d',
  textInverse: '#ffffff',
  card: '#f8f9fa',
  danger: '#dc3545',
  surfaceNeutral: '#e9ecef',
  borderDark: '#343a40',
  surfaceNeutralAlt: '#f8f9fa',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
    toggleColorScheme: jest.fn(),
  }),
  useColorScheme: () => 'light',
}));

// Mock CustomInput to make sure it doesn't break and propagates inputs correctly
jest.mock('@/components/CustomInput', () => {
  const { TextInput, Text, View } = require('react-native');
  return {
    CustomInput: ({ label, value, onChangeText, placeholder, ...props }: any) => (
      <View>
        <Text>{label}</Text>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          testID={`input-${label}`}
          {...props}
        />
      </View>
    ),
  };
});

describe('EditActivityFormulary', () => {
  const defaultInitialValues = {
    title: 'Actividad de Prueba',
    description: 'Descripción de prueba',
    time: '10:30',
    location: 'Ubicación de prueba',
    day: 1,
  };

  const mockSave = jest.fn();
  const mockCancel = jest.fn();
  const duracionDias = 3;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('renders initial values correctly', () => {
    const { getByTestId, getByText } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    expect(getByTestId('input-Título de la actividad').props.value).toBe('Actividad de Prueba');
    expect(getByTestId('input-Descripción').props.value).toBe('Descripción de prueba');
    expect(getByTestId('input-Hora (HH:mm)').props.value).toBe('10:30');
    expect(getByText('Ubicación de prueba')).toBeTruthy();

    // Day buttons should render (Día 1, Día 2, Día 3)
    expect(getByText('Día 1')).toBeTruthy();
    expect(getByText('Día 2')).toBeTruthy();
    expect(getByText('Día 3')).toBeTruthy();
  });

  it('handles text input changes correctly', () => {
    const { getByTestId } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const titleInput = getByTestId('input-Título de la actividad');
    fireEvent.changeText(titleInput, 'Nuevo Título');
    expect(titleInput.props.value).toBe('Nuevo Título');
  });

  it('formats time inputs correctly and validates format', () => {
    const { getByTestId, queryByText } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const timeInput = getByTestId('input-Hora (HH:mm)');

    // Typing single digit
    fireEvent.changeText(timeInput, '2');
    expect(timeInput.props.value).toBe('2');

    // Hour limit valHH > 23
    fireEvent.changeText(timeInput, '24');
    expect(timeInput.props.value).toBe('23');

    // Adding colon automatically when >= 3 digits
    fireEvent.changeText(timeInput, '123');
    expect(timeInput.props.value).toBe('12:3'); // 12 + 3 -> 12:3
    // Wait, let's verify what happens when typing "123".
    // Code says:
    // const hh = cleaned.slice(0, 2); // '12'
    // const mm = cleaned.slice(2, 4); // '3'
    // ... mm length is 1, so formattedMM = '3' -> wait, formattedMM ismm so '3'
    // formatted = `${formattedHH}:${formattedMM}` -> '12:3'
    // Let's check:
    // If it formats to 12:3, the format is invalid so timeError is shown.
    // Let's test typing '1230' -> formatted is '12:30' (valid)
    fireEvent.changeText(timeInput, '1230');
    expect(timeInput.props.value).toBe('12:30');
    expect(queryByText('Formato inválido (HH:mm)')).toBeNull();

    // Typing invalid minute like '1260' -> '12:59' (limit check)
    fireEvent.changeText(timeInput, '1260');
    expect(timeInput.props.value).toBe('12:59');

    // Deleting colon
    // The component tracks previous state. Since we simulate successive onChangeText:
    // In our test, if previous value ended with ':' (e.g. '12:') and new text is '12', it triggers backspace handler.
    // Let's set time state to '12:' and transition to '12'
    fireEvent.changeText(timeInput, '12'); // clean/default transition
  });

  it('changes day selection when a day button is pressed', () => {
    const { getByText } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const dayButton2 = getByText('Día 2');
    fireEvent.press(dayButton2);
    // There is no easy direct way to check state in RTL unless we inspect UI style or save.
    // Let's save and verify that the selected day is 2.
    const saveButton = getByText('Guardar cambios');
    fireEvent.press(saveButton);
    expect(mockSave).toHaveBeenCalledWith({
      title: 'Actividad de Prueba',
      description: 'Descripción de prueba',
      time: '10:30',
      location: 'Ubicación de prueba',
      day: 2,
    });
  });

  it('triggers alert on empty title when saving', () => {
    const { getByText, getByTestId } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const titleInput = getByTestId('input-Título de la actividad');
    fireEvent.changeText(titleInput, '');
    const saveButton = getByText('Guardar cambios');
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith('Campo obligatorio', 'Por favor ingresa un título para la actividad.');
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('triggers alert on empty time when saving', () => {
    const { getByText, getByTestId } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const timeInput = getByTestId('input-Hora (HH:mm)');
    fireEvent.changeText(timeInput, '');
    const saveButton = getByText('Guardar cambios');
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith('Campo obligatorio', 'Por favor ingresa la hora de la actividad.');
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('triggers alert on invalid time format when saving', () => {
    const { getByText, getByTestId } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const timeInput = getByTestId('input-Hora (HH:mm)');
    // Force set an invalid format
    fireEvent.changeText(timeInput, '12:3');
    const saveButton = getByText('Guardar cambios');
    fireEvent.press(saveButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Formato de hora inválido',
      'Por favor ingresa la hora en formato HH:mm (ej. 09:00).'
    );
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByText } = render(
      <EditActivityFormulary
        initialValues={defaultInitialValues}
        duracionDias={duracionDias}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const cancelButton = getByText('Cancelar');
    fireEvent.press(cancelButton);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
