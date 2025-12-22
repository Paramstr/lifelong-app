import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { StyleSheet } from 'react-native-unistyles';

interface DayRingProps {
  progress: number; // 0 to 1
  dayNumber: number;
  isSelected: boolean;
  size?: number;
  strokeWidth?: number;
}

export const DayRing: React.FC<DayRingProps> = ({
  progress,
  dayNumber,
  isSelected,
  size = 32,
  strokeWidth = 2,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E9EE" // Light gray track
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isSelected ? 'white' : '#94A3B8'} // Hide or match selected if filled
          strokeWidth={isSelected ? 0 : strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View
        style={[
          styles.content,
          StyleSheet.absoluteFill,
          isSelected && styles.selectedFill,
        ]}
      >
        <Text
          style={[
            styles.dayNumber,
            isSelected ? styles.selectedText : styles.unselectedText,
          ]}
        >
          {dayNumber}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.full,
  },
  selectedFill: {
    backgroundColor: theme.colors.brand.primary, // Orange/Coral fill
  },
  dayNumber: {
    fontSize: 14,
  },
  selectedText: {
    color: 'white',
    fontWeight: '700',
  },
  unselectedText: {
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
}));
