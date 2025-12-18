import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

export default function RootLayout() {
  const tintColor = DynamicColorIOS({
    dark: 'white',
    light: 'black',
  });

  return (
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

      <NativeTabs.Trigger name="health">
        <Label>Health</Label>
        <Icon sf={{ default: 'heart', selected: 'heart.fill' }} drawable="ic_menu_today" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="social">
        <Label>Social</Label>
        <Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} drawable="ic_menu_share" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="more" role="search">
        <Label>More</Label>
        <Icon sf={{ default: 'ellipsis.circle', selected: 'ellipsis.circle.fill' }} drawable="ic_menu_more" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
