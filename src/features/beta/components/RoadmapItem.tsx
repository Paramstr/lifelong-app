import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface RoadmapItemProps {
  title: string;
  description: string;
  status: string;
}

export const RoadmapItem = ({ title, description, status }: RoadmapItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[
          styles.statusBadge, 
          status === 'in-progress' ? styles.inProgress : styles.pending
        ]}>
          <Text style={[
            styles.statusText,
            status === 'in-progress' ? styles.inProgressText : styles.pendingText
          ]}>
            {status === 'in-progress' ? 'In Progress' : 'Planned'}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.surface.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  description: {
    ...theme.typography.body,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  inProgress: {
    backgroundColor: theme.colors.brand.accent,
  },
  pending: {
    backgroundColor: theme.colors.border.subtle,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  inProgressText: {
    color: theme.colors.text.primary,
  },
  pendingText: {
    color: theme.colors.text.secondary,
  }
}));