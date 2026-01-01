import AnimatedDashedBorder from '@/components/opal/animated-dashed-border';
import { parseTime } from '@/utils/date-utils';
import { SymbolView } from 'expo-symbols';
import { GlassView } from 'expo-glass-effect';
import React, { useMemo } from 'react';
import { ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useFoodEntries, useFoodScanActions } from '@/features/food/data/food-store';
import MealCard from './meal-card';
import ThoughtCard from './thought-card';
import TimelineItem from './timeline-item';

// Legacy type for reference, but we map from FoodEntry now
export type TimelineEntry = {
  id: string;
  time: string;
  type: 'meal' | 'thought';
  title?: string;
  mealType?: string;
  calories?: string;
  carbs?: string;
  protein?: string;
  fat?: string;
  fiber?: string;
  image?: ImageSourcePropType;
  thought?: string;
};

const FoodTimeline: React.FC = () => {
  const { theme } = useUnistyles();
  const entries = useFoodEntries();
  const { createFoodScan, analyzeFoodScan } = useFoodScanActions();
  const router = useRouter();

  const USE_MOCK_CAMERA = true;
  const mockImageUrl =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";
  const fallbackImage = require('../../../../assets/images/chicken-rice-bowl.png');

  const handleCamera = async () => {
    if (USE_MOCK_CAMERA) {
      // Bypass camera for design testing
      try {
        const scanId = await createFoodScan({
          imageUrl: mockImageUrl,
          source: "camera",
        });
        void analyzeFoodScan({ scanId });
        router.push(`/food/${scanId}`);
      } catch (error) {
        console.warn("Failed to create food scan.", error);
      }
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
    alert("You've refused to allow this appp to access your camera!");
    return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
    });

    if (!result.canceled) {
    try {
      const scanId = await createFoodScan({
        imageUrl: result.assets[0].uri,
        source: "camera",
      });
      void analyzeFoodScan({ scanId });
    } catch (error) {
      console.warn("Failed to create food scan.", error);
    }
    }
  }

  const macroTotals = useMemo(() => {
    return entries.reduce(
      (totals, entry) => {
        if (!entry.summary) return totals;
        return {
          calories: totals.calories + (entry.summary.calories || 0),
          protein: totals.protein + (entry.summary.protein || 0),
          carbs: totals.carbs + (entry.summary.carbs || 0),
          fat: totals.fat + (entry.summary.fat || 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [entries]);

  return (
    <View style={styles.wrapper}>
        <GlassView 
            style={styles.cardContainer}
            glassEffectStyle="regular"
            tintColor='rgba(255, 255, 255, 0.63)'
        >
        <View style={styles.header}>
            <View style={styles.headerLeft}>
            <SymbolView 
                name="carrot.fill" 
                tintColor={theme.colors.brand.primary} 
                style={{ width: 18, height: 18 }} 
            />
            <Text style={styles.headerTitle}>Food</Text>
            </View>
            <View style={styles.headerRight}>
                <View style={styles.editAction}>
                    <SymbolView 
                        name="square.and.pencil" 
                        tintColor={theme.colors.text.muted} 
                        style={{ width: 16, height: 16 }} 
                    />
                    <Text style={styles.editText}>Edit</Text>
                </View>
            </View>
        </View>
        
        <View style={styles.targetsRow}>
            <View style={styles.targetItem}>
                <Text style={styles.targetText}>
                    <Text style={styles.targetLabel}>cal</Text>{' '}
                    <Text style={styles.targetValue}>{Math.round(macroTotals.calories)}</Text>/2000
                </Text>
            </View>
            <View style={styles.targetItem}>
                <Text style={styles.targetText}>
                    <Text style={styles.targetLabel}>protein</Text>{' '}
                    <Text style={styles.targetValue}>{Math.round(macroTotals.protein)}</Text>/120
                </Text>
            </View>
            <View style={styles.targetItem}>
                <Text style={styles.targetText}>
                    <Text style={styles.targetLabel}>carbs</Text>{' '}
                    <Text style={styles.targetValue}>{Math.round(macroTotals.carbs)}</Text>/250
                </Text>
            </View>
            <View style={styles.targetItem}>
                <Text style={styles.targetText}>
                    <Text style={styles.targetLabel}>fat</Text>{' '}
                    <Text style={styles.targetValue}>{Math.round(macroTotals.fat)}</Text>/70
                </Text>
            </View>
        </View>

        <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleCamera} activeOpacity={0.8}>
                <AnimatedDashedBorder
                borderRadius={theme.radius.xl}
                strokeColor={theme.colors.text.muted}
                dashLength={8}
                gapLength={4}
                >
                <View style={styles.inputWrapper}>
                    <Text style={styles.placeholderText}>Add food</Text>
                    <SymbolView name="camera.fill" tintColor={theme.colors.text.muted} style={{ width: 20, height: 18 }} />
                </View>
                </AnimatedDashedBorder>
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
            {entries.map((entry, index) => {
            const total = entries.length;
            const progress = total > 1 ? index / (total - 1) : 0;
            const lineOpacity = Math.max(0.2, 0.6 - progress * 0.8);

            const timeString = new Date(entry.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();

            return (
            <TouchableOpacity 
                key={entry.id}
                onPress={() => router.push(`/food/${entry.id}`)}
                activeOpacity={0.7}
            >
                <TimelineItem 
                    showLine={index !== entries.length - 1}
                    isLast={index === entries.length - 1}
                    lineOpacity={lineOpacity}
                >
                    <MealCard
                        time={timeString}
                        mealType={entry.mealType || 'Meal'}
                        title={entry.title || 'Processing...'}
                        calories={entry.summary ? String(Math.round(entry.summary.calories)) : '-'}
                        carbs={entry.summary ? String(Math.round(entry.summary.carbs)) : '-'}
                        protein={entry.summary ? String(Math.round(entry.summary.protein)) : '-'}
                        fat={entry.summary ? String(Math.round(entry.summary.fat)) : '-'}
                        image={
                          entry.imageUri
                            ? { uri: entry.imageUri }
                            : fallbackImage
                        }
                    />
                </TimelineItem>
            </TouchableOpacity>
            );
            })}
        </View>
        </GlassView>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  wrapper: {
    marginTop: theme.spacing.sm,
    borderRadius: 24,
    width: '100%',
    // Box shadow for the card itself
    shadowColor: theme.shadows.md.shadowColor,
    shadowOffset: theme.shadows.md.shadowOffset,
    shadowOpacity: theme.shadows.md.shadowOpacity,
    shadowRadius: theme.shadows.md.shadowRadius,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0000001a',
  },
  cardContainer: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    // SF Pro handled by system font defaults in unistyles theme
    ...theme.typography.headline,
    color: theme.colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  editAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editText: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
  inputContainer: {
    marginTop: 0,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  targetsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 6,
    marginBottom: 16,
    alignItems: 'center',
    opacity: 0.8,
  },
  targetItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetText: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    letterSpacing: -0.1,
  },
  targetLabel: {
    ...theme.typography.xs,
    color: theme.colors.text.muted,
  },
  targetValue: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: theme.radius.xl,
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
  },
  content: {
    // Content padding handled by container
  },
}));

export default FoodTimeline;
