import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { styles } from './ImageCarousel.styles';

type Props = Readonly<{
  images: readonly string[];
  fallbackColor: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}>;

export function ImageCarousel({ images, fallbackColor, style, children }: Props) {
  const validImages = useMemo(() => images.filter(Boolean), [images]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(validImages.length - 1, 0)));
  }, [validImages.length]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
    setContainerHeight(event.nativeEvent.layout.height);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth === 0) return;
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / containerWidth));
  }, [containerWidth]);

  const goToImage = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(index, validImages.length - 1));
    scrollRef.current?.scrollTo?.({ x: nextIndex * containerWidth, animated: true });
    setActiveIndex(nextIndex);
  }, [containerWidth, validImages.length]);

  return (
    <View testID="image-carousel" style={style} onLayout={handleLayout}>
      {validImages.length > 0 ? (
        containerWidth > 0 && containerHeight > 0 ? (
          <ScrollView
            ref={scrollRef}
            horizontal
            snapToInterval={containerWidth}
            decelerationRate="fast"
            scrollEnabled={validImages.length > 1}
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
            contentContainerStyle={{ height: containerHeight }}
          >
            {validImages.map((url, index) => (
              <Image
                key={`${url}-${index}`}
                source={{ uri: url }}
                style={[styles.image, { width: containerWidth, height: containerHeight }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <Image source={{ uri: validImages[0] }} style={styles.initialImage} resizeMode="cover" />
        )
      ) : (
        <View style={[styles.fallback, { backgroundColor: fallbackColor }]} />
      )}

      {children}

      {validImages.length > 1 && (
        <>
          <View pointerEvents="none" style={styles.counterWrapper}>
            <View style={styles.counterPill}>
              <Text style={styles.counterText}>{activeIndex + 1}/{validImages.length}</Text>
            </View>
          </View>
          <TouchableOpacity
            accessibilityLabel="Foto anterior"
            disabled={activeIndex === 0}
            onPress={() => goToImage(activeIndex - 1)}
            style={[styles.navigationButton, styles.previousButton, activeIndex === 0 && styles.disabledButton]}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Siguiente foto"
            disabled={activeIndex === validImages.length - 1}
            onPress={() => goToImage(activeIndex + 1)}
            style={[
              styles.navigationButton,
              styles.nextButton,
              activeIndex === validImages.length - 1 && styles.disabledButton,
            ]}
          >
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
