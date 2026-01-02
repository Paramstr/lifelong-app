import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Platform } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const REGIONS = [
  "East Asia", "South Asia", "Southeast Asia", 
  "Northern Europe", "Southern Europe", "Eastern Europe", "Western Europe",
  "North Africa", "Sub-Saharan Africa",
  "North America", "Central America", "South America",
  "Middle East", "Oceania"
];

export default function AncestryOriginScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(data.ancestryOrigins || []);
  const insets = useSafeAreaInsets();

  const toggleSelection = (region: string) => {
    setSelected(prev => {
        if (prev.includes(region)) {
            return prev.filter(r => r !== region);
        } else {
            return [...prev, region];
        }
    });
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    updateData({ ancestryOrigins: selected });
    nextStep();
    router.push('/onboarding/ancestry-insight');
  };

  const filtered = REGIONS.filter(r => r.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>Where do your ancestors come from?</Text>
            
            <TextInput 
                value={search}
                onChangeText={setSearch}
                style={styles.searchBar}
                placeholder="Search regions"
                placeholderTextColor={theme.colors.text.muted}
            />

            <FlatList 
                data={filtered}
                keyExtractor={item => item}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const isSelected = selected.includes(item);
                    return (
                        <TouchableOpacity 
                            style={styles.row} 
                            onPress={() => toggleSelection(item)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.regionText}>{item}</Text>
                            {isSelected && (
                                <View style={styles.checkmark} />
                            )}
                        </TouchableOpacity>
                    );
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
             <TouchableOpacity 
                onPress={handleNext} 
                style={[styles.button, selected.length === 0 && styles.disabled]}
                disabled={selected.length === 0}
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
    marginBottom: 24,
  },
  searchBar: {
    ...theme.typography.body,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface.card,
    color: theme.colors.text.primary,
    marginBottom: 24,
  },
  row: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  regionText: {
    fontSize: 18,
    color: theme.colors.text.primary,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.text.primary,
  },
  footer: {
    paddingTop: 20,
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    backgroundColor: theme.colors.background.primary, // obscure list below
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
