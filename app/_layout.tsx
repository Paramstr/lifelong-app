import { FloatingDevTools } from '@react-buoy/core';
import { DebugBordersStandaloneOverlay, debugBordersToolPreset } from '@react-buoy/debug-borders';
import { envToolPreset } from '@react-buoy/env';
import { networkToolPreset } from '@react-buoy/network';
import { reactQueryToolPreset, wifiTogglePreset } from '@react-buoy/react-query';
import { routeEventsToolPreset } from '@react-buoy/route-events';
import { storageToolPreset } from '@react-buoy/storage';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
            presentation: 'formSheet',
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
    </GestureHandlerRootView>
  );
}
