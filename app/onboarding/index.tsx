import { Redirect } from 'expo-router';
import { useOnboarding } from '@/features/onboarding/context/OnboardingContext';
import { View, ActivityIndicator } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

export default function OnboardingIndex() {
  const { step, isLoading } = useOnboarding();
  const { theme } = useUnistyles();

  if (isLoading) {
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary}}>
            <ActivityIndicator color={theme.colors.text.primary} />
          </View>
      );
  }

  const routes = [
      'landing', 'sign-in', 'full-name', 'age', 'gender', 'weight',
      'camera-permission', 'microphone-permission',
      'ancestry-origin', 'ancestry-insight', 'ancestry-weight',
      'allergies', 'sensitivities', 'dietary-baseline', 'nutrition-context',
      'initial-synthesis', 'nutrition-targets', 'lifelong-statement'
  ];
  
  const route = routes[step] || 'landing';
  
  return <Redirect href={`/onboarding/${route}`} />;
}
