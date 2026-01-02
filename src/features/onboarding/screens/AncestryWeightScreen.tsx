import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AncestryWeightScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [level, setLevel] = useState(data.ancestryInfluence || 'balanced');
  const insets = useSafeAreaInsets();

  const options = ['none', 'balanced', 'strong'];
  const labels = {
    none: 'None',
    balanced: 'Balanced',
    strong: 'Strong'
  };

  const handleNext = () => {
    updateData({ ancestryInfluence: level });
    nextStep();
    router.push('/onboarding/allergies');
  };

  return (
    <View style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>How much should this influence suggestions?</Text>
            
            <View style={styles.sliderContainer}>
                <View style={styles.track} />
                <View style={styles.points}>
                    {options.map((opt) => (
                        <TouchableOpacity 
                            key={opt}
                            style={styles.pointContainer} 
                            onPress={() => setLevel(opt)}
                            activeOpacity={0.8}
                        >
                             <View style={[
                                 styles.point, 
                                 level === opt && styles.activePoint,
                                 level === opt && { backgroundColor: theme.colors.text.primary }
                             ]} />
                             <Text style={[
                                 styles.label, 
                                 level === opt && styles.activeLabel
                             ]}>{labels[opt as keyof typeof labels]}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleNext} 
                style={styles.button}
                activeOpacity={0.8}
             >
                <Text style={styles.buttonText}>Next</Text>
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
    marginBottom: 60,
  },
  sliderContainer: {
    marginTop: 40,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: theme.colors.border.subtle,
    top: 10,
  },
  points: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointContainer: {
    alignItems: 'center',
    width: 80,
  },
  point: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.border.subtle,
    marginBottom: 12,
  },
  activePoint: {
    borderColor: theme.colors.text.primary,
    transform: [{ scale: 1.2 }],
  },
  label: {
    fontSize: 16,
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
  activeLabel: {
    color: theme.colors.text.primary,
    fontWeight: '600',
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
