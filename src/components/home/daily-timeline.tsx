import AnimatedDashedBorder from '@/components/opal/animated-dashed-border';
import { parseTime } from '@/utils/date-utils';
import { Ionicons } from '@expo/vector-icons';
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
    <View style={styles.cardContainer}>
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
          <TextInput 
              style={styles.input}
              placeholder="Add food"
              placeholderTextColor={theme.colors.text.muted}
          />
        </AnimatedDashedBorder>
      </View>

      <View style={styles.content}>
        {sortedEntries.map((entry, index) => (
          <TimelineItem 
            key={entry.id} 
            showLine={index !== sortedEntries.length - 1} // Or always show line? "Continuous" usually implies connecting.
            // Actually, for "Latest to Earliest", the line goes DOWN from the latest? Or UP? 
            // Standard timeline: Points are on a line. The line connects them.
            // Let's pass 'isLast' to handle the line ending.
            isLast={index === sortedEntries.length - 1}
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
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  cardContainer: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    marginTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
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
    fontSize: theme.typography.headline.fontSize,
    fontWeight: theme.typography.headline.fontWeight,
    color: theme.colors.text.primary,
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.border.subtle,
    borderRadius: theme.radius.xl, // "Squiggly" / soft rounded
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
