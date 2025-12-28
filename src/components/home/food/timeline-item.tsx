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
  lineOpacity = 0.8,
}) => {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.timelineColumn}>
        {/* Continuous Line */}
        <View 
          style={[
            styles.line, 
            { opacity: lineOpacity },
            isLast ? { height: 52 } : { bottom: -12 }
          ]} 
        />
        
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
  },
  timelineColumn: {
    width: 28,
    alignItems: 'center',
    paddingTop: 4, // Align node with text top approx (17/2 - 10/2 = 3.5)
  },
  line: {
    position: 'absolute',
    top: 9, // Start at node center (paddingTop 4 + nodeHeight/2 5)
    width: 2,
    backgroundColor: theme.colors.text.muted, // Match node color for continuity
    left: 13, // Center in 28px width (28/2 - 1)
  },
  node: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.text.muted,
    borderWidth: 2,
    borderColor: theme.colors.surface.card, // Gap effect
    zIndex: 1,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 32, // More spacing between items as per screenshot
  },
}));

export default TimelineItem;
