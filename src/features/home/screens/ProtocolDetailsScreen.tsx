import FeedbackOverlay from '@/components/home/protocol/feedback-overlay';
import ProtocolStepItem from '@/components/home/protocol/protocol-step-item';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    Image as RNImage,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window');

// Carousel Constants
const CAROUSEL_IMAGES = [
  'https://i.pinimg.com/1200x/cd/02/86/cd0286ceb9781411d52daf8d85c62853.jpg',
  'https://i.pinimg.com/736x/41/c8/f4/41c8f4ce8a4cc286a3fa82061c8f7299.jpg',
  'https://i.pinimg.com/736x/e6/99/61/e69961fcf2cb16193e805139a750fbbf.jpg',
  'https://i.pinimg.com/1200x/92/ff/7f/92ff7fa9878f285bbf84b672af6923bb.jpg',
  'https://i.pinimg.com/736x/62/40/4c/62404c963e0c7e592e5b352e341b8cb3.jpg',
];

const ITEM_WIDTH = width * 0.28;
const SPACING = 8;

const CarouselItem = ({ item, index, scrollX }: { item: string; index: number; scrollX: SharedValue<number> }) => {
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

interface ProtocolDetailsScreenProps {
  protocolId: string;
}

const ProtocolDetailsScreen: React.FC<ProtocolDetailsScreenProps> = ({ protocolId }) => {
    const insets = useSafeAreaInsets();
    const scrollX = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const [showFeedback, setShowFeedback] = useState(false);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
    });

    const playerRef = useRef<YoutubeIframeRef>(null);

    const onScroll = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 100], [1, 0], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [0, 100], [0, -20], Extrapolation.CLAMP);
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    const backgroundAnimatedStyle = useAnimatedStyle(() => {
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

    const parseTime = (time: string) => {
        const [min, sec] = time.split(':').map(Number);
        return min * 60 + sec;
    };

    const VIDEO_ID = 'mSZWSQSSEjE';

    const CHAPTERS = [
        { startTime: "0:00", title: "Introduction" },
        { startTime: "0:48", title: "Finger Pulses" },
        { startTime: "1:26", title: "Palm Pulses" },
        { startTime: "1:59", title: "Side-to-Side Palm Rotations" },
        { startTime: "2:28", title: "Front Facing Elbow Rotations" },
        { startTime: "3:06", title: "Side-to-Side Wrist Stretch" },
        { startTime: "3:39", title: "Rear Facing Wrist Stretch Palms Down" },
        { startTime: "4:25", title: "Rear Facing Wrist Stretch Palms Up" },
        { startTime: "4:45", title: "Rear Facing Elbow Rotations" },
        { startTime: "5:31", title: "Forward Facing Wrist Stretch" }
    ];

    const steps = CHAPTERS.map((chapter, index) => ({
        id: index + 1,
        title: chapter.title,
        startTime: parseTime(chapter.startTime),
        desc: `Starts at ${chapter.startTime}`,
        duration: '-', // Placeholder
        reps: '1 set'  // Placeholder
    }));

    const handleStepPress = useCallback((time: number) => {
        playerRef.current?.seekTo(time, true);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Background Layer (Carousel) */}
            <Animated.View style={[StyleSheet.absoluteFill, backgroundAnimatedStyle, { zIndex: 0 }]}>
                {/* 1. Carousel Layer */}
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
                          paddingHorizontal: SPACING,
                          paddingTop: 40,
                          alignItems: 'center',
                        }}
                        getItemLayout={getItemLayout}
                      />
                </View>

                {/* 2. Blur Effect Layer */}
                <BlurView intensity={20} style={[StyleSheet.absoluteFill, { height: height * 0.45, zIndex: 1 }]} tint="light" />

                {/* 3. White Gradient Overlagiy */}
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)', '#ffffff']}
                    locations={[0, 0.4, 1]}
                    style={styles.gradientOverlay}
                    pointerEvents="none"
                />
            </Animated.View>

            {/* Header: Navigation - Absolute on top */}
            <View style={[styles.topBar, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <GlassView style={styles.glassButton} glassEffectStyle="regular">
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </GlassView>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rightHeaderButton}>
                     <GlassView style={styles.glassButtonRight} glassEffectStyle="regular">
                        <Text style={styles.headerButtonText}>Joint Mobility</Text>
                     </GlassView>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 80, // Push content down
                    paddingBottom: insets.bottom + 100,
                    paddingHorizontal: 20,
                }}
            >
                {/* Header Content */}
                <Animated.View style={[styles.headerContent, headerAnimatedStyle]}>
                    <View style={styles.videoContainer}>
                         <YoutubePlayer
                            ref={playerRef}
                            height={220}
                            width={width - 40} // Full width minus padding
                            videoId={VIDEO_ID}
                            webViewProps={{
                                allowsFullscreenVideo: true,
                                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
                            }}
                         />
                    </View>

                    <Text style={styles.superTitle}>RECOVERY JOURNEY</Text>
                    <Text style={styles.heroTitle}>Morning Mobility</Text>
                    <Text style={styles.description}>
                        A gentle routine to wake up your joints and prepare for the day.
                        Focus on breathing deeply.
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.chip}>
                            <Ionicons name="time" size={12} color="#666" />
                            <Text style={styles.chipText}>15 min</Text>
                        </View>
                        <View style={styles.chip}>
                            <Ionicons name="fitness" size={12} color="#666" />
                            <Text style={styles.chipText}>5 Exercises</Text>
                        </View>
                        <View style={styles.chip}>
                            <Ionicons name="sparkles" size={12} color="#666" />
                            <Text style={styles.chipText}>AI Curated</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Steps List */}
                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <ProtocolStepItem
                            key={step.id}
                            stepNumber={index + 1}
                            title={step.title}
                            description={step.desc}
                            duration={step.duration}
                            reps={step.reps}
                            onPress={() => handleStepPress(step.startTime)}
                        />
                    ))}
                </View>
            </Animated.ScrollView>

            {/* Bottom Floating Action */}
            <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.completeButtonWrapper}
                    onPress={() => setShowFeedback(true)}
                >
                    <GlassView style={styles.completeButton} glassEffectStyle="regular" tintColor="#222">
                        <Text style={styles.buttonText}>Complete Protocol</Text>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    </GlassView>
                </TouchableOpacity>
            </View>

            <FeedbackOverlay
                visible={showFeedback}
                onClose={() => setShowFeedback(false)}
                onSubmit={() => {
                    setShowFeedback(false);
                    router.back();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    backgroundLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.45,
        zIndex: 0,
    },
    carouselItemContainer: {
        width: ITEM_WIDTH,
        height: height * 0.45,
        marginHorizontal: SPACING,
        borderRadius: 30,
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
        height: height * 0.45,
        zIndex: 2,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
    },
    rightHeaderButton: {
        height: 40,
        justifyContent: 'center',
    },
    glassButton: {
        flex: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    glassButtonRight: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    headerButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
    headerContent: {
        marginBottom: 30,
    },
    videoContainer: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#000', // Placeholder for video load
    },
    // Removed protocolImage styles as replaced by videoContainer
    superTitle: {
        color: '#666',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    heroTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 20,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 100,
        gap: 4,
    },
    chipText: {
        color: '#444',
        fontSize: 12,
        fontWeight: '600',
    },
    stepsContainer: {
        gap: 0,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        zIndex: 20,
    },
    completeButtonWrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    completeButton: {
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
}));

export default ProtocolDetailsScreen;
