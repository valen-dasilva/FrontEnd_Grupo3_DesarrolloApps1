import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

import { ItineraryPhotoPicker } from './ItineraryPhotoPicker';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('@/hooks/useColorScheme', () => ({
  useTheme: () => ({
    theme: {
      text: '#111111',
      textSecondary: '#666666',
      border: '#DDDDDD',
      danger: '#CC0000',
      card: '#FFFFFF',
      primary: '#0066CC',
    },
  }),
}));

describe('ItineraryPhotoPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
  });

  it('agrega las imágenes seleccionadas', async () => {
    const onChange = jest.fn();
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{
        assetId: 'asset-1',
        uri: 'file:///foto.jpg',
        fileName: 'foto.jpg',
        mimeType: 'image/jpeg',
        fileSize: 1024,
      }],
    });

    const { getByLabelText } = render(
      <ItineraryPhotoPicker photos={[]} onChange={onChange} />,
    );
    fireEvent.press(getByLabelText('Seleccionar fotos del itinerario'));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ uri: 'file:///foto.jpg', mimeType: 'image/jpeg' }),
    ]));
  });

  it('descarta imágenes que superan 8 MB', async () => {
    const onChange = jest.fn();
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{
        uri: 'file:///pesada.jpg',
        fileSize: 8 * 1024 * 1024 + 1,
      }],
    });

    const { getByLabelText } = render(
      <ItineraryPhotoPicker photos={[]} onChange={onChange} />,
    );
    fireEvent.press(getByLabelText('Seleccionar fotos del itinerario'));

    await waitFor(() => expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ text1: 'Algunas fotos son muy pesadas' }),
    ));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
