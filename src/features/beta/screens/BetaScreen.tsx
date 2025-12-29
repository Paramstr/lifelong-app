import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { RoadmapItem } from '../components/RoadmapItem';
import { ChangelogItem } from '../components/ChangelogItem';
import { FeedbackSection } from '../components/FeedbackSection';
import { ROADMAP_ITEMS, CHANGELOG_ITEMS, BETA_INFO } from '../data/beta-data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressiveBlurHeader } from '@/components/shared/progressive-blur-header';

const BetaScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  
  return (
    <View style={styles.container}>
      <ProgressiveBlurHeader
        scrollY={scrollY}
        height={insets.top + 72}
        insetsTop={insets.top}
        enableBlur={true}
        blurMaxIntensity={60}
        maskStops={[
          { location: 0, opacity: 1 },
          { location: 0.6, opacity: 1 },
          { location: 1, opacity: 0 }
        ]}
        blurRange={[0, 80]}
        backgroundRange={[0, 60]}
        travelRange={[0, 80]}
        travelTranslateY={[0, 32]}
        contentRange={[30, 70]}
        blurTint="light"
        tintColors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.1)']}
        contentStyle={styles.compactHeaderContent}
      >
        <View style={styles.compactHeader}>
           <Text style={styles.compactHeaderTitle}>Lifelong Beta</Text>
        </View>
      </ProgressiveBlurHeader>

      <Animated.ScrollView 
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100, paddingTop: insets.top + 20 }]}
      >

        <View style={[styles.header]}>

          <Text style={styles.headerTitle}>Lifelong Beta</Text>
          <Text style={styles.headerVersion}>v{BETA_INFO.version}</Text>

        </View>

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
      </Animated.ScrollView>
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
  compactHeaderContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  compactHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactHeaderTitle: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    fontSize: 17,
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
