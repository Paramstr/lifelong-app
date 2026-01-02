import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext';
import { useUnistyles } from 'react-native-unistyles';

export default function OnboardingLayout() {
  const { theme } = useUnistyles();
  
  return (
    <OnboardingProvider>
        <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background.primary },
            animation: 'fade', 
        }} />
    </OnboardingProvider>
  );
}
