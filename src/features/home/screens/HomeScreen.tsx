import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { } from '@expo/ui/swift-ui';
import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import FoodTimeline from '@/components/home/food/food-timeline';
import { DailyNutritionScrollGraph } from '../components/nutrition/daily-nutrition-scroll-graph';
import UpcomingProtocolCard from '@/components/home/upcoming-protocol-card';
import { WeeklyProgressHeader } from '@/components/home/weekly-progress-header';
import { ImmersiveBackground } from '@/components/home/immersive-background';
import { TIMELINE_ENTRIES } from '../data/timeline-data';
import { EdgeBlurFade } from '@/components/shared/edge-blur-fade';
import { ProgressiveBlurHeader } from '@/components/shared/progressive-blur-header';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  // Immersive Background Controls
  const BG_SCALE = 1.2;
  const BG_TRANSLATE_X = -180;
  const BG_TRANSLATE_Y = +140; //default -80

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -scrollY.value * 0.25 }],
  }));

  const topBlurIntensity = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 300], [36, 60], Extrapolate.CLAMP)
  );
  const bottomBlurIntensity = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 300], [34, 56], Extrapolate.CLAMP)
  );
  const largeHeaderBlurProps = useAnimatedProps(() => ({
    intensity: interpolate(scrollY.value, [0, 60], [0, 24], Extrapolate.CLAMP),
  }));
  const largeHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 60], [1, 0], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 60], [0, -10], Extrapolate.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [0, 60], [1, 0.96], Extrapolate.CLAMP),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, bgAnimatedStyle]}
        pointerEvents="none"
      >
        <ImmersiveBackground 
          source={require('../../../../assets/images/Backgrounds/blue-mountains.png')}
          scale={BG_SCALE}
          translateX={BG_TRANSLATE_X}
          translateY={BG_TRANSLATE_Y}
        />
      </Animated.View>
      <EdgeBlurFade
        position="top"
        height={insets.top + 500}
        fadeColor="#ffffff31"
        blurIntensity={topBlurIntensity}
        fadeFromOpacity={1}
        fadeStart={0}
        fadeEnd={0.9}
        blurStart={0}
        blurEnd={0.03}
      />
      <EdgeBlurFade
        position="bottom"
        height={insets.bottom + 300}
        fadeColor="#ffffffff"
        blurIntensity={bottomBlurIntensity}
        fadeFromOpacity={1}
        fadeStart={0.05}
        fadeEnd={0.9}
        blurStart={0.1}
        blurEnd={0.9}
      />
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
        <View style={styles.compactHeaderRow}>
          <View style={styles.compactSpacer} />
          <View style={styles.compactHeaderText}>
            <Text style={styles.compactTitle}>Today</Text>
            <Text style={styles.compactSubtitle}>Sunday, 28 Dec</Text>
            <Text style={styles.compactTasks}>4 tasks</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={require('../../../../assets/images/family/param_avatar.jpg')}
              style={styles.compactAvatar}
            />
          </TouchableOpacity>
        </View>
      </ProgressiveBlurHeader>
      {/* <SoftRadialGradient /> */}

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 120,
        }}
      >
        {/* <TopBlurHeader fadeStart={0.1} fadeEnd={0.8} blurIntensity={60} /> */}
        
        <View style={styles.scrollContent}>
          {/* Header Bar */}
          <Animated.View style={[styles.topBar, largeHeaderStyle]}>
            <AnimatedBlurView
              animatedProps={largeHeaderBlurProps}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
            <View>
              <Text style={styles.bigTitle}>Today</Text>
              <View style={styles.subtitleRow}>
                <Text style={styles.subtitle}>Sunday, 28 Dec</Text>
                <Text style={styles.bullet}> • </Text>
                <Text style={[styles.subtitle, styles.highlight]}>4 tasks</Text>
              </View>
            </View>

            <TouchableOpacity>
              <Image 
                source={require('../../../../assets/images/family/param_avatar.jpg')} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
          </Animated.View>

          <DailyNutritionScrollGraph entries={TIMELINE_ENTRIES} />
          <View style={styles.cardGap} />


        {/* <UpcomingProtocolCard       
          title="Wrist Mobility"
          journey="Joint Recovery"
          duration="10 min"
          taskImage={require('../../../../assets/images/protocols/wrist-mobility.png')}
          timestamp="08:30"
          count={3}
          username="-"
          onPress={() => router.push('/protocol/wrist-mobility')}
          gradientColors={[
            'rgba(24, 222, 103, 0.5)', // Deep Forest Green
            'rgba(164, 211, 44, 0.33)', // Vibrant Emerald
            'rgba(0, 149, 69, 1)'   // Deep Forest Light
          ]}
        />
        <View style={styles.cardGap} />
        <UpcomingProtocolCard 
          title="Evening Mobility"
          journey="Knee Recovery"
          duration="15 min"
          taskImage={require('../../../../assets/images/protocols/evening-mobility.png')}
          timestamp="19:45"
          count={1}
          username="-"
          onPress={() => console.log('Start Evening Mobility')}
          gradientColors={[
            'rgba(114, 114, 114, 0.3)', // Soft Grey
            'rgba(228, 228, 228, 0.2)', // Off White
            'rgba(0, 0, 0, 0.25)' // Neutral Mist
          ]}
        /> */}

        <View style={styles.cardGap} />
        <View style={{}}>
          
        <FoodTimeline />
        </View>

        <View style={styles.mb8} />
        </View>
      </Animated.ScrollView>

    </View>
  );
};

