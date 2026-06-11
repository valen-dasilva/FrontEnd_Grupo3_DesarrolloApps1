import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CambiarContrasenaScreen from './cambiar-contrasena';
import Toast from 'react-native-toast-message';
import { changePassword } from '../../src/services/profileService';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ user: { idUsuario: 1, nombre: 'Test', email: 'test@test.com' } }),
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('../../src/services/profileService', () => ({
  changePassword: jest.fn(),
}));

// Mock de api.ts para evitar que cargue expo-constants
jest.mock('../../src/services/api', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

describe('CambiarContrasenaScreen - validaciones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra error si los campos están vacíos y NO llama al service', () => {
    const { getByText } = render(<CambiarContrasenaScreen />);
    fireEvent.press(getByText('✓  Guardar Cambios'));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error' }),
    );
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('muestra error si la nueva contraseña tiene menos de 6 caracteres', () => {
    const { getByText, getAllByPlaceholderText } = render(<CambiarContrasenaScreen />);
    const inputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(inputs[0], 'cualquiera');
    fireEvent.changeText(inputs[1], '123');
    fireEvent.changeText(inputs[2], '123');
    fireEvent.press(getByText('✓  Guardar Cambios'));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        text1: 'La nueva contraseña debe tener al menos 6 caracteres',
      }),
    );
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('muestra error si las contraseñas nuevas no coinciden', () => {
    const { getByText, getAllByPlaceholderText } = render(<CambiarContrasenaScreen />);
    const inputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(inputs[0], 'actual123');
    fireEvent.changeText(inputs[1], 'nueva123');
    fireEvent.changeText(inputs[2], 'distinta456');
    fireEvent.press(getByText('✓  Guardar Cambios'));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        text1: 'Las contraseñas nuevas no coinciden',
      }),
    );
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('llama al service cuando todos los datos son válidos', () => {
    (changePassword as jest.Mock).mockResolvedValue(undefined);
    const { getByText, getAllByPlaceholderText } = render(<CambiarContrasenaScreen />);
    const inputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(inputs[0], 'actual123');
    fireEvent.changeText(inputs[1], 'nueva123');
    fireEvent.changeText(inputs[2], 'nueva123');
    fireEvent.press(getByText('✓  Guardar Cambios'));
    expect(changePassword).toHaveBeenCalledWith(1, {
      contraseniaActual: 'actual123',
      contraseniaNueva: 'nueva123',
    });
  });
});