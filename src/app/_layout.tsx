import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { GlobalToast } from '@/components/GlobalToast';
import { QuickActionModal } from '@/components/QuickActionModal';
import { KosMateProvider } from '@/context/KosMateContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <KosMateProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
        <QuickActionModal />
        <GlobalToast />
      </KosMateProvider>
    </ThemeProvider>
  );
}
