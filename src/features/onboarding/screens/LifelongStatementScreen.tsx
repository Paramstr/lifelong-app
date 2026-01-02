import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function LifelongStatementScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data, saveProgress } = useOnboarding();
  const insets = useSafeAreaInsets();

  const handleBegin = async () => {
    updateData({ completedAt: Date.now() });
    // Force save via context (we might need to expose it specifically or rely on nextStep)
    // But nextStep usually triggers save. 
    // However, here we finish.
    // Let's manually trigger nextStep() which increments step to indicate "Post-onboarding" 
    // and triggers save, then redirect.
    // Or, we might want to redirect immediately.
    // Ideally, we wait for save.
    // The context's save logic runs on step change.
    // Let's call updateData then a small delay or manual save.
    // Since we don't expose manual save in context (it's internal), we rely on updateData + unmount?
    // Wait, context unmounts if we navigate away? 
    // No, OnboardingProvider is in `app/onboarding/_layout.tsx`.
    // If we navigate to `/`, `app/onboarding` unmounts.
    // So we must ensure save completes before navigating.
    // We'll update the context to expose saveProgress.
    
    // I added saveProgress to context interface in my thought but not sure if I exported it.
    // Let's check context file.
    // Yes, I exported saveProgress.
    await saveProgress();
    
    router.replace('/');
  };

  return (
    <View style={styles.container}>
        <View style={styles.content}>
            <Animated.Text entering={FadeIn.duration(1000)} style={styles.statement}>
                Your journey to longevity begins now.
            </Animated.Text>
        </View>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleBegin} 
                style={styles.button}
                activeOpacity={0.8}
             >
                <Text style={styles.buttonText}>Begin</Text>
             </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statement: {
    ...theme.typography.display,
    fontSize: 32,
    lineHeight: 40,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  footer: {
    paddingTop: 20,
  },
  button: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.background.primary,
    fontSize: 18,
    fontWeight: '600',
  },
}));
