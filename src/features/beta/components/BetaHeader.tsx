import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface BetaHeaderProps {
  title: string;
  version: string;
}

export const BetaHeader = ({ title, version }: BetaHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.versionText}>v{version}</Text>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingTop: 0,
  },
  title: {
    ...theme.typography.display,
    fontSize: 32,
    color: theme.colors.text.primary,
  },
  versionText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    ...theme.typography.body,
  },
}));