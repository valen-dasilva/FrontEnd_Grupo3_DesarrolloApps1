import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { render } from '@testing-library/react-native';
import { UserAvatar } from './UserAvatar';

const mockTheme = {
  background: '#ffffff',
  border: '#e0e0e0',
  surface: '#ffffff',
  primary: '#007bff',
  avatarBg: '#e9ecef',
};

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('UserAvatar', () => {
  it('renders ActivityIndicator when loading is true', () => {
    const { UNSAFE_getByType } = render(<UserAvatar loading={true} />);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders initials when no uri is provided', () => {
    const { getByText } = render(
      <UserAvatar nombre="Juan" apellido="Perez" uri={undefined} />
    );
    expect(getByText('JP')).toBeTruthy();
  });

  it('renders initials correctly with only name', () => {
    const { getByText } = render(<UserAvatar nombre="Juan" uri={undefined} />);
    expect(getByText('JU')).toBeTruthy();
  });

  it('renders image when uri is provided', () => {
    const { UNSAFE_getByType } = render(
      <UserAvatar uri="https://example.com/photo.jpg" />
    );
    const image = UNSAFE_getByType(Image);
    expect(image.props.source.uri).toBe('https://example.com/photo.jpg');
  });
});
