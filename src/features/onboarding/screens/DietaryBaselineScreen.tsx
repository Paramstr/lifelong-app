import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DietaryBaselineScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [selected, setSelected] = useState(data.dietaryBaseline || '');
  const insets = useSafeAreaInsets();

  const options = ['Mostly home-cooked', 'Mostly eating out', 'Vegetarian', 'Cultural diet'];

  const handleSelect = (option: string) => {
    setSelected(option);
    updateData({ dietaryBaseline: option });
    nextStep();
    router.push('/onboarding/nutrition-context');
  };

  return (
    <View style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>What does your normal diet look like?</Text>
            
            <View style={styles.options}>
                {options.map((option) => (
                    <TouchableOpacity 
                        key={option}
                        style={[
                            styles.optionRow, 
                            selected === option && styles.selectedRow
                        ]}
                        onPress={() => handleSelect(option)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.optionText,
                            selected === option && styles.selectedText
                        ]}>{option}</Text>
                        {selected === option && (
                            <View style={styles.checkmark} />
                        )}
                    </TouchableOpacity>
                ))}
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
    gap: 16,
  },
  optionRow: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedRow: {
    borderBottomColor: theme.colors.text.primary,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '400',
    color: theme.colors.text.primary,
  },
  selectedText: {
    fontWeight: '600',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.text.primary,
  }
}));
