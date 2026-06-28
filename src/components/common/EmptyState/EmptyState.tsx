import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { fonts } from '@/constants/fonts';
import { paddings } from '@/constants/paddings';

interface EmptyStateProps {
  icon: ImageSourcePropType;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: paddings.spacing.xxxl,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: paddings.spacing.md,
  },
  title: {
    fontFamily: fonts.family.headingMedium,
    fontSize: fonts.size.lg,
    marginBottom: paddings.spacing.sm,
  },
  description: {
    fontFamily: fonts.family.bodyRegular,
    fontSize: fonts.size.md,
    textAlign: 'center',
  },
});
