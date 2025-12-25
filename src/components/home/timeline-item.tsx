import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface TimelineItemProps {
  children: React.ReactNode;
  showLine?: boolean; // Deprecated but kept for compatibility if needed, though we use isLast now
  isLast?: boolean;
  lineOpacity?: number;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  children,
  isLast = false,
  lineOpacity = 1,
}) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.timelineColumn}>
        {/* Continuous Line */}
        {!isLast && <View style={[styles.line, { opacity: lineOpacity }]} />}
        
        {/* Node */}
        <View style={styles.node} />
      </View>
      <View style={styles.contentColumn}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    minHeight: 80, // Ensure minimum height for the line to look good
  },
  timelineColumn: {
    width: 32,
    alignItems: 'center',
    paddingTop: theme.spacing.md, // Align node with text top approx
  },
  line: {
    position: 'absolute',
    top: theme.spacing.md + 6, // Start below the node center
    bottom: -theme.spacing.md - 6, // Extend to next node
    width: 2,
    backgroundColor: theme.colors.text.muted, // Continuous refined line
    left: 15, // Center in 32px width (32/2 - 1)
  },
  node: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border.subtle, // "Subtle nodes"
    borderWidth: 2,
    borderColor: theme.colors.surface.card, // Gap effect
    zIndex: 1,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 4,
    paddingBottom: theme.spacing.sm,
  },
}));

export default TimelineItem;
