import React from 'react';
import { View } from 'react-native';
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
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const radius = size / 2 - strokeWidth - 1; // slight inset for breathing room
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E9EE"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isSelected ? '#ff7a45' : '#94A3B8'}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
