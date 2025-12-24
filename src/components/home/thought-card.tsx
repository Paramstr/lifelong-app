import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ThoughtCardProps {
  time: string;
  thought: string;
  onPress?: () => void;
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({
  time,
  thought,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.separator}>-</Text>
        <Text style={styles.headerText}>Thoughts</Text>
      </View>
      <Text style={styles.thoughtText}>“{thought}”</Text>
      <Pressable onPress={onPress} style={styles.viewFullRow}>
        <Text style={styles.viewFullText}>View full</Text>
        <Ionicons name="document-text-outline" size={14} color="#a9a9a9" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    gap: 6,
    paddingVertical: theme.spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.muted,
  },
  separator: {
    fontSize: theme.typography.xs.fontSize,
    color: theme.colors.text.muted,
  },
  headerText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.muted,
  },
  thoughtText: {
    fontSize: theme.typography.title.fontSize,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.title.lineHeight,
  },
  viewFullRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 2,
  },
  viewFullText: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.text.muted,
  },
}));

export default ThoughtCard;
