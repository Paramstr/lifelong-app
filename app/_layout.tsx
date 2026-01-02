import { convex } from '@/lib/convex';
import { authTokenStorage } from '@/lib/convex-auth-storage';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { FloatingDevTools } from '@react-buoy/core';
import { DebugBordersStandaloneOverlay, debugBordersToolPreset } from '@react-buoy/debug-borders';
import { envToolPreset } from '@react-buoy/env';
import { networkToolPreset } from '@react-buoy/network';
import { reactQueryToolPreset, wifiTogglePreset } from '@react-buoy/react-query';
import { routeEventsToolPreset } from '@react-buoy/route-events';
import { storageToolPreset } from '@react-buoy/storage';
import { useConvexAuth, useQuery } from 'convex/react';
import { Redirect, Stack, usePathname, useSegments } from 'expo-router';
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignInScreen from './sign-in';
import { api } from '../convex/_generated/api';

export default function RootLayout() {
  const buoys = [
    { ...debugBordersToolPreset, slot: 'both' as any }, // Fix invalid 'menu' slot in package
    networkToolPreset,
    envToolPreset,
    reactQueryToolPreset,
    wifiTogglePreset,
    storageToolPreset,
    routeEventsToolPreset,
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostHogProvider
        apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
        options={{
          host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
          enableSessionReplay: true,
          sessionReplayConfig: {
            maskAllTextInputs: true,
            maskAllImages: false,
          },
        }}
      >
        <ConvexAuthProvider client={convex} storage={authTokenStorage}>
          <PostHogRouteTracker />
          <AuthGate>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="sign-in"
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="onboarding"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="profile"
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="protocol/[id]"
                options={{
                  presentation: 'fullScreenModal',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="food/[id]"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  sheetAllowedDetents: [1.0],
                  sheetGrabberVisible: true,
                }}
              />
            </Stack>
            {__DEV__ && (
              <>
                <FloatingDevTools
                  apps={buoys}
                  environment="local"
                  userRole="admin"
                  defaultFloatingTools={['env', 'environment', 'network', 'query-wifi-toggle', 'debug-borders']}
                  defaultDialTools={['env', 'network', 'storage', 'query', 'route-events', 'debug-borders']}
                />
                {/* IMPORTANT: Render overlay at root level */}
                <DebugBordersStandaloneOverlay />
              </>
            )}
          </AuthGate>
        </ConvexAuthProvider>
      </PostHogProvider>
    </GestureHandlerRootView>
  );
}

function PostHogRouteTracker() {
  const pathname = usePathname();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      posthog.capture('$screen_view', {
        $screen_name: pathname,
      });
    }
  }, [pathname, posthog]);

  return null;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isOfflineMode = process.env.EXPO_PUBLIC_OFFLINE_MODE === 'true';
  const forceOnboarding = process.env.EXPO_PUBLIC_FORCE_ONBOARDING === 'true';
  
  // Use try-catch or optional chaining for query in case api is not generated yet? 
  // It should be fine.
  const onboardingData = useQuery(api.onboarding.getOnboardingData);
  const segments = useSegments();
  const isOnboardingRoute = segments[0] === 'onboarding';

  if (isOfflineMode) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Force onboarding flow logic
  if (forceOnboarding) {
      // If we are not in onboarding, go there.
      // This handles unauthenticated state (landing/sign-in inside onboarding)
      // and authenticated state (forcing walk-through).
      if (!isOnboardingRoute) {
          return <Redirect href="/onboarding" />;
      }
      // If we are in onboarding, just render children (which contains the Stack)
      return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <SignInScreen />;
  }
  
  // Authenticated check for completion
  if (onboardingData === undefined) {
      // Data loading
      return null; 
  }

  const isCompleted = !!onboardingData?.completedAt;
  if (!isCompleted && !isOnboardingRoute) {
      return <Redirect href="/onboarding" />;
  }

  return <>{children}</>;
}
