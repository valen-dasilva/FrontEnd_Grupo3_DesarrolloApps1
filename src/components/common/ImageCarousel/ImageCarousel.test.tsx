import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Image, StyleSheet, Text } from 'react-native';

import { ImageCarousel } from './ImageCarousel';

describe('ImageCarousel', () => {
  it('muestra la primera imagen y el contador cuando hay varias', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ImageCarousel
        images={['https://example.com/1.jpg', 'https://example.com/2.jpg']}
        fallbackColor="#FFFFFF"
      />,
    );

    expect(getByText('1/2')).toBeTruthy();
    expect(UNSAFE_getByType(Image).props.source.uri).toBe('https://example.com/1.jpg');
  });

  it('conserva el contenido superpuesto', () => {
    const { getByText } = render(
      <ImageCarousel images={[]} fallbackColor="#FFFFFF">
        <Text>Contenido</Text>
      </ImageCarousel>,
    );

    expect(getByText('Contenido')).toBeTruthy();
  });

  it('dimensiona las fotos y permite avanzar con controles', () => {
    const { getByLabelText, getByTestId, getByText, UNSAFE_getAllByType } = render(
      <ImageCarousel
        images={['https://example.com/1.jpg', 'https://example.com/2.jpg']}
        fallbackColor="#FFFFFF"
      />,
    );

    fireEvent(getByTestId('image-carousel'), 'layout', {
      nativeEvent: { layout: { width: 320, height: 280 } },
    });

    const renderedImages = UNSAFE_getAllByType(Image);
    expect(StyleSheet.flatten(renderedImages[0].props.style)).toEqual(
      expect.objectContaining({ width: 320, height: 280 }),
    );

    fireEvent.press(getByLabelText('Siguiente foto'));
    expect(getByText('2/2')).toBeTruthy();
  });
});
