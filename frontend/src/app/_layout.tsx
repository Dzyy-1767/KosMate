import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useColorScheme, View, ActivityIndicator } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { GlobalToast } from '@/components/GlobalToast';
import { QuickActionModal } from '@/components/QuickActionModal';
import { KosMateProvider, useKosMate } from '@/context/KosMateContext';

SplashScreen.preventAutoHideAsync();

// ─── Auth Guard (inner component — has access to context) ─────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useKosMate();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoggedIn === null) return; // still loading from storage

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!isLoggedIn && !inAuthGroup) {
      // Not logged in → redirect to login
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Already logged in → redirect to main app
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  // Show a loading indicator while reading auth state from storage
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF8F5' }}>
        <ActivityIndicator size="large" color="#312C51" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <KosMateProvider>
        <AnimatedSplashOverlay />
        <AuthGuard>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FAF8F5' },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen
              name="expenses/[id]"
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="needs/[id]"
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="expenses/add"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="needs/add"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="explore"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </AuthGuard>
        <QuickActionModal />
        <GlobalToast />
      </KosMateProvider>
    </ThemeProvider>
  );
}
