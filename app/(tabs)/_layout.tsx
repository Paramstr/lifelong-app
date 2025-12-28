import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { AccessibilityInfo, DynamicColorIOS, Platform } from 'react-native';


export default function TabsLayout() {
  const tintColor = DynamicColorIOS({
    dark: 'white',
    light: 'black',
  });

  const USE_NATIVE_TABS = true; // Set to false to use standard Tabs (for Element Inspector support)

  // React.useEffect(() => {
  //   console.log('isLiquidGlassAvailable:', isLiquidGlassAvailable());
  //   AccessibilityInfo.isReduceTransparencyEnabled().then((enabled) => {
  //     console.log('isReduceTransparencyEnabled:', enabled);
  //   });
  // }, []);

  return USE_NATIVE_TABS ? (
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

      <NativeTabs.Trigger name="beta">
        <Label style={{ color: '#007AFF' }}>Beta</Label>
        <Icon sf={{ default: 'testtube.2', selected: 'testtube.2.fill' }} drawable="ic_menu_more" color="#007AFF" />
      </NativeTabs.Trigger>
    </NativeTabs>
  ) : (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="health" options={{ title: 'Health' }} />
      <Tabs.Screen name="family" options={{ title: 'Family' }} />
      <Tabs.Screen name="beta" options={{ title: 'Beta' }} />
    </Tabs>
  );
}