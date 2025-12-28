import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ChangelogItemProps {
  version: string;
  date: string;
  changes: string[];
}

export const ChangelogItem = ({ version, date, changes }: ChangelogItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.version}>{version}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.changesList}>
        {changes.map((change, index) => (
          <Text key={index} style={styles.changeText}>• {change}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  version: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  date: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  changesList: {
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
}));
