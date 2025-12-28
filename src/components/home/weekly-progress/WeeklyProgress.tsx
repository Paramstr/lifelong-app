import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CIRCLE_SIZE = 35;
const SPACING = 12;
const ITEM_WIDTH = CIRCLE_SIZE + SPACING;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TOTAL_WIDTH = ITEM_WIDTH * DAYS.length;
const H_PADDING = Math.max((SCREEN_WIDTH - TOTAL_WIDTH) / 2, SPACING);

const WeeklyProgress = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Get current day (1 = Mon, ..., 7 = Sun)
  const today = new Date().getDay();
  const currentDayIndex = today === 0 ? 6 : today - 1; // Adjust so Mon=0, Sun=6

  useEffect(() => {
    const maxX = H_PADDING + ITEM_WIDTH * (DAYS.length - 1);
    const scrollX = Math.min(Math.max(H_PADDING + ITEM_WIDTH * currentDayIndex, 0), maxX);

    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: scrollX, animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [currentDayIndex]);

  const renderCircle = (day: string, index: number) => {
    const isCompleted = index < currentDayIndex;
    const isToday = index === currentDayIndex;
    const isFuture = index > currentDayIndex;

    return (
      <View key={day} style={styles.itemContainer}>
        {/* Soft Glow Layer */}
        
        <View 
            style={[
                styles.circle,
                isCompleted && styles.completedCircle,
                isFuture && styles.futureCircle,
                isToday && styles.todayCircle
            ]}
        >
          {isCompleted && (
            <Ionicons name="checkmark" size={24} color="black" style={styles.checkmark} />
          )}
          
          {isToday && (
            <>
                <View style={styles.progressRingLayer}>
                    {/* Semi-filled ring effect */}
                    <View style={styles.ringBackground} />
                    <View style={styles.ringForeground} />
                </View>
                <View style={styles.todayGradientContainer}>
                    <LinearGradient
                      colors={[
                        'rgba(60, 179, 113, 1)', 
                        'rgba(60, 179, 113, 0.4)', 
                        'rgba(60, 179, 113, 0)'
                      ]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0.5, y: 0.5 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.radialGradient}
                    />
                </View>
            </>
          )}
        </View>
        <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>{day}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
      >
        {DAYS.map((day, index) => renderCircle(day, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingVertical: theme.spacing.md,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: CIRCLE_SIZE * 1.5,
    height: CIRCLE_SIZE * 1.5,
    borderRadius: (CIRCLE_SIZE * 1.5) / 2,
    backgroundColor: 'rgba(60, 179, 113, 0.15)',
    top: -CIRCLE_SIZE * 0.25,
    zIndex: -1,
    // Using shadow for the "glow" effect as blur might be expensive or unavailable
    shadowColor: '#3CB371',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  todayGlow: {
    backgroundColor: 'rgba(60, 179, 113, 0.1)',
    shadowOpacity: 0.2,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  completedCircle: {
    backgroundColor: '#38D39F', // More vibrant green
  },
  checkmark: {
    fontWeight: '700',
  },
  futureCircle: {
    borderWidth: 1.5,
    borderColor: theme.colors.weekProgress.future.border,
    backgroundColor: 'rgba(124, 138, 157, 0.1)',
  },
  todayCircle: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  progressRingLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBackground: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(60, 179, 113, 0.15)',
  },
  ringForeground: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#3CB371', // Creates a "quarter" or "half" ring effect
    borderRightColor: '#3CB371',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }], // Adjust rotation for better visual
  },
  todayGradientContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radialGradient: {
    width: CIRCLE_SIZE * 1.4,
    height: CIRCLE_SIZE * 1.4,
    borderRadius: (CIRCLE_SIZE * 1.4) / 2,
    transform: [{ scale: 0.8 }],
  },
  dayLabel: {
    color: theme.colors.weekProgress.label,
    ...theme.typography.small,
    fontWeight: '600',
    marginTop: 2,
  },
  todayLabel: {
    color: theme.colors.text.primary,
    ...theme.typography.label,
    fontWeight: '800',
  },
}));

export default WeeklyProgress;

