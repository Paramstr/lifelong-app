import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Carousel from '@/components/opal/carousel';
import StartTimerButton from '@/components/opal/start-timer-button';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
        <View style={styles.placeholderBox}>
          <View style={[styles.placeholderLine, styles.w1_3]} />
          <View style={[styles.placeholderLine, styles.w2_3]} />
          <View style={[styles.placeholderLine, styles.w2_3]} />
        </View>
        <View style={[styles.placeholderBox, styles.mb12]}>
          <View style={[styles.placeholderLine, styles.w1_3]} />
          <View style={[styles.placeholderLine, styles.w2_3]} />
          <View style={[styles.placeholderLine, styles.w2_3]} />
        </View>

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

      </ScrollView>

      <View style={[styles.bottomButtonContainer, { bottom: insets.bottom + 80 }]}>
        <StartTimerButton />
      </View>



      {/* <ScreenTopBlur /> */}
      {/* <ScreenBottomBlur /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#fafafa',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionTitleNoMB: {
    color: '#fafafa',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#a3a3a3',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  mb8: {
    marginBottom: 32,
  },
  dashedBoxInternal: {
    width: '100%',
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.7)',
    gap: 12,
  },
  plusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedBoxText: {
    color: '#e5e5e5',
    fontSize: 18,
    fontWeight: '500',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  headerTextContainer: {
    flex: 1,
  },
  greetingText: {
    color: '#a3a3a3',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
  },
  heroHeadline: {
    color: 'white',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  heroDescription: {
    color: '#d4d4d4',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  placeholderBox: {
    width: '100%',
    height: 120,
    borderRadius: 24,
    padding: 16,
    paddingTop: 24,
    backgroundColor: 'rgba(23, 23, 23, 0.7)',
    marginBottom: 16,
  },
  placeholderLine: {
    marginBottom: 8,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#171717',
  },
  w1_3: {
    width: '33.333333%',
  },
  w2_3: {
    width: '66.666667%',
  },
  mb12: {
    marginBottom: 48,
  },
  carouselWrapperMB12: {
    marginHorizontal: -20,
    marginBottom: 48,
  },
  carouselWrapperMB10: {
    marginHorizontal: -20,
    marginBottom: 40,
  },
  borderCurve: {
    borderCurve: 'continuous',
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
});

export default HomeScreen;
