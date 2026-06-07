import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/hooks/use-color-scheme';
import BrandIcon from '../assets/images/icono.svg';

interface HeaderLogoProps {
  title?: string;
  subtitle?: string;
  largeLogo?: boolean;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ title, subtitle, largeLogo = false }) => {
  const { theme } = useTheme();

  if (largeLogo) {
    return (
      <View style={styles.container}>
        <BrandIcon 
          width={180} 
          height={180} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.logoIconContainer, { backgroundColor: theme.textInverse }]}>
        <BrandIcon 
          width={54} 
          height={54} 
        />
      </View>
      {title && <Text style={[styles.title, { color: theme.textInverse }]}>{title}</Text>}
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textInverse }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  logoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
    opacity: 0.9,
  },
});
