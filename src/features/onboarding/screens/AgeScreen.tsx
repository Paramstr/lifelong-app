import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AgeScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [age, setAge] = useState(data.age?.toString() || '');
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0) return;
    
    updateData({ age: ageNum });
    nextStep();
    router.push('/onboarding/gender');
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>How old are you?</Text>
            <TextInput 
                value={age}
                onChangeText={setAge}
                style={styles.input}
                autoFocus
                keyboardType="number-pad"
                placeholder="Age"
                placeholderTextColor={theme.colors.text.muted}
                onSubmitEditing={handleNext}
                returnKeyType="next"
                maxLength={3}
            />
        </View>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleNext} 
                style={[styles.button, (!age || parseInt(age) <= 0) && styles.disabled]}
                disabled={!age || parseInt(age) <= 0}
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
  input: {
    ...theme.typography.headline,
    fontSize: 28,
    color: theme.colors.text.primary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border.subtle,
    paddingTop: 10,
    paddingBottom: 0,
    height: 60,
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
