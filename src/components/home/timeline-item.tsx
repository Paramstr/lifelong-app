import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface TimelineItemProps {
  children: React.ReactNode;
  showLine?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  children,
  showLine = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.timelineColumn}>
        {showLine && <View style={styles.line} />}
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
    width: 24,
    alignItems: 'center',
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 4,
  },
}));

export default TimelineItem;
