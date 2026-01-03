import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function InitialSynthesisScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { nextStep } = useOnboarding();

  useEffect(() => {
    // Auto advance
    const timer = setTimeout(() => {
        nextStep();
        router.push('/onboarding/nutrition-targets');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const summary = "We’ll focus on energy stability and gut comfort.";

  return (
    <View style={styles.container}>
        <View style={styles.content}>
            <Animated.Text entering={FadeIn.duration(1000)} style={styles.summary}>
                {summary}
            </Animated.Text>
        </View>
        <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            onPress={() => {
                nextStep();
                router.push('/onboarding/nutrition-targets');
            }} 
        />
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
    alignItems: 'center',
  },
  summary: {
    ...theme.typography.headline,
    fontSize: 28,
    lineHeight: 38,
    color: theme.colors.text.primary,
    textAlign: 'left',
  },
}));
