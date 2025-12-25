import FeedbackOverlay from '@/components/home/protocol/feedback-overlay';
import ProtocolStepItem from '@/components/home/protocol/protocol-step-item';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
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

    const steps = [
        { id: 1, title: 'Deep Squat Hold', desc: 'Sit in a deep squat position to open up hips.', duration: '2 mins', reps: '1 set' },
        { id: 2, title: 'Forward Fold', desc: 'Hinge at hips, reaching for toes.', duration: '1 min', reps: '2 sets' },
        { id: 3, title: 'Butterfly Stretch', desc: 'Soles of feet together, knees out.', duration: '2 mins', reps: '1 set' },
        { id: 4, title: 'Cat-Cow', desc: 'Arch and round spine on hands and knees.', duration: '1 min', reps: '10 reps' },
        { id: 5, title: 'Childs Pose', desc: 'Rest hips on heels, arms forward.', duration: '3 mins', reps: '1 set' },
    ];

    return (
        <View style={styles.container}>
            {/* Background Image */}
            <Image 
                source={require('../../../../assets/images/morning-mobility.png')} // Fallback if specific image not avail
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            
            {/* Heavy Blur Overlay */}
            <GlassView style={StyleSheet.absoluteFillObject} glassEffectStyle="regular" tintColor="rgba(0,0,0,0.8)" />

            {/* Header: Navigation & Title */}
            <View style={[styles.topBar, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <GlassView style={styles.glassButton} glassEffectStyle="regular">
                        <Ionicons name="close" size={20} color="#fff" />
                    </GlassView>
                </TouchableOpacity>
            </View>

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingTop: insets.top + 60,
                    paddingBottom: insets.bottom + 100,
                    paddingHorizontal: 20,
                }}
            >
                <Animated.View style={[styles.headerContent, headerAnimatedStyle]}>
                    <Text style={styles.superTitle}>RECOVERY JOURNEY</Text>
                    <Text style={styles.heroTitle}>Morning Mobility</Text>
                    <Text style={styles.description}>
                        A gentle routine to wake up your joints and prepare for the day.
                        Focus on breathing deeply.
                    </Text>
                    
                    <View style={styles.metaRow}>
                        <View style={styles.chip}>
                            <Ionicons name="time" size={12} color="#fff" />
                            <Text style={styles.chipText}>15 min</Text>
                        </View>
                        <View style={styles.chip}>
                            <Ionicons name="fitness" size={12} color="#fff" />
                            <Text style={styles.chipText}>5 Exercises</Text>
                        </View>
                        <View style={styles.chip}>
                            <Ionicons name="sparkles" size={12} color="#fff" />
                            <Text style={styles.chipText}>AI Curated</Text>
                        </View>
                    </View>
                </Animated.View>

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
        backgroundColor: '#000', // Unistyles fix: use valid string
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
        opacity: 0.6,
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
        width: 36,
        height: 36,
    },
    glassButton: {
        flex: 1,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    headerContent: {
        marginBottom: 30,
    },
    superTitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    heroTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
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
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 100,
        gap: 4,
    },
    chipText: {
        color: '#fff',
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
        backgroundColor: 'rgba(20, 20, 20, 0.6)', // Dark tint
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
}));

export default ProtocolDetailsScreen;
