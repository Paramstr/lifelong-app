import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext';
import { useUnistyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { OnboardingDebugMenu } from '@/features/onboarding/components/OnboardingDebugMenu';

export default function OnboardingLayout() {
  const { theme } = useUnistyles();
  
  return (
    <OnboardingProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background.primary },
            animation: 'fade', 
        }} />
        <OnboardingDebugMenu />
      </View>
    </OnboardingProvider>
  );
}
