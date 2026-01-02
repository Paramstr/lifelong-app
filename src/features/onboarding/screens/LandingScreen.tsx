import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SoftRadialGradient from '@/components/shared/soft-radial-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useOnboarding } from '../context/OnboardingContext';

export default function LandingScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { nextStep } = useOnboarding();

  const handleContinue = () => {
    nextStep();
    router.push('/onboarding/sign-in');
  };

  return (
    <View style={styles.container}>
      <SoftRadialGradient />
      
      <View style={styles.content}>
        <Animated.Text entering={FadeIn.delay(300).duration(800)} style={styles.headline}>
          Health that grows with you.
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(800).duration(800)} style={styles.subheadline}>
          Vitality · Protocols · Family
        </Animated.Text>
      </View>

      <View style={styles.footer}>
        <Animated.View entering={FadeInDown.delay(1200).duration(800)}>
            <TouchableOpacity onPress={handleContinue} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headline: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.text.primary,
    lineHeight: 52,
    letterSpacing: -1,
  },
  subheadline: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '400',
    color: theme.colors.text.muted,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 60,
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
