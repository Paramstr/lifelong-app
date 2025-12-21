import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

import Carousel from '@/components/opal/carousel';
import UpcomingTaskCard from '@/components/opal/upcoming-task-card';
import WeeklyProgress from '@/components/opal/weekly-progress';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
      >
        {/* <TopBlurHeader fadeStart={0.1} fadeEnd={0.8} blurIntensity={60} /> */}
        
        <View style={styles.scrollContent}>
          <View style={styles.weeklyProgressContainer}>
            <WeeklyProgress />
          </View>
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>Hi Param,</Text>
              <Text style={styles.heroHeadline}>Keep up the mobility.</Text>
              <Text style={styles.heroDescription}>
                You're doing great. Stay on track to feel your best.
              </Text>
            </View>
          </View>

        <Text style={styles.sectionTitle}>Upcoming</Text>
        <UpcomingTaskCard 
          title="Morning Mobility"
          journey="Knee Recovery"
          duration="10 min"
          taskImage={require('../../../../assets/images/morning-mobility.png')}
          timestamp="08:30"
          count={3}
          username="Param"
          onPress={() => console.log('Start Morning Mobility')}
        />
        <View style={styles.cardGap} />
        <UpcomingTaskCard 
          title="Evening Mobility"
          journey="Knee Recovery"
          duration="15 min"
          taskImage={require('../../../../assets/images/evening-mobility.png')}
          timestamp="19:45"
          count={1}
          username="Param"
          onPress={() => console.log('Start Evening Mobility')}
        />
        <View style={styles.mb8} />

        <Text style={styles.sectionTitleNoMB}>Get More Done</Text>
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
        </View>
        </View>
      </ScrollView>

    </View>
  );
};

// Using Unistyles with theme support
const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Fallback
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg - 4, // 20px
    paddingTop: 12,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    marginBottom: theme.spacing.md,
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
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing['2xl'],
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
    marginBottom: theme.spacing.md - 4, // 12px
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
    marginTop: 20, // Adjust this to push content down so it's not too high up
    paddingTop: theme.spacing.md,
  },
  mb8: {
    marginBottom: theme.spacing.sm,
  },
  cardGap: {
    height: 12,
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
