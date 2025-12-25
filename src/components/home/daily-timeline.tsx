import AnimatedDashedBorder from '@/components/opal/animated-dashed-border';
import { parseTime } from '@/utils/date-utils';
import { Ionicons } from '@expo/vector-icons';
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
  image?: ImageSourcePropType;
  thought?: string;
};

interface DailyTimelineProps {
  entries: TimelineEntry[];
}

const DailyTimeline: React.FC<DailyTimelineProps> = ({ entries }) => {
  const { theme } = useUnistyles();

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeB - timeA; // Descending: Latest to Earliest
    });
  }, [entries]);

  return (
    <View style={styles.wrapper}>
        <GlassView 
            style={styles.cardContainer}
            glassEffectStyle="regular"
            tintColor={theme.colors.surface.overlay}
        >
        <View style={styles.header}>
            <View style={styles.headerLeft}>
            <Ionicons name="nutrition" size={18} color={theme.colors.brand.primary} />
            <Text style={styles.headerTitle}>Food</Text>
            </View>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.muted} />
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
            const lineOpacity = Math.max(0.2, 1 - progress * 0.8);

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
    marginTop: theme.spacing.sm, // Keep margin outside the glass view
    borderRadius: theme.radius['2xl'],
    // Box shadow for the card itself
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    paddingBottom: theme.spacing.sm,
    borderRadius: theme.radius['2xl'],
    overflow: 'hidden',
    // Border for definition
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderCurve: 'continuous',
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    // SF Pro handled by system font defaults in unistyles theme
    fontSize: theme.typography.headline.fontSize,
    fontWeight: theme.typography.headline.fontWeight,
    color: theme.colors.text.primary,
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  inputWrapper: {
     // No background here, just the border
  },
  input: {
    // Transparent background for input to let glass show through? 
    // Or semi-transparent?
    // User requested "ios native". Native inputs usually have a light background.
    // But since it's within a glass card, maybe slightly translucent.
    // Let's stick closer to the previous design but lighter.
    backgroundColor: 'rgba(0,0,0,0.05)', // Very subtle fill
    borderRadius: theme.radius.xl,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
}));

export default DailyTimeline;
