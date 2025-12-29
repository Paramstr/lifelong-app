import AnimatedDashedBorder from '@/components/opal/animated-dashed-border';
import { parseTime } from '@/utils/date-utils';
import { SymbolView } from 'expo-symbols';
import { GlassView } from 'expo-glass-effect';
import React, { useMemo } from 'react';
import { ImageSourcePropType, Text, TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MealCard from './meal-card';
import ThoughtCard from './thought-card';
import TimelineItem from './timeline-item';

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

interface FoodTimelineProps {
  entries: TimelineEntry[];
}

const FoodTimeline: React.FC<FoodTimelineProps> = ({ entries }) => {
  const { theme } = useUnistyles();

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeB - timeA; // Descending: Latest to Earliest
    });
  }, [entries]);

  const totalCalories = useMemo(() => {
    return entries.reduce((sum, entry) => {
      if (entry.type !== 'meal' || !entry.calories) {
        return sum;
      }
      const parsed = Number(entry.calories.replace(/[^\d.]/g, ''));
      if (Number.isNaN(parsed)) {
        return sum;
      }
      return sum + parsed;
    }, 0);
  }, [entries]);

  const caloriesSummary = totalCalories > 0
    ? `${Math.round(totalCalories).toLocaleString()} cal`
    : '0 cal';

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
                    <Text style={styles.targetValue}>820</Text>/2000
                </Text>
            </View>
            <View style={styles.targetItem}>
                <Text style={styles.targetText}>
                    <Text style={styles.targetLabel}>protein</Text>{' '}
                    <Text style={styles.targetValue}>45</Text>/120
                </Text>
            </View>
            <View style={styles.targetItem}>
                <Text style={styles.targetText}>
                    <Text style={styles.targetLabel}>carbs</Text>{' '}
                    <Text style={styles.targetValue}>90</Text>/250
                </Text>
            </View>
            <View style={styles.targetItem}>
                <Text style={styles.targetText}>
                    <Text style={styles.targetLabel}>fat</Text>{' '}
                    <Text style={styles.targetValue}>30</Text>/70
                </Text>
            </View>
        </View>

        <View style={styles.inputContainer}>
            <AnimatedDashedBorder
            borderRadius={theme.radius.xl}
            strokeColor={theme.colors.text.muted}
            dashLength={8}
            gapLength={4}
            >
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input}
                    placeholder="Add food"
                    placeholderTextColor={theme.colors.text.muted}
                />
            </View>
            </AnimatedDashedBorder>
        </View>

        <View style={styles.content}>
            {sortedEntries.map((entry, index) => {
            const total = sortedEntries.length;
            const progress = total > 1 ? index / (total - 1) : 0;
            const lineOpacity = Math.max(0.2, 0.6 - progress * 0.8);

            return (
            <TimelineItem 
                key={entry.id} 
                showLine={index !== sortedEntries.length - 1}
                isLast={index === sortedEntries.length - 1}
                lineOpacity={lineOpacity}
            >
                {entry.type === 'meal' ? (
                <MealCard
                    time={entry.time}
                    mealType={entry.mealType || ''}
                    title={entry.title || ''}
                    calories={entry.calories || ''}
                    carbs={entry.carbs || ''}
                    protein={entry.protein || ''}
                    fat={entry.fat || ''}
                    fiber={entry.fiber || ''}
                    image={entry.image!}
                />
                ) : (
                <ThoughtCard
                    time={entry.time}
                    thought={entry.thought || ''}
                />
                )}
            </TimelineItem>
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
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 8,
    marginTop: 6,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
     // No background here, just the border
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.05)', // Very subtle fill
    borderRadius: theme.radius.xl,
    paddingVertical: 18,
    paddingHorizontal: 16,
    textAlign: 'center',
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  content: {
    // Content padding handled by container
  },
}));

export default FoodTimeline;
