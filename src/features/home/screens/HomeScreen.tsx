import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import FoodTimeline from '@/components/home/food/food-timeline';
import UpcomingProtocolCard from '@/components/home/upcoming-protocol-card';
import { WeeklyProgressHeader } from '@/components/home/weekly-progress-header';
import { ImmersiveBackground } from '@/components/home/immersive-background';
import { TIMELINE_ENTRIES } from '../data/timeline-data';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  // Immersive Background Controls
  const BG_SCALE = 1.2;
  const BG_TRANSLATE_X = 0;
  const BG_TRANSLATE_Y = 0;

  return (
    <View style={styles.container}>
      <ImmersiveBackground 
        source={require('../../../../assets/images/Backgrounds/blue-mountains.png')}
        scale={BG_SCALE}
        translateX={BG_TRANSLATE_X}
        translateY={BG_TRANSLATE_Y}
      />
      {/* <SoftRadialGradient /> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 120,
        }}
      >
        {/* <TopBlurHeader fadeStart={0.1} fadeEnd={0.8} blurIntensity={60} /> */}
        
        <View style={styles.scrollContent}>
          {/* Header Bar */}
          <View style={styles.topBar}>
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
          </View>


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
        <View style={{marginTop:200}}>
          
        <FoodTimeline entries={TIMELINE_ENTRIES} />
        </View>

        <View style={styles.mb8} />

        {/* <Text style={styles.sectionTitleNoMB}>Get More Done</Text>
        <Text style={styles.sectionSubtitle}>Maximize your productivity while staying sane.</Text>
        <View style={styles.carouselWrapperMB12}>
          <Carousel
            data={[
              'L87Luf_JHtDk%yx@eUaOH[WByCx[',
              'LOH]%h^N9^Iq}ts.oLaz=eR*ofxZ',
              'LEA]]RrW0}Os%KM{WBxu11Ip|=xZ',
              'LJOXU1-pxuoz~XIoRjWBxsNHfOoJ',
            ]}
          />
        </View>

        <Text style={styles.sectionTitleNoMB}>Sleep, Relax and Reset</Text>
        <Text style={styles.sectionSubtitle}>Sleep better, rise refreshed.</Text>
        <View style={styles.carouselWrapperMB10}>
          <Carousel
            data={[
              'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
              'L60MZWh2e7f,k]f5f5e.hyfmf5e-',
              'LEHLh[WB2yk8pyoJadR*.7kCMdnj',
              'LKN]Rv%2Tw=w]~RBVZRi};RPxuwH',
              'LWD-8itmofRPKnWCV?kXM}RjkCoz',
              'L25Xx[rV00%#Mw%M%2Mw00x]~qMd',
            ]}
          />
        </View> */}
        </View>
      </ScrollView>

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
