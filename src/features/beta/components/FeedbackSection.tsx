import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export const FeedbackSection = () => {
  const handlePress = () => {
    Linking.openURL('mailto:feedback@lifelong.app?subject=Lifelong Beta Feedback');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Have Feedback?</Text>
      <Text style={styles.description}>
        We are actively building this. Let us know what you think or if you found a bug.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Send Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.brand.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.full,
  },
  buttonText: {
    ...theme.typography.label,
    color: theme.colors.text.inverse,
    fontSize: 16,
  },
}));
