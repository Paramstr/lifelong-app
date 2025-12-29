import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { SymbolView } from 'expo-symbols';
import { useFoodEntry } from '@/features/food/data/food-store';
import { BlurView } from 'expo-blur';

export default function FoodDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = useFoodEntry(id);
  const router = useRouter();
  const { theme } = useUnistyles();

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Entry not found</Text>
      </View>
    );
  }

  const isProcessing = entry.status !== 'completed';
  const timeString = new Date(entry.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={typeof entry.imageUri === 'string' ? { uri: entry.imageUri } : entry.imageUri} 
            style={styles.headerImage} 
          />
          <TouchableOpacity style={styles.cameraButton}>
             <SymbolView name="camera.fill" tintColor="white" style={{ width: 20, height: 18 }} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
            {/* Metadata */}
            <View style={styles.metadataRow}>
                <Text style={styles.metadataText}>{timeString}</Text>
                {entry.mealType && (
                    <>
                        <Text style={styles.metadataDot}>•</Text>
                        <Text style={styles.metadataText}>{entry.mealType}</Text>
                    </>
                )}
            </View>

            {/* Title */}
            <Text style={styles.title}>{entry.title || 'Analyzing meal...'}</Text>

            {/* Macro Summary */}
            {!isProcessing && entry.summary && (
                <View style={styles.macroRow}>
                    <Text style={styles.macroText}>
                        <Text style={styles.macroValue}>{Math.round(entry.summary.calories)}</Text> cal
                    </Text>
                    <Text style={styles.macroSeparator}>|</Text>
                    <Text style={styles.macroText}>
                        <Text style={styles.macroValue}>{Math.round(entry.summary.protein)}g</Text> protein
                    </Text>
                    <Text style={styles.macroSeparator}>|</Text>
                    <Text style={styles.macroText}>
                        <Text style={styles.macroValue}>{Math.round(entry.summary.carbs)}g</Text> carbs
                    </Text>
                    <Text style={styles.macroSeparator}>|</Text>
                    <Text style={styles.macroText}>
                        <Text style={styles.macroValue}>{Math.round(entry.summary.fat)}g</Text> fat
                    </Text>
                </View>
            )}

            {isProcessing && (
                <View style={styles.processingContainer}>
                    <Text style={styles.processingText}>Identifying ingredients...</Text>
                </View>
            )}

            {/* Ingredients List */}
            {!isProcessing && entry.ingredients && (
                <View style={styles.ingredientsList}>
                    {entry.ingredients.map((ingredient) => (
                        <View key={ingredient.id} style={styles.ingredientRow}>
                            <Image 
                                source={typeof ingredient.imageUri === 'string' ? { uri: ingredient.imageUri } : ingredient.imageUri} 
                                style={styles.ingredientImage} 
                            />
                            <View style={styles.ingredientInfo}>
                                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                                <Text style={styles.ingredientMacros}>
                                    {Math.round(ingredient.calories)} cal • {Math.round(ingredient.protein)}g p
                                </Text>
                            </View>
                            
                            <View style={styles.stepper}>
                                <TouchableOpacity style={styles.stepperBtn}>
                                    <SymbolView name="minus" tintColor={theme.colors.text.secondary} style={{ width: 12, height: 2 }} />
                                </TouchableOpacity>
                                <Text style={styles.stepperValue}>{ingredient.quantity} {ingredient.unit}</Text>
                                <TouchableOpacity style={styles.stepperBtn}>
                                    <SymbolView name="plus" tintColor={theme.colors.text.secondary} style={{ width: 12, height: 12 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary || '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 100,
    color: theme.colors.text.secondary,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  content: {
    padding: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  metadataDot: {
    marginHorizontal: 6,
    color: theme.colors.text.muted,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  macroText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  macroValue: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  macroSeparator: {
    marginHorizontal: 8,
    color: theme.colors.text.muted,
    opacity: 0.5,
  },
  processingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  processingText: {
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  ingredientsList: {
    gap: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border?.subtle || '#f0f0f0',
  },
  ingredientImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.background.secondary || '#f5f5f5',
  },
  ingredientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  ingredientMacros: {
    fontSize: 13,
    color: theme.colors.text.muted,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary || '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 4,
    minWidth: 40,
    textAlign: 'center',
  },
}));
