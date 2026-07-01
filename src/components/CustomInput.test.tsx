import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomInput } from './CustomInput';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  textSecondary: '#6c757d',
  text: '#212529',
  inputBg: '#f8f9fa',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('CustomInput', () => {
  it('renders correctly with placeholder and label', () => {
    const { getByText, getByPlaceholderText } = render(
      <CustomInput label="Correo electrónico" placeholder="Ingresa tu correo" />
    );
    expect(getByText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Ingresa tu correo')).toBeTruthy();
  });

  it('toggles password visibility when the eye button is pressed', () => {
    const { getByLabelText } = render(
      <CustomInput secureTextEntry={true} showEyeButton={true} />
    );

    // Initial state: password secure/hidden
    const showPasswordBtn = getByLabelText('Mostrar contraseña');
    expect(showPasswordBtn).toBeTruthy();

    // Tap to show password
    fireEvent.press(showPasswordBtn);

    // After press, the label should change to "Ocultar contraseña"
    const hidePasswordBtn = getByLabelText('Ocultar contraseña');
    expect(hidePasswordBtn).toBeTruthy();
  });
});
