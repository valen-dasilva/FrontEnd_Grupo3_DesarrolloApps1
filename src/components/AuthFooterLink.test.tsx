import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthFooterLink } from './AuthFooterLink';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  textSecondary: '#6c757d',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('AuthFooterLink', () => {
  it('renders texts correctly', () => {
    const { getByText } = render(
      <AuthFooterLink
        text="¿No tienes cuenta?"
        linkText="Regístrate"
        onPress={() => {}}
      />
    );
    expect(getByText('¿No tienes cuenta?')).toBeTruthy();
    expect(getByText('Regístrate')).toBeTruthy();
  });

  it('triggers onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AuthFooterLink
        text="¿No tienes cuenta?"
        linkText="Regístrate"
        onPress={onPress}
      />
    );
    const link = getByText('Regístrate');
    fireEvent.press(link);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
