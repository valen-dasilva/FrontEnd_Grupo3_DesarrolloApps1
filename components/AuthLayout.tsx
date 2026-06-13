import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-color-scheme';

import { HeaderLogo } from './HeaderLogo';
import { BottomSheet } from './BottomSheet';
import { SheetHeader } from './SheetHeader';

interface AuthLayoutProps {
  headerSubtitle?: string;
  sheetTitle?: string;
  sheetSubtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  headerSubtitle,
  sheetTitle,
  sheetSubtitle,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <LinearGradient colors={[theme.gradientStart, theme.gradientEnd]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.topSection}>
            <HeaderLogo
              title="TuristeAR"
              subtitle={headerSubtitle}
            />
          </View>

          <BottomSheet>
            {(sheetTitle || sheetSubtitle) && (
              <SheetHeader title={sheetTitle} subtitle={sheetSubtitle} />
            )}
            {children}
          </BottomSheet>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
});
