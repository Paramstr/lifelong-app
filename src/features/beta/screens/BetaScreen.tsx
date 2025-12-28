import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { RoadmapItem } from '../components/RoadmapItem';
import { ChangelogItem } from '../components/ChangelogItem';
import { FeedbackSection } from '../components/FeedbackSection';
import { ROADMAP_ITEMS, CHANGELOG_ITEMS, BETA_INFO } from '../data/beta-data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DebugLayout } from '@/components/shared/DebugLayout';

const BetaScreen = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
      >
        <DebugLayout>
        <View style={[styles.header, { marginTop: 0}]}>
          <DebugLayout>
          <Text style={styles.headerTitle}>Lifelong Beta</Text>
          <Text style={[styles.headerVersion, { marginLeft: 8}]}>v{BETA_INFO.version}</Text>
          </DebugLayout>
        </View>
        </DebugLayout>
        <Text style={styles.description}>{BETA_INFO.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roadmap</Text>
          {ROADMAP_ITEMS.map(item => (
            <RoadmapItem key={item.id} {...item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changelog</Text>
          {CHANGELOG_ITEMS.map((item, index) => (
            <ChangelogItem key={index} {...item} />
          ))}
        </View>

        <FeedbackSection />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.display,
    fontSize: 32,
    color: theme.colors.text.primary,
  },
  headerVersion: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    ...theme.typography.body,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.xs,
  },
  description: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
    // paddingHorizontal: theme.spacing.sm,
    ...theme.typography.body,
  },
}));

export default BetaScreen;
