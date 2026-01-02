import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COMMON_ALLERGENS = ['Dairy', 'Gluten', 'Eggs', 'Nuts'];

export default function AllergiesScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.allergies || []);
  const [custom, setCustom] = useState('');
  const [customList, setCustomList] = useState<string[]>(data.customAllergies || []);
  const insets = useSafeAreaInsets();

  const toggleAllergen = (item: string) => {
    setSelected(prev => {
        if (prev.includes(item)) return prev.filter(i => i !== item);
        return [...prev, item];
    });
  };

  const addCustom = () => {
      if (custom.trim()) {
          setCustomList(prev => [...prev, custom.trim()]);
          setCustom('');
      }
  };

  const removeCustom = (item: string) => {
      setCustomList(prev => prev.filter(i => i !== item));
  };

  const handleNext = () => {
    updateData({ allergies: selected, customAllergies: customList });
    nextStep();
    router.push('/onboarding/sensitivities');
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
    >
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>Any foods or ingredients you avoid?</Text>
            
            <View style={styles.grid}>
                {COMMON_ALLERGENS.map(item => {
                    const isSelected = selected.includes(item);
                    return (
                        <TouchableOpacity 
                            key={item}
                            style={[styles.card, isSelected && styles.selectedCard]}
                            onPress={() => toggleAllergen(item)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>{item}</Text>
                            {isSelected && <View style={styles.check}><View style={styles.checkInner}/></View>}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.customSection}>
                <TextInput 
                    value={custom}
                    onChangeText={setCustom}
                    style={styles.input}
                    placeholder="Add other..."
                    placeholderTextColor={theme.colors.text.muted}
                    onSubmitEditing={addCustom}
                    returnKeyType="done"
                />
                <View style={styles.customList}>
                    {customList.map(item => (
                        <TouchableOpacity key={item} onPress={() => removeCustom(item)} style={styles.chip}>
                            <Text style={styles.chipText}>{item}</Text>
                            <Text style={styles.chipRemove}>×</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleNext} 
                style={styles.button}
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
    paddingBottom: 100,
  },
  prompt: {
    ...theme.typography.display,
    fontSize: 32,
    color: theme.colors.text.primary,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  card: {
    width: '48%',
    padding: 20,
    backgroundColor: theme.colors.surface.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: theme.colors.text.primary,
    backgroundColor: theme.colors.surface.card,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  selectedCardText: {
    fontWeight: '600',
  },
  check: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.primary,
  },
  customSection: {
    gap: 16,
  },
  input: {
    ...theme.typography.headline,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    paddingTop: 10,
    paddingBottom: 0,
    height: 60,
    color: theme.colors.text.primary,
  },
  customList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.surface.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  chipRemove: {
    color: theme.colors.text.muted,
    fontSize: 18,
    fontWeight: '300',
  },
  footer: {
    paddingTop: 20,
    backgroundColor: theme.colors.background.primary,
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
