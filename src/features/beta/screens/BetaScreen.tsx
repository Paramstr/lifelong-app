import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { RoadmapSection } from '../components/RoadmapSection';
import { FeedbackSection } from '../components/FeedbackSection';
import { BETA_INFO } from '../data/beta-data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressiveBlurHeader } from '@/components/shared/progressive-blur-header';
import { DebugLayout } from '@/components/shared/DebugLayout';

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
        height={insets.top + 60}
        insetsTop={insets.top}
        enableBlur={true}
        blurMaxIntensity={80}
        blurTint="regular"
        contentStyle={styles.compactHeaderContent}
      >
        <View style={styles.compactHeader}>
           <View style={styles.compactTitleRow}>
              <Text style={styles.compactHeaderTitle}>Lifelong</Text>
              <View style={styles.compactBetaBadge}>
                <Text style={styles.compactBetaText}>BETA</Text>
              </View>
           </View>
        </View>
      </ProgressiveBlurHeader>

      <Animated.ScrollView 
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100, paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
              

        <View style={styles.headerContainer}>
          <View style={styles.titleColumn}>
            <View style={styles.titleRow}>
              <Text style={styles.appName}>Lifelong</Text>
              <View style={styles.betaBadge}>
                <Text style={styles.betaText}>BETA</Text>
              </View>
            </View>
            
          </View>

          <TouchableOpacity style={styles.changelogButton}>
             <Text style={styles.changelogText}>v{BETA_INFO.version} Changelog</Text>
          </TouchableOpacity>
        </View>



        <RoadmapSection />

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
    paddingHorizontal: theme.spacing.md,
  },
  compactHeaderContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 10,
  },
  compactHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  compactTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  compactHeaderTitle: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    fontSize: 17,
  },
  compactBetaBadge: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginLeft: 4,
    marginTop: 2,
  },
  compactBetaText: {
    color: theme.colors.background.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  titleColumn: {
    flexDirection: 'column',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  appName: {
    ...theme.typography.display,
    fontSize: 32,
    color: theme.colors.text.primary,
    lineHeight: 38,
  },
  betaBadge: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
    marginTop: 4,
  },
  betaText: {
    color: theme.colors.background.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  changelogButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.radius.full,
    marginTop: 4,
  },
  changelogText: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
}));

export default BetaScreen;
