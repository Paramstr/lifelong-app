import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  Image as RNImage,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { FamilySleepCard } from '../components/FamilySleepCard';
import { FamilyStepsGraph } from '../components/FamilyStepsGraph';
import { FamilyStressCard } from '../components/FamilyStressCard';

const { width, height } = Dimensions.get('window');

// Placeholder data for the carousel
const CAROUSEL_IMAGES = [
  'https://i.pinimg.com/736x/0b/78/ae/0b78ae008ae0924deb8709191ed2cf69.jpg', // Dog
  'https://i.pinimg.com/1200x/05/e5/25/05e52588f71872631068a0f8504f364e.jpg', // Dog
  'https://i.pinimg.com/736x/10/6e/9f/106e9fa45826b993739449166b81c5c2.jpg', // Dog
  'https://i.pinimg.com/1200x/4b/61/93/4b6193893b5e78852385512422b9fa9e.jpg', // Dog
  'https://i.pinimg.com/1200x/4b/61/93/4b6193893b5e78852385512422b9fa9e.jpg', // Dog
];

const ITEM_WIDTH = width * 0.28; // Slender width, ~3-3.5 per screen
const SPACING = 8;
const SPACER_ITEM_SIZE = 0;

const AVATAR_SIZE = 100;

const CarouselItem = ({ item, index, scrollX }: { item: string; index: number; scrollX: SharedValue<number> }) => {
  // Removed scaling and opacity animations to keep all items same height and size
  return (
    <Animated.View style={styles.carouselItemContainer}>
      <RNImage
        source={{ uri: item }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    </Animated.View>
  );
};


export default function FamilyScreen() {
  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const mainScrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -scrollY.value }],
    };
  });

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH + SPACING * 2,
    offset: (ITEM_WIDTH + SPACING * 2) * index,
    index,
  });

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    return <CarouselItem item={item} index={index} scrollX={scrollX} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Animated Background Wrapper */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedBackgroundStyle, { zIndex: 0 }]}>
        {/* 1. Background Carousel Layer */}
        <View style={styles.backgroundLayer}>
          <Animated.FlatList
            data={CAROUSEL_IMAGES}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH + SPACING * 2}
            snapToAlignment="start"
            decelerationRate="fast"
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingHorizontal: SPACING, // Small padding at start
              paddingTop: 40, // Moved padding here to prevent clipping
              alignItems: 'center',
            }}
            getItemLayout={getItemLayout}
          />
        </View>

        {/* 2. Glass / Blur Effect Layer */}
        {/* Increased intensity to be visible (0.8 is too low) */}
        <BlurView intensity={10} style={[StyleSheet.absoluteFill, { height: height * 0.45, zIndex: 1 }]} tint="light" />

        {/* 3. White Gradient Overlay */}
        {/* Fully white by roughly 1/3 of screen height */}
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)', '#ffffff']}
          locations={[0, 0.4, 1]}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />
      </Animated.View>

      {/* 4. Content Layer (Avatar + Info) */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={mainScrollHandler}
        scrollEventThrottle={16}
      >
        {/* Spacer to push content down to the white area */}
        <View style={{ height: height * 0.32 }} />

        <View style={styles.profileSection}>
          <View style={styles.avatarSection}>
            {/* Satellite Avatars in an Arc - Using GlassView */}
            {/* Satellite Avatars in an Arc - Using GlassView wrapped in View for Shadow */}
            <View style={[styles.satelliteContainer, { top: -20, left: -30 }]}>
              <GlassView style={styles.satellite} glassEffectStyle="regular">
                 <RNImage source={require('../../../../assets/images/family/dad.jpeg')} style={styles.satelliteImage} />
              </GlassView>
            </View>
            <View style={[styles.satelliteContainer, { top: -80, alignSelf: 'center' }]}>
              <GlassView style={styles.satellite} glassEffectStyle="regular">
                 <RNImage source={require('../../../../assets/images/family/brother.jpeg')} style={styles.satelliteImage} />
              </GlassView>
            </View>
            <View style={[styles.satelliteContainer, { top: -20, right: -30 }]}>
              <GlassView style={styles.satellite} glassEffectStyle="regular">
                 <RNImage source={require('../../../../assets/images/family/mum.jpeg')} style={styles.satelliteImage} />
              </GlassView>
            </View>

            <GlassView style={styles.avatarContainer} glassEffectStyle="regular">
                <RNImage
                source={{ uri: 'https://media.licdn.com/dms/image/v2/D5603AQGL5HeVBT5RBg/profile-displayphoto-crop_800_800/B56ZokggypJYAI-/0/1761549094697?e=1768435200&v=beta&t=CT2foTyMwUfSkCZA8i6I_cNw4v_jWIrcUBNNyXLZlhs' }}
                style={styles.avatar}
                />
            </GlassView>
          </View>

          <Text style={styles.name}>Singh Family</Text>
          
          <Text style={styles.bio}>
            Dedicated to a lifetime of health and happiness. An active family who loves hiking trails, weekend adventures, and prioritizing longevity together.
          </Text>
          
          <View style={styles.socialRow}>
             {/* Mimicking the 'Friends Follow' section */}
             <View style={styles.socialGroup}>
                <View style={styles.miniAvatars}>
                    {[1,2,3].map((_,i) => (
                        <RNImage 
                            key={i} 
                            source={{uri: `https://i.pravatar.cc/100?img=${i+10}`}} 
                            style={[styles.miniAvatar, { marginLeft: i > 0 ? -12 : 0, zIndex: 3-i }]} 
                        />
                    ))}
                    <View style={[styles.miniAvatar, { marginLeft: -12, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', zIndex: 0 }]}>
                         <Text style={{fontSize: 10}}>+</Text>
                    </View>
                </View>
                <Text style={styles.socialLabel}>Friends Follow</Text>
             </View>

             <View style={styles.socialGroup}>
                <View style={styles.miniAvatars}>
                    {[4,5,6].map((_,i) => (
                        <RNImage 
                            key={i} 
                            source={{uri: `https://i.pravatar.cc/100?img=${i+20}`}} 
                            style={[styles.miniAvatar, { marginLeft: i > 0 ? -12 : 0, zIndex: 3-i }]} 
                        />
                    ))}
                    <View style={[styles.miniAvatar, { marginLeft: -12, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', zIndex: 0 }]}>
                         <Text style={{fontSize: 10}}>+</Text>
                    </View>
                </View>
                <Text style={styles.socialLabel}>Mutual Clubs</Text>
             </View>
          </View>

        </View>

        <View style={[styles.sectionSpacer, { marginTop: 64 }]}>
           <FamilySleepCard />
        </View>

        <View style={styles.sectionSpacer}>
           <FamilyStressCard />
        </View>


        <View style={[styles.sectionSpacer, { marginTop: 16 }]}>
           <FamilyStepsGraph />
        </View>

        
        {/* Extra space at bottom */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45, // Reduced height (approx 1/2 of previous)
    zIndex: 0,
    // paddingTop: 20, // Removed to prevent clipping, moved to contentContainerStyle
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselItemContainer: {
    width: ITEM_WIDTH,
    height: height * 0.45, // Match background height
    marginHorizontal: SPACING,
    borderRadius: 30, // Rounded top
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45, // Match background height
    zIndex: 2, // Above blur, below content
  },
  scrollView: {
    flex: 1,
    zIndex: 3, // Top layer
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  sectionSpacer: {
    width: '100%',
    paddingHorizontal: 16, // Standard spacing requested
    marginTop: 32,         // Fix "practically touching" issue
    marginBottom: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
    width: 200, // Roughly enough for the arc
  },
  satelliteContainer: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 37.5,
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 0 }, // Center glow
    shadowOpacity: 1,
    shadowRadius: 10, // Large glow
    elevation: 5,
    zIndex: 0,
  },
  satellite: {
    width: '100%',
    height: '100%',
    borderRadius: 37.5,
    padding: 3,
    overflow: 'hidden', // Ensure glass effect stays inside
  },
  satelliteImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    padding: 4,
    // backgroundColor: '#fff', // Removed for glass effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 10, // Top
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '90%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  socialRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 10,
  },
  socialGroup: {
      alignItems: 'center',
      gap: 8,
  },
  miniAvatars: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  miniAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      shadowColor: '#ffffffff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
  },
  socialLabel: {
      fontSize: 12,
      color: '#444',
      fontWeight: '500',
  }

});

