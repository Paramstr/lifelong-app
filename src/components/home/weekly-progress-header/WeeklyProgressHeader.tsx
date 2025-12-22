import { getWeekDays, isSameDay } from '@/utils/date-utils';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { DayRing } from './DayRing';

export interface WeeklyProgressHeaderProps {
  title: string;
  completionCount: number;
  weekStart?: 'mon' | 'sun';
  currentDate: Date;
  progressByDay?: Array<{ date: string; progress: number }>;
  onDayPress?: (dateIso: string) => void;
  containerPaddingHorizontal?: number;
  maxWidth?: number;
  colors?: {
    background?: string;
    title?: string;
    chipBg?: string;
    chipText?: string;
    chipIcon?: string;
  };
}

export const WeeklyProgressHeader: React.FC<WeeklyProgressHeaderProps> = ({
  title,
  completionCount,
  weekStart = 'mon',
  currentDate,
  progressByDay = [],
  onDayPress,
  containerPaddingHorizontal = 0,
  maxWidth,
  colors,
}) => {
  const weekDays = useMemo(
    () => getWeekDays(currentDate, weekStart),
    [currentDate, weekStart]
  );

  const progressMap = useMemo(() => {
    const map = new Map<string, number>();
    progressByDay.forEach((p) => map.set(p.date, p.progress));
    return map;
  }, [progressByDay]);

  return (
    <View
      style={[
        styles.outerContainer,
        { paddingHorizontal: containerPaddingHorizontal },
      ]}
    >
      <View style={[styles.contentWrapper, maxWidth ? { maxWidth } : undefined]}>
        {/* Top Row: Title + Completion Chip */}
        <View style={styles.topRow}>
          <Text style={[styles.title, colors?.title ? { color: colors.title } : undefined]}>
            {title}
          </Text>
          
          <View style={[styles.chip, colors?.chipBg ? { backgroundColor: colors.chipBg } : undefined]}>
            <View style={styles.checkmarkContainer}>
                <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={colors?.chipIcon || "#3CB371"} 
                />
            </View>
            <View style={styles.countContainer}>
                <Text style={[styles.countText, colors?.chipText ? { color: colors.chipText } : undefined]}>
                    {completionCount}
                </Text>
            </View>
          </View>
        </View>

        {/* Bottom Row: 7 Days */}
        <View style={styles.weekRow}>
          {weekDays.map((day) => {
            const isSelected = isSameDay(day.date, currentDate);
            const progress = progressMap.get(day.dateIso) || 0;

            const DayContent = (
              <View key={day.dateIso} style={styles.dayItem}>
                <View style={styles.dayTopRow}>
                  {progress >= 1 ? (
                    <Ionicons name="checkmark-circle" size={16} color={styles.checkIcon.color} />
                  ) : (
                    <Text style={[styles.dayNumber, isSelected && styles.selectedDayNumber]}>{day.dayNumber}</Text>
                  )}
                </View>

                <Text style={[styles.weekdayLabel, isSelected && styles.selectedWeekdayLabel]}>
                  {day.weekdayLabel}
                </Text>

                <View style={styles.ringRow}>
                  <DayRing
                    progress={progress}
                    isSelected={isSelected}
                    size={32}
                  />
                </View>
              </View>
            );

            if (onDayPress) {
              return (
                <Pressable
                  key={day.dateIso}
                  onPress={() => onDayPress(day.dateIso)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  {DayContent}
                </Pressable>
              );
            }

            return DayContent;
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  outerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  contentWrapper: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(60, 179, 113, 0.1)', // Light success background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  checkmarkContainer: {
    marginRight: 6,
  },
  countContainer: {
    minWidth: 12,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayItem: {
    alignItems: 'center',
    width: 40, // Consistent footprint
  },
  dayTopRow: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.muted,
  },
  selectedDayNumber: {
    color: theme.colors.brand.primary,
  },
  weekdayLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.text.muted,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  selectedWeekdayLabel: {
    color: theme.colors.brand.primary,
  },
  ringRow: {
    marginTop: 6,
  },
  checkIcon: {
    color: theme.colors.brand.primary,
  },
}));
