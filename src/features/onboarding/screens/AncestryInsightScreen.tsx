import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AncestryInsightScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { nextStep, data } = useOnboarding();

  useEffect(() => {
    // Auto advance after 4 seconds
    const timer = setTimeout(() => {
        nextStep();
        router.push('/onboarding/ancestry-weight');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const regions = data.ancestryOrigins?.join(', ') || 'your';
  
  // Simple insight generation
  const insight = `People with ${regions} ancestry often adapt well to seasonal eating patterns and may benefit from specific nutrient timings.`;

  return (
    <View style={styles.container}>
        <View style={styles.content}>
            <Animated.Text entering={FadeIn.duration(1000)} style={styles.insight}>
                {insight}
            </Animated.Text>
        </View>
        
        {/* Hidden tap to skip */}
        <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            onPress={() => {
                nextStep();
                router.push('/onboarding/ancestry-weight');
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
  insight: {
    ...theme.typography.headline,
    fontSize: 28,
    lineHeight: 38,
    color: theme.colors.text.primary,
    textAlign: 'left',
  },
}));
