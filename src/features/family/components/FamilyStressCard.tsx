import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CONTAINER_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - (CONTAINER_PADDING * 2) - (CARD_PADDING * 2);

const COLORS = [
  '#eb4d4b', // Brother (Orange/Red)
  '#6ab04c', // Mum (Green)
  '#0984e3', // Dad (Blue)
  '#a29bfe', // Me (Purple)
];

// Mock data for contribution
// "Out of the four people, the family stress is kind of like a combination color in who contributed what"
const CONTRIBUTORS = [
  { color: COLORS[0], percent: 0.1 },  // Brother 10%
  { color: COLORS[1], percent: 0.15 }, // Mum 15%
  { color: COLORS[2], percent: 0.25 }, // Dad 25%
  { color: COLORS[3], percent: 0.1 },  // Me 10%
  // Total 60% stress
];

const TOTAL_BARS = 28; // Number of vertical bars
const TOTAL_STRESS = 0.6; // 60%

export const FamilyStressCard = () => {
    
  // Calculate which bars are filled and what color they should roughly be
  const bars = useMemo(() => {
    const filledBarsCount = Math.round(TOTAL_BARS * TOTAL_STRESS);
    const barsArray = [];

    // Flatten contributions into a linear color map
    // We want to distribute the colors across the filled bars.
    // Simple approach: map the distinct chunks of colors.
    
    let currentBarIndex = 0;
    
    CONTRIBUTORS.forEach(contributor => {
        // How many bars does this person occupy?
        // their_percent / total_stress * filled_bars
        const shareOfStress = contributor.percent / TOTAL_STRESS;
        const barsForPerson = Math.round(shareOfStress * filledBarsCount);
        
        for (let i = 0; i < barsForPerson; i++) {
            if (currentBarIndex < filledBarsCount) {
                barsArray.push({ filled: true, color: contributor.color });
                currentBarIndex++;
            }
        }
    });

    // Fill remaining if rounding errors
    while (barsArray.length < filledBarsCount) {
        barsArray.push({ filled: true, color: CONTRIBUTORS[CONTRIBUTORS.length - 1].color });
    }
    
    // Fill the rest with empty
    for (let i = filledBarsCount; i < TOTAL_BARS; i++) {
        barsArray.push({ filled: false, color: '#eee' });
    }
    
    return barsArray;
  }, []);

  return (
    <GlassView style={styles.card} glassEffectStyle="regular">
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            <Text style={styles.subTitleLabel}>Family Stress</Text>
            <SymbolView name="info.circle" tintColor="#999" style={{ width: 14, height: 14, marginLeft: 4 }} />
        </View>
        <TouchableOpacity style={styles.detailsButton}>
             <SymbolView name="sparkles" tintColor="#444" style={{ width: 14, height: 14, marginRight: 4 }} />
             <Text style={styles.detailsText}>Protocol</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.summaryText}>Medium</Text>

      <View style={styles.barsContainer}>
        {bars.map((bar, index) => (
            <View 
                key={index} 
                style={[
                    styles.bar, 
                    { 
                        backgroundColor: bar.filled ? bar.color : '#e0e0e0', // Fallback color
                        height: bar.filled ? 32 : 32, // potentially vary height? No, image shows uniform
                        opacity: bar.filled ? 1 : 0.3
                    }
                ]} 
            >
                {bar.filled && (
                     <LinearGradient
                        colors={[bar.color, 'rgba(255,255,255,0.4)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                     />
                )}
            </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <SymbolView name="umbrella.fill" tintColor="#666" style={{ width: 18, height: 18 }} />
        <Text style={styles.percentage}>{(TOTAL_STRESS * 100).toFixed(0)}%</Text>
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
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    marginBottom: 12,
  },
  bar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  percentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
