import { TimelineEntry } from '@/components/home/food/food-timeline';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React, { useState, useMemo } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Line, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type NutrientType = 'Calories' | 'Proteins' | 'Carbs' | 'Fats';

const NUTRIENT_CONFIG: Record<NutrientType, { label: string, unit: string, icon: string, color: string, standard: number }> = {
  'Calories': { label: 'Overall', unit: 'kcal', icon: 'flame.fill', color: '#FF9F0A', standard: 2200 },
  'Proteins': { label: 'Proteins', unit: 'g', icon: 'fish.fill', color: '#30D158', standard: 140 },
  'Carbs': { label: 'Carbs', unit: 'g', icon: 'leaf.fill', color: '#0A84FF', standard: 275 },
  'Fats': { label: 'Fats', unit: 'g', icon: 'drop.fill', color: '#BF5AF2', standard: 78 },
};

const NUTRIENT_KEYS = Object.keys(NUTRIENT_CONFIG) as NutrientType[];

// Expanded Mock Data (10 days) with realistic nutrition values
const MOCK_DATA = [
    { day: 'Wed', meals: [{ name: 'B', calories: 420, proteins: 25, carbs: 45, fats: 15, time: '' }, { name: 'L', calories: 750, proteins: 40, carbs: 80, fats: 28, time: '' }, { name: 'S', calories: 180, proteins: 10, carbs: 20, fats: 8, time: '' }, { name: 'D', calories: 600, proteins: 35, carbs: 60, fats: 22, time: '' }] },
    { day: 'Thu', meals: [{ name: 'B', calories: 380, proteins: 20, carbs: 40, fats: 14, time: '' }, { name: 'L', calories: 680, proteins: 35, carbs: 70, fats: 25, time: '' }, { name: 'S', calories: 220, proteins: 12, carbs: 25, fats: 10, time: '' }, { name: 'D', calories: 550, proteins: 30, carbs: 55, fats: 20, time: '' }] },
    { day: 'Fri', meals: [{ name: 'B', calories: 450, proteins: 28, carbs: 50, fats: 16, time: '' }, { name: 'L', calories: 800, proteins: 45, carbs: 85, fats: 30, time: '' }, { name: 'S', calories: 150, proteins: 8, carbs: 18, fats: 6, time: '' }, { name: 'D', calories: 700, proteins: 38, carbs: 70, fats: 25, time: '' }] },
    { day: 'Sat', meals: [{ name: 'B', calories: 500, proteins: 30, carbs: 60, fats: 18, time: '' }, { name: 'L', calories: 850, proteins: 50, carbs: 90, fats: 32, time: '' }, { name: 'S', calories: 300, proteins: 15, carbs: 35, fats: 12, time: '' }, { name: 'D', calories: 800, proteins: 45, carbs: 80, fats: 28, time: '' }] },
    { day: 'Sun', meals: [{ name: 'B', calories: 350, proteins: 20, carbs: 40, fats: 12, time: '' }, { name: 'L', calories: 600, proteins: 35, carbs: 65, fats: 22, time: '' }, { name: 'S', calories: 100, proteins: 5, carbs: 15, fats: 4, time: '' }, { name: 'D', calories: 500, proteins: 30, carbs: 50, fats: 18, time: '' }] },
    { day: 'Mon', meals: [{ name: 'B', calories: 410, proteins: 24, carbs: 44, fats: 14, time: '' }, { name: 'L', calories: 720, proteins: 42, carbs: 75, fats: 26, time: '' }, { name: 'S', calories: 190, proteins: 11, carbs: 22, fats: 9, time: '' }, { name: 'D', calories: 580, proteins: 33, carbs: 58, fats: 21, time: '' }] },
    { day: 'Tue', meals: [{ name: 'B', calories: 440, proteins: 26, carbs: 48, fats: 15, time: '' }, { name: 'L', calories: 760, proteins: 44, carbs: 82, fats: 29, time: '' }, { name: 'S', calories: 210, proteins: 13, carbs: 24, fats: 9, time: '' }, { name: 'D', calories: 620, proteins: 36, carbs: 62, fats: 23, time: '' }] },
    { day: 'Wed', meals: [{ name: 'B', calories: 390, proteins: 22, carbs: 42, fats: 13, time: '' }, { name: 'L', calories: 690, proteins: 38, carbs: 72, fats: 24, time: '' }, { name: 'S', calories: 160, proteins: 9, carbs: 19, fats: 7, time: '' }, { name: 'D', calories: 570, proteins: 31, carbs: 56, fats: 20, time: '' }] },
    { day: 'Thu', meals: [{ name: 'B', calories: 460, proteins: 29, carbs: 52, fats: 17, time: '' }, { name: 'L', calories: 780, proteins: 46, carbs: 84, fats: 28, time: '' }, { name: 'S', calories: 230, proteins: 14, carbs: 26, fats: 11, time: '' }, { name: 'D', calories: 650, proteins: 37, carbs: 65, fats: 24, time: '' }] },
    { day: 'Fri', meals: [{ name: 'B', calories: 430, proteins: 25, carbs: 46, fats: 16, time: '' }, { name: 'L', calories: 740, proteins: 43, carbs: 79, fats: 27, time: '' }, { name: 'S', calories: 200, proteins: 12, carbs: 23, fats: 8, time: '' }, { name: 'D', calories: 610, proteins: 34, carbs: 60, fats: 22, time: '' }] },
];

