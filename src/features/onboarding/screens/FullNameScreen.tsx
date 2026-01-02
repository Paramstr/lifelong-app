import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useOnboarding } from '../context/OnboardingContext';

export default function FullNameScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [name, setName] = useState(data.fullName || '');
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (!name.trim()) return;
    updateData({ fullName: name.trim() });
    nextStep();
    router.push('/onboarding/age');
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>What’s your full name?</Text>
            <TextInput 
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoFocus
                placeholder="Your Name"
                placeholderTextColor={theme.colors.text.muted}
                onSubmitEditing={handleNext}
                 
                autoCapitalize="words"
            />
        </View>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleNext} 
                style={[styles.button, !name.trim() && styles.disabled]}
                disabled={!name.trim()}
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
