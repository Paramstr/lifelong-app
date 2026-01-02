import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GenderScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [selected, setSelected] = useState(data.gender || '');
  const insets = useSafeAreaInsets();

  const options = ['Female', 'Male', 'Another identity'];

  const handleSelect = (option: string) => {
    const value = option.toLowerCase();
    setSelected(value);
    updateData({ gender: value });
    nextStep();
    router.push('/onboarding/weight');
  };

  return (
    <View style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>How do you identify?</Text>
            
            <View style={styles.options}>
                {options.map((option) => {
                    const value = option.toLowerCase();
                    const isSelected = selected === value;
                    return (
                        <TouchableOpacity 
                            key={option}
                            style={[
                                styles.optionRow, 
                                isSelected && styles.selectedRow
                            ]}
                            onPress={() => handleSelect(option)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.optionText,
                                isSelected && styles.selectedText
                            ]}>{option}</Text>
                            {isSelected && (
                                <View style={styles.checkmark}>
                                    <View style={styles.checkInner} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    </View>
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
    marginBottom: 40,
  },
  options: {
    gap: 12,
  },
  optionRow: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedRow: {
    backgroundColor: theme.colors.surface.card,
    borderColor: theme.colors.border.subtle,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  selectedText: {
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.background.primary,
  }
}));
