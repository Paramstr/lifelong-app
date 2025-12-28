import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { BetaHeader } from '../components/BetaHeader';
import { RoadmapItem } from '../components/RoadmapItem';
import { ChangelogItem } from '../components/ChangelogItem';
import { FeedbackSection } from '../components/FeedbackSection';
import { ROADMAP_ITEMS, CHANGELOG_ITEMS, BETA_INFO } from '../data/beta-data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BetaScreen = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 20, paddingBottom: 100 }]}
    >
      <BetaHeader 
        title="Lifelong Beta"
        description={BETA_INFO.description}
        version={BETA_INFO.version}
        build={BETA_INFO.build}
      />

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
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
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
}));

export default BetaScreen;
