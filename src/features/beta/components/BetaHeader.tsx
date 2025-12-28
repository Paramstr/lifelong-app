import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface BetaHeaderProps {
  title: string;
  description: string;
  version: string;
  build: string;
}

export const BetaHeader = ({ title, description, version, build }: BetaHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>v{version} ({build})</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.headline,
    fontSize: 28,
    color: theme.colors.text.primary,
  },
  badgeContainer: {
    backgroundColor: theme.colors.brand.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  badgeText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: 16,
    marginTop: theme.spacing.sm,
    ...theme.typography.body,
  },
}));