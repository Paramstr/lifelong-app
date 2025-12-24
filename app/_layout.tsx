import { FloatingDevTools } from '@react-buoy/core';
import { DebugBordersStandaloneOverlay, debugBordersToolPreset } from '@react-buoy/debug-borders';
import { envToolPreset } from '@react-buoy/env';
import { networkToolPreset } from '@react-buoy/network';
import { reactQueryToolPreset, wifiTogglePreset } from '@react-buoy/react-query';
import { routeEventsToolPreset } from '@react-buoy/route-events';
import { storageToolPreset } from '@react-buoy/storage';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const tintColor = DynamicColorIOS({
    dark: 'white',
    light: 'black',
  });

  const USE_NATIVE_TABS = true; // Set to false to use standard Tabs (for Element Inspector support)

  const content = USE_NATIVE_TABS ? (
    <NativeTabs
      labelStyle={{
        color: tintColor,
      }}
      tintColor={tintColor}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="ic_menu_home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="family">
        <Label>Family</Label>
        <Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} drawable="ic_menu_share" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="health">
        <Label>Health</Label>
        <Icon sf={{ default: 'heart', selected: 'heart.fill' }} drawable="ic_menu_today" />
      </NativeTabs.Trigger>


      <NativeTabs.Trigger name="more" role="search">
        <Label>More</Label>
        <Icon sf={{ default: 'ellipsis.circle', selected: 'ellipsis.circle.fill' }} drawable="ic_menu_more" />
      </NativeTabs.Trigger>
    </NativeTabs>
  ) : (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="health" options={{ title: 'Health' }} />
      <Tabs.Screen name="family" options={{ title: 'Family' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );

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
      {content}
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
