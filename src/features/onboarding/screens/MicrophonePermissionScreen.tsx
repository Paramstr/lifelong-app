import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';

export default function MicrophonePermissionScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { nextStep } = useOnboarding();
  
  const handleAllow = async () => {
    // Placeholder for microphone permission
    nextStep();
    router.push('/onboarding/ancestry-origin');
  };

  return (
    <View style={styles.container}>
        <View style={styles.content}>
             <Text style={styles.description}>Used for voice reflections and check-ins.</Text>
        </View>
        <View style={styles.footer}>
             <TouchableOpacity onPress={handleAllow} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Allow Microphone Access</Text>
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
  description: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontSize: 24,
  },
  footer: {
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
