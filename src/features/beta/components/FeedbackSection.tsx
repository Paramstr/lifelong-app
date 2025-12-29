import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, Keyboard } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { GlassView } from 'expo-glass-effect';

const TAGS = ['Home', 'Health', 'Family', 'Protocols', 'Bug', 'Idea'];

export const FeedbackSection = () => {
  const [feedback, setFeedback] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSend = () => {
    const subject = `Beta Feedback: ${selectedTag || 'General'}`;
    const body = feedback;
    Linking.openURL(`mailto:param@lifelong.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setFeedback('');
    setSelectedTag(null);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Feedback</Text>
      
      <GlassView style={styles.card} glassEffectStyle="regular">
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />

        <View style={styles.tagsContainer}>
          {TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                selectedTag === tag && styles.selectedTag
              ]}
              onPress={() => setSelectedTag(tag === selectedTag ? null : tag)}
            >
              <Text style={[
                styles.tagText,
                selectedTag === tag && styles.selectedTagText
              ]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, (!feedback && !selectedTag) && styles.disabledButton]} 
          onPress={handleSend}
          disabled={!feedback && !selectedTag}
        >
          <Text style={styles.sendButtonText}>Send Feedback</Text>
        </TouchableOpacity>
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
  },
  headerTitle: {
    ...theme.typography.headline,
    fontSize: 22,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary === '#FFFFFF'
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(20, 20, 20, 0.4)',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    minHeight: 80,
    marginBottom: theme.spacing.lg,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTag: {
    backgroundColor: theme.colors.text.primary,
    borderColor: theme.colors.text.primary,
  },
  tagText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  selectedTagText: {
    color: theme.colors.background.primary,
  },
  sendButton: {
    backgroundColor: theme.colors.brand.primary || '#007AFF',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  sendButtonText: {
    ...theme.typography.headline,
    color: '#FFF',
    fontSize: 16,
  },
}));