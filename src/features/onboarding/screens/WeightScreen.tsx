import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WeightScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [weight, setWeight] = useState(data.weight?.toString() || '');
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) return;
    
    updateData({ weight: weightNum, weightUnit: 'kg' });
    nextStep();
    router.push('/onboarding/camera-permission');
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>What’s your current weight?</Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    value={weight}
                    onChangeText={setWeight}
                    style={styles.input}
                    autoFocus
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={theme.colors.text.muted}
                    onSubmitEditing={handleNext}
                    returnKeyType="next"
                    maxLength={5}
                />
                <Text style={styles.unit}>kg</Text>
            </View>
        </View>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleNext} 
                style={[styles.button, (!weight || parseFloat(weight) <= 0) && styles.disabled]}
                disabled={!weight || parseFloat(weight) <= 0}
                activeOpacity={0.8}
             >
                <Text style={styles.buttonText}>Next</Text>
             </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
  },
  prompt: {
    ...theme.typography.display,
    fontSize: 32,
    color: theme.colors.text.primary,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border.subtle,
    paddingVertical: 12,
  },
  input: {
    ...theme.typography.headline,
    fontSize: 28,
    color: theme.colors.text.primary,
    flex: 1,
  },
  unit: {
    fontSize: 28,
    color: theme.colors.text.muted,
    fontWeight: '500',
    marginLeft: 8,
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
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: theme.colors.background.primary,
    fontSize: 18,
    fontWeight: '600',
  },
}));