// Forest Green to Sky Blue palette
const GRADIENT_COLORS = [
    '#1B4332', // Deep Forest Green (Bottom)
    '#2D6A4F', // Forest Green
    '#5FA8D3', // Soft Steel Blue
    '#9ccefaff', // Soft Sky Blue (Top)
];

interface DailyNutritionGraphProps {
  entries?: TimelineEntry[];
}

export const DailyNutritionGraph = ({ entries = [] }: DailyNutritionGraphProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayData = useMemo(() => {
    const baseData = MOCK_DATA.slice(-4);
    
    if (entries && entries.length > 0) {
        // Parse timeline entries for today
        const todayMeals = entries
            .filter(e => e.type === 'meal')
            .map(e => ({
                name: e.mealType || 'Meal',
                calories: parseFloat(e.calories?.replace(/[^\d.]/g, '') || '0'),
                proteins: parseFloat(e.protein?.replace(/[^\d.]/g, '') || '0'),
                carbs: parseFloat(e.carbs?.replace(/[^\d.]/g, '') || '0'),
                fats: parseFloat(e.fat?.replace(/[^\d.]/g, '') || '0'),
                time: e.time,
            }));

        // Replace the last day (Today) with real data
        // Assuming the last item in MOCK_DATA slice is 'Today'
        const todayData = {
            day: 'Today',
            meals: todayMeals
        };
        
        return [...baseData.slice(0, -1), todayData];
    }
    
    return baseData;
  }, [entries]);

  const selectedNutrient = NUTRIENT_KEYS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + NUTRIENT_KEYS.length) % NUTRIENT_KEYS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % NUTRIENT_KEYS.length);
  };

  const currentConfig = NUTRIENT_CONFIG[selectedNutrient];

  const maxDailyValue = useMemo(() => {
    const dataMax = Math.max(...displayData.map(day => 
      day.meals.reduce((sum, meal) => sum + (meal[selectedNutrient.toLowerCase() as keyof typeof meal.meals[0]] as number), 0)
    ));
    return Math.max(dataMax, currentConfig.standard);
  }, [selectedNutrient, displayData, currentConfig.standard]);

  const renderStandardLine = () => {
    const heightPercentage = (currentConfig.standard / (maxDailyValue * 1.15)) * 100;
    const yPos = `${100 - heightPercentage}%`;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]} pointerEvents="none">
            <Svg height="100%" width="100%">
                <Defs>
                    <SvgLinearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#000" stopOpacity="0" />
                        <Stop offset="0.15" stopColor="#000" stopOpacity="0.4" />
                        <Stop offset="0.85" stopColor="#000" stopOpacity="0.4" />
                        <Stop offset="1" stopColor="#000" stopOpacity="0" />
                    </SvgLinearGradient>
                </Defs>
                <Line
                    x1="0"
                    y1={yPos}
                    x2="100%"
                    y2={yPos}
                    stroke="url(#lineGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                />
            </Svg>
        </View>
    );
  };

  const renderBars = () => {
    return (
      <View style={styles.barsContainer}>
        {renderStandardLine()}
        {displayData.map((dayData, dayIndex) => {
          const isCurrentDay = dayIndex === displayData.length - 1;
          const totalDailyValue = dayData.meals.reduce((sum, meal) => sum + (meal[selectedNutrient.toLowerCase() as keyof typeof meal.meals[0]] as number), 0);
          const totalHeightPercent = (totalDailyValue / (maxDailyValue * 1.15)) * 100;

          return (
            <View 
                key={dayIndex} 
                style={[
                    styles.barGroup,
                    { opacity: isCurrentDay ? 1 : 0.6 } 
                ]}
            >
                <View style={styles.barWrapper}>
                    <View style={styles.stackContainer}>
                        {dayData.meals.map((meal, mealIndex) => {
                            const value = meal[selectedNutrient.toLowerCase() as keyof typeof meal.meals[0]] as number;
                            const heightPercentage = (value / (maxDailyValue * 1.15)) * 100;
                            const colorIndex = Math.min(mealIndex, GRADIENT_COLORS.length - 1);
                            const segmentColor = GRADIENT_COLORS[colorIndex];

                            return (
                                <View 
                                    key={mealIndex}
                                    style={[
                                        styles.mealSegment,
                                        { 
                                            height: `${heightPercentage}%`,
                                            backgroundColor: segmentColor,
                                        }
                                    ]}
                                >
                                    <LinearGradient
                                        colors={[segmentColor, 'rgba(255, 255, 255, 0.22)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        style={StyleSheet.absoluteFill}
                                    />
                                </View>
                            );
                        }).reverse()} 
                    </View>
                    
                    {/* Tooltips for Today */}
                    {isCurrentDay && (
                        <View style={styles.tooltipsContainer}>
                            {dayData.meals.map((meal, mealIndex) => {
                                const value = meal[selectedNutrient.toLowerCase() as keyof typeof meal.meals[0]] as number;
                                const heightPercentage = (value / (maxDailyValue * 1.15)) * 100;
                                
                                // Only show label if segment is significant enough
                                if (heightPercentage < 2) return <View key={mealIndex} style={{ height: `${heightPercentage}%` }} />;

                                return (
                                    <View 
                                        key={mealIndex}
                                        style={[
                                            styles.tooltipSegment,
                                            { height: `${heightPercentage}%` }
                                        ]}
                                    >
                                        <View style={styles.tooltipLine} />
                                        <Text style={styles.tooltipText}>{meal.time}</Text>
                                    </View>
                                );
                            }).reverse()}
                        </View>
                    )}

                    {/* Value Label positioned right on top of the bar */}
                    <View style={[styles.floatingLabel, { bottom: `${totalHeightPercent}%` }]}>
                        <Text style={styles.valueLabel}>
                            {Math.round(totalDailyValue)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.dayLabel}>{dayData.day}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
        <GlassView style={styles.card} glassEffectStyle="regular">
        
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.subTitleLabel}>Daily Nutrition</Text>
                <SymbolView name="info.circle" tintColor="#999" style={{ width: 14, height: 14, marginLeft: 4 }} />
            </View>

            <View style={styles.headerControls}>
                <View style={styles.nutrientInfo}>
                    {/* <SymbolView 
                        name={currentConfig.icon} 
                        tintColor={currentConfig.color} 
                        style={{ width: 18, height: 18 }} 
                    /> */}
                    <Text style={styles.nutrientLabel}>{currentConfig.label}</Text>
                </View>
                <View style={styles.arrows}>
                    <TouchableOpacity onPress={handlePrev} hitSlop={10} style={styles.arrowButton}>
                        <SymbolView name="chevron.left" tintColor="#666" style={{ width: 12, height: 12 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} hitSlop={10} style={styles.arrowButton}>
                        <SymbolView name="chevron.right" tintColor="#666" style={{ width: 12, height: 12 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <View style={styles.graphSection}>
            {renderBars()}
        </View>

        </GlassView>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  wrapper: {
    borderRadius: 24,
    width: '100%',
    shadowColor: theme.shadows.md.shadowColor,
    shadowOffset: theme.shadows.md.shadowOffset,
    shadowOpacity: theme.shadows.md.shadowOpacity,
    shadowRadius: theme.shadows.md.shadowRadius,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0000001a',
    overflow: 'hidden',
  },
  card: {
    padding: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24, 
  },
  headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  subTitleLabel: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  headerControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  nutrientInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  nutrientLabel: {
      fontSize: 17, 
      fontWeight: '500',
      color: theme.colors.text.primary,
      letterSpacing: -0.5,
  },
  arrows: {
      flexDirection: 'row',
      backgroundColor: '#fff', 
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
      height: 24, 
      alignItems: 'center',
  },
  arrowButton: {
      paddingHorizontal: 6,
      height: '100%',
      justifyContent: 'center',
  },
  graphSection: {
      height: 170, 
      paddingHorizontal: 0,
  },
  barsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center', 
      alignItems: 'flex-end',
      gap: 20, 
  },
  barGroup: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'flex-end',
      gap: 8,
  },
  barWrapper: {
      width: 44, 
      flex: 1, 
      justifyContent: 'flex-end',
      // No overflow hidden so label can sit on top if it slightly exceeds height
  },
  stackContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end', 
      gap: 3, 
      borderRadius: 8,
      overflow: 'hidden',
  },
  mealSegment: {
      width: '100%',
      borderRadius: 4, 
      overflow: 'hidden',
  },
  floatingLabel: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      marginBottom: 12, // Tiny gap from top segment
  },
  valueLabel: {
      fontSize: 10,
      fontWeight: '400',
      color: theme.colors.text.primary,
      textAlign: 'center',
  },
  dayLabel: {
      ...theme.typography.xs,
      color: theme.colors.text.secondary,
      fontWeight: '500',
  },
  tooltipsContainer: {
    position: 'absolute',
    left: '100%',
    marginLeft: 2,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    gap: 3, // Matches stackContainer gap
  },
  tooltipSegment: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
  },
  tooltipLine: {
      width: 8,
      height: 1,
      backgroundColor: '#00000015',
      marginRight: 4,
  },
  tooltipText: {
      fontSize: 9,
      color: theme.colors.text.secondary,
      fontWeight: '500',
  },
}));