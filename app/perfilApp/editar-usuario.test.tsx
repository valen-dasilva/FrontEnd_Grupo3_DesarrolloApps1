import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditarUsuarioScreen from './editar-usuario';
import Toast from 'react-native-toast-message';
import { getProfile, updateProfile } from '../../src/services/profileService';

// --- Mocks de dependencias externas ---

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ back: jest.fn() }),
}));

// Usuario logueado + función para refrescar datos
const mockUpdateUser = jest.fn();
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { idUsuario: 1, nombre: 'Mateo', email: 'mateo@test.com' },
    updateUser: mockUpdateUser,
  }),
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// El service: getProfile carga datos, updateProfile guarda
jest.mock('../../src/services/profileService', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock('../../src/services/api', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

describe('EditarUsuarioScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Por defecto, getProfile devuelve un perfil válido
    (getProfile as jest.Mock).mockResolvedValue({
      idUsuario: 1,
      nombre: 'Mateo',
      apellido: 'Rossi',
      email: 'mateo@test.com',
    });
  });

  it('carga y muestra los datos del perfil al abrir la pantalla', async () => {
    const { getByDisplayValue } = render(<EditarUsuarioScreen />);

    // Esperamos a que termine la carga y aparezcan los valores en los inputs
    await waitFor(() => {
      expect(getByDisplayValue('Mateo')).toBeTruthy();
      expect(getByDisplayValue('Rossi')).toBeTruthy();
      expect(getByDisplayValue('mateo@test.com')).toBeTruthy();
    });

    // Verificamos que se haya pedido el perfil del usuario correcto
    expect(getProfile).toHaveBeenCalledWith(1);
  });

  it('muestra error si se borra un campo y se intenta guardar', async () => {
    const { getByText, getByDisplayValue } = render(<EditarUsuarioScreen />);

    await waitFor(() => expect(getByDisplayValue('Mateo')).toBeTruthy());

    // Vaciamos el campo nombre
    fireEvent.changeText(getByDisplayValue('Mateo'), '');

    fireEvent.press(getByText('✓  Guardar Cambios'));

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        text1: 'Completá todos los campos',
      }),
    );
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it('llama a updateProfile con los datos correctos al guardar', async () => {
    (updateProfile as jest.Mock).mockResolvedValue({
      idUsuario: 1,
      nombre: 'Mateo',
      apellido: 'Gómez',
      email: 'nuevo@test.com',
    });

    const { getByText, getByDisplayValue } = render(<EditarUsuarioScreen />);

    await waitFor(() => expect(getByDisplayValue('Rossi')).toBeTruthy());

    // Cambiamos apellido y email
    fireEvent.changeText(getByDisplayValue('Rossi'), 'Gómez');
    fireEvent.changeText(getByDisplayValue('mateo@test.com'), 'nuevo@test.com');

    fireEvent.press(getByText('✓  Guardar Cambios'));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(1, {
        nombre: 'Mateo',
        apellido: 'Gómez',
        email: 'nuevo@test.com',
      });
    });
  });

  it('muestra un toast de error si falla la carga del perfil', async () => {
    (getProfile as jest.Mock).mockRejectedValue(new Error('falló'));

    render(<EditarUsuarioScreen />);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          text1: 'No se pudo cargar el perfil',
        }),
      );
    });
  });
});