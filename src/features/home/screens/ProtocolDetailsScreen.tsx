import FeedbackOverlay from '@/components/home/protocol/feedback-overlay';
import ProtocolStepItem from '@/components/home/protocol/protocol-step-item';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

const { width, height } = Dimensions.get('window');

interface ProtocolDetailsScreenProps {
  protocolId: string;
}

const ProtocolDetailsScreen: React.FC<ProtocolDetailsScreenProps> = ({ protocolId }) => {
    const insets = useSafeAreaInsets();
    const scrollY = useSharedValue(0);
    const [showFeedback, setShowFeedback] = useState(false);

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

    const steps = [
        { id: 1, title: 'Deep Squat Hold', desc: 'Sit in a deep squat position to open up hips.', duration: '2 mins', reps: '1 set' },
        { id: 2, title: 'Forward Fold', desc: 'Hinge at hips, reaching for toes.', duration: '1 min', reps: '2 sets' },
        { id: 3, title: 'Butterfly Stretch', desc: 'Soles of feet together, knees out.', duration: '2 mins', reps: '1 set' },
        { id: 4, title: 'Cat-Cow', desc: 'Arch and round spine on hands and knees.', duration: '1 min', reps: '10 reps' },
        { id: 5, title: 'Childs Pose', desc: 'Rest hips on heels, arms forward.', duration: '3 mins', reps: '1 set' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Background Layer (Parallax) */}
            <Animated.View style={[StyleSheet.absoluteFill, backgroundAnimatedStyle, { zIndex: 0 }]}>
                {/* 1. Image Layer */}
                <View style={styles.backgroundLayer}>
                    <Image
                        source={require('../../../../assets/images/morning-mobility.png')}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />
                </View>

                {/* 2. Blur Effect Layer */}
                <BlurView intensity={10} style={[StyleSheet.absoluteFill, { height: height * 0.55, zIndex: 1 }]} tint="light" />

                {/* 3. White Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', '#ffffff']}
                    locations={[0, 0.45, 1]}
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
        height: height * 0.55,
        zIndex: 0,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.55,
        zIndex: 2,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
    },
    glassButton: {
        flex: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    headerContent: {
        marginBottom: 30,
    },
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
