import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import DailyTimeline from '@/components/home/daily-timeline';
import UpcomingProtocolCard from '@/components/home/upcoming-protocol-card';
import { WeeklyProgressHeader } from '@/components/home/weekly-progress-header';
import SoftRadialGradient from '@/components/shared/soft-radial-gradient';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const timelineEntries = [
    {
      id: '1',
      time: '8:10 am',
      type: 'meal' as const,
      mealType: 'Breakfast',
      title: 'Eggs with avocado on toast',
      calories: '500',
      carbs: '30',
      protein: '30',
      fat: '30',
      image: require('../../../../assets/images/eggs-avocado-toast.png'),
    },
    {
      id: '2',
      time: '9:30 am',
      type: 'thought' as const,
      thought: 'Feeling a bit depleted and anxious about the day, potential due to sleep.',
    },
    {
      id: '3',
      time: '1:30 pm',
      type: 'meal' as const,
      mealType: 'Breakfast',
      title: 'Chicken rice bowl',
      calories: '600',
      carbs: '40',
      protein: '45',
      fat: '60',
      image: require('../../../../assets/images/chicken-rice-bowl.png'),
    },
    {
      id: '4',
      time: '5:30 pm',
      type: 'meal' as const,
      mealType: 'Dinner',
      title: 'Chicken rice bowl',
      calories: '600',
      carbs: '40',
      protein: '45',
      fat: '60',
      image: require('../../../../assets/images/chicken-rice-bowl.png'),
    },
    {
      id: '5',
      time: '6:30 pm',
      type: 'meal' as const,
      mealType: 'Snack',
      title: 'Protein Shake',
      calories: '300',
      carbs: '10',
      protein: '24',
      fat: '10',
      image: require('../../../../assets/images/protein-shake.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <SoftRadialGradient />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 120,
        }}
      >
        {/* <TopBlurHeader fadeStart={0.1} fadeEnd={0.8} blurIntensity={60} /> */}
        
        <View style={styles.scrollContent}>
          <View style={styles.weeklyProgressContainer}>
            <WeeklyProgressHeader
              title="Lifelong"
              completionCount={1}
              currentDate={new Date()}
              progressByDay={[
                { date: '2025-12-22', progress: 0.75 },
                { date: '2025-12-21', progress: 1.0 },
                { date: '2025-12-20', progress: 0.4 },
                { date: '2025-12-19', progress: 0.8 },
              ]}
            />
          </View>
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              {/* <Text style={styles.greetingText}>Hi Param,</Text> */}
              <Text style={styles.heroHeadline}>Keep up the mobility.</Text>
              <Text style={styles.heroDescription}>
                Yesterday was quite strenous, today try do movement for active recovery and rest.
              </Text>
            </View>
          </View>

        {/* <Text style={styles.sectionTitle}>Upcoming</Text> */}
        <UpcomingProtocolCard 
          title="Morning Mobility"
          journey="Knee Recovery"
          duration="10 min"
          taskImage={require('../../../../assets/images/morning-mobility.png')}
          timestamp="08:30"
          count={3}
          username="-"
          onPress={() => router.push('/protocol/morning-mobility')}
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
          taskImage={require('../../../../assets/images/evening-mobility.png')}
          timestamp="19:45"
          count={1}
          username="-"
          onPress={() => console.log('Start Evening Mobility')}
          gradientColors={[
            'rgba(114, 114, 114, 0.3)', // Soft Grey
            'rgba(228, 228, 228, 0.2)', // Off White
            'rgba(0, 0, 0, 0.25)' // Neutral Mist
          ]}
        />
        <View style={styles.cardGap} />
        
        <DailyTimeline entries={timelineEntries} />

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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg - 4, // 20px
    paddingTop: 8,
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
