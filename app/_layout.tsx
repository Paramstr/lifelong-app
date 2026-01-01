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
import { useConvexAuth } from 'convex/react';
import { Stack, usePathname } from 'expo-router';
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignInScreen from './sign-in';

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

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  return <>{children}</>;
}