// Using Unistyles with theme support
const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg - 4, // 20px
    paddingTop: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
  },
  rightIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.secondary, // or '#F2F4F7' if theme isn't matching
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  bigTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: 0.3,
    marginBottom: 4,
    fontFamily: 'ui-rounded',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'ui-rounded',
  },
  bullet: {
    fontSize: 15,
    color: theme.colors.text.disabled,
    marginHorizontal: 4,
    fontFamily: 'ui-rounded',
  },
  highlight: {
    color: theme.colors.brand.primary, // or blue #007AFF
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    marginBottom: theme.spacing.sm,
  },
  sectionTitleNoMB: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  headerTextContainer: {
    flex: 1,
  },
  greetingText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '400',
    marginBottom: theme.spacing.xs,
  },
  heroHeadline: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.display.fontSize,
    fontWeight: theme.typography.display.fontWeight,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.display.lineHeight,
    letterSpacing: theme.typography.display.letterSpacing,
  },
  heroDescription: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '400',
  },
  placeholderBox: {
    width: '100%',
    height: 120,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface.card,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  placeholderLine: {
    marginBottom: theme.spacing.sm,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.border.divider,
  },
  w1_3: {
    width: '33.333333%',
  },
  w2_3: {
    width: '66.666667%',
  },
  weeklyProgressContainer: {
    marginTop: 12, 
    paddingTop: theme.spacing.sm,
  },
  mb8: {
    marginBottom: theme.spacing.sm,
  },
  cardGap: {
    height: 8,
  },
  compactHeaderContent: {
    paddingHorizontal: theme.spacing.lg - 4,
  },
  compactHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactSpacer: {
    width: 32,
  },
  compactHeaderText: {
    flex: 1,
    alignItems: 'center',
  },
  compactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontFamily: 'ui-rounded',
    textAlign: 'center',
  },
  compactSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'ui-rounded',
    textAlign: 'center',
  },
  compactTasks: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.brand.primary,
    fontFamily: 'ui-rounded',
    textAlign: 'center',
  },
  compactAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  mb12: {
    marginBottom: theme.spacing['4xl'],
  },
  carouselWrapperMB12: {
    marginHorizontal: -20,
    marginBottom: theme.spacing['3xl'],
  },
  carouselWrapperMB10: {
    marginHorizontal: -20,
    marginBottom: theme.spacing['2xl'],
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
}));

export default HomeScreen;
