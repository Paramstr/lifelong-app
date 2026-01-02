import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NutritionTargetsScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  
  const [calories, setCalories] = useState(data.nutritionTargets?.calories || 2400);
  const [protein, setProtein] = useState(data.nutritionTargets?.protein || 150);
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    updateData({ 
        nutritionTargets: { calories, protein } 
    });
    nextStep();
    router.push('/onboarding/lifelong-statement');
  };

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, amount: number) => {
      setter(prev => Math.max(0, prev + amount));
  };

  return (
    <View style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>Your Targets</Text>
            
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>Calories</Text>
                    <Text style={styles.value}>{calories}</Text>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => adjust(setCalories, -50)} style={styles.stepper}><Text style={styles.stepperText}>-</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => adjust(setCalories, 50)} style={styles.stepper}><Text style={styles.stepperText}>+</Text></TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>Protein</Text>
                    <Text style={styles.value}>{protein}g</Text>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => adjust(setProtein, -5)} style={styles.stepper}><Text style={styles.stepperText}>-</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => adjust(setProtein, 5)} style={styles.stepper}><Text style={styles.stepperText}>+</Text></TouchableOpacity>
                </View>
            </View>
        </View>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleNext} 
                style={styles.button}
                activeOpacity={0.8}
             >
                <Text style={styles.buttonText}>Confirm</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.subtle,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text.muted,
    marginBottom: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  stepper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 24,
    fontWeight: '400',
    color: theme.colors.text.primary,
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
