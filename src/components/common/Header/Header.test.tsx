import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from './Header';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  text: '#212529',
  borderDark: '#333333',
};

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockUser = {
  nombre: 'Juan Perez',
  fotoPerfil: 'https://example.com/avatar.jpg',
};
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

const mockToggleColorScheme = jest.fn();
jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    theme: mockTheme,
    toggleColorScheme: mockToggleColorScheme,
  }),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title correctly', () => {
    const { getByText } = render(<Header title="Mis Itinerarios" />);
    expect(getByText('Mis Itinerarios')).toBeTruthy();
  });

  it('handles theme toggle press', () => {
    const onThemeTogglePress = jest.fn();
    const { getByLabelText } = render(
      <Header title="Test" onThemeTogglePress={onThemeTogglePress} />
    );
    const themeBtn = getByLabelText('Toggle Theme');
    fireEvent.press(themeBtn);
    expect(onThemeTogglePress).toHaveBeenCalledTimes(1);
  });

  it('handles avatar press', () => {
    const onAvatarPress = jest.fn();
    const { getByLabelText } = render(
      <Header title="Test" onAvatarPress={onAvatarPress} />
    );
    const avatarBtn = getByLabelText('User Profile');
    fireEvent.press(avatarBtn);
    expect(onAvatarPress).toHaveBeenCalledTimes(1);
  });

  it('calls default avatar press handler when no custom callback is provided', () => {
    const { getByLabelText } = render(<Header title="Test" />);
    const avatarBtn = getByLabelText('User Profile');
    fireEvent.press(avatarBtn);
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/perfil');
  });

  it('renders showBackButton and handles onBackPress', () => {
    const onBackPress = jest.fn();
    const { getByLabelText } = render(
      <Header title="Test" showBackButton={true} onBackPress={onBackPress} />
    );
    const backBtn = getByLabelText('Volver');
    fireEvent.press(backBtn);
    expect(onBackPress).toHaveBeenCalledTimes(1);
  });
});
