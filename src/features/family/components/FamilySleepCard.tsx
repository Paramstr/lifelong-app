import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock Data
const FAMILY_MEMBERS = ['Param', 'Kulwinder', 'Satbir', 'Gurleen'];

const MOCK_DATA = {
  'Param': {
    summary: 'Param slept like a baby 6 out of 7 nights',
    trend: '+8% vs last week',
    avgScore: 92,
    bars: [0.9, 0.95, 0.8, 0.9, 0.92, 0.85, 0.98]
  },
  'Kulwinder': {
    summary: 'Kulwinder maintained a consistent schedule',
    trend: '+2% vs last week',
    avgScore: 78,
    bars: [0.7, 0.75, 0.8, 0.7, 0.85, 0.75, 0.8]
  },
  'Satbir': {
    summary: 'Satbir needs more rest on weekends',
    trend: '-5% vs last week',
    avgScore: 65,
    bars: [0.6, 0.5, 0.8, 0.65, 0.6, 0.4, 0.3]
  },
  'Gurleen': {
    summary: 'Gurleen is improving her deep sleep',
    trend: '+15% vs last week',
    avgScore: 88,
    bars: [0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 0.9]
  },
};

export const FamilySleepCard = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const currentUser = FAMILY_MEMBERS[currentUserIndex];
  const stats = MOCK_DATA[currentUser as keyof typeof MOCK_DATA];

  const handlePrev = () => {
    setCurrentUserIndex((prev) => (prev - 1 + FAMILY_MEMBERS.length) % FAMILY_MEMBERS.length);
  };

  const handleNext = () => {
    setCurrentUserIndex((prev) => (prev + 1) % FAMILY_MEMBERS.length);
  };

  // Bar rendering helper
  const renderBars = () => {
    return (
      <View style={styles.barsContainer}>
        {stats.bars.map((value, index) => {
            // Determine color based on value
            let barColor = '#ff6b6b'; // Red/Orange for low
            if (value > 0.75) barColor = '#51cf66'; // Green for high
            else if (value > 0.5) barColor = '#fcc419'; // Yellow for mid

            return (
                <View key={index} style={styles.barGroup}>
                    <View style={styles.barWrapper}>
                        <View style={[styles.barTrack]} />
                        <View 
                            style={[
                                styles.barFill, 
                                { 
                                    height: `${value * 100}%`,
                                    backgroundColor: barColor,
                                }
                            ]} 
                        >
                             <LinearGradient
                                colors={[barColor, 'rgba(255,255,255,0.4)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={StyleSheet.absoluteFill}
                             />
                        </View>
                    </View>
                    <Text style={styles.dayLabel}>{DAYS[index]}</Text>
                </View>
            );
        })}
      </View>
    );
  };

  return (
    <GlassView style={styles.card} glassEffectStyle="regular">
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            <Text style={styles.subTitleLabel}>Sleep quality</Text>
            <SymbolView name="info.circle" tintColor="#999" style={{ width: 14, height: 14, marginLeft: 4 }} />
        </View>
        <TouchableOpacity style={styles.detailsButton}>
             <SymbolView name="sparkles" tintColor="#444" style={{ width: 14, height: 14, marginRight: 4 }} />
             <Text style={styles.detailsText}>Protocol</Text>
        </TouchableOpacity>
      </View>

      {/* Main Stats / Summary */}
      <Animated.View 
        key={`summary-${currentUser}`} 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(200)}
      >
          <Text style={styles.summaryText}>
            {stats.summary}
          </Text>
      </Animated.View>

      {/* Visualization Graph */}
      <View style={styles.graphSection}>
          {renderBars()}
      </View>

      {/* Footer / Controls */}
      <View style={styles.footer}>
        <View style={styles.userControl}>
            <Text style={styles.userName}>{currentUser}</Text>
            <View style={styles.arrows}>
                <TouchableOpacity onPress={handlePrev} hitSlop={10} style={styles.arrowButton}>
                     <SymbolView name="chevron.left" tintColor="#666" style={{ width: 14, height: 14 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext} hitSlop={10} style={styles.arrowButton}>
                     <SymbolView name="chevron.right" tintColor="#666" style={{ width: 14, height: 14 }} />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.trendContainer}>
             <Text style={[
                 styles.trendText, 
                 { color: stats.trend.startsWith('+') ? '#2d9f48' : '#e03131' }
             ]}>
                {stats.trend}
             </Text>
        </View>
      </View>

    </GlassView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  subTitleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2', // Light grey pill
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
  },
  detailsText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#333',
  },
  summaryText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    lineHeight: 26,
    marginBottom: 24,
    letterSpacing: -0.4,
  },
  graphSection: {
      height: 110, // Increased for labels
      marginBottom: 20,
  },
  barsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'flex-end',
      paddingHorizontal: 0, 
  },
  barGroup: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'flex-end',
      gap: 6,
  },
  barWrapper: {
      width: 24, 
      flex: 1, // Fixed height via flex
      backgroundColor: '#f0f0f0',
      borderRadius: 6,
      overflow: 'hidden',
      justifyContent: 'flex-end',
  },
  barTrack: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
  },
  barFill: {
      width: '100%',
      borderRadius: 6, // Round top and bottom corners
      overflow: 'hidden',
  },
  dayLabel: {
      fontSize: 11,
      fontWeight: '500',
      color: '#999',
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)',
      paddingTop: 16,
  },
  userControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  userName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
  },
  arrows: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#eee',
      height: 28,
      alignItems: 'center',
  },
  arrowButton: {
      paddingHorizontal: 8,
      height: '100%',
      justifyContent: 'center',
  },
  trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  trendText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#2d9f48', // Green trend (overwritten by dynamic color)
  }
});
