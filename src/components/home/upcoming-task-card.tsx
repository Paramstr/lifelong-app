import { Ionicons } from '@expo/vector-icons';
import { GlassContainer, GlassView } from 'expo-glass-effect';
import React, { useEffect } from 'react';
import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

interface UpcomingTaskCardProps {
    title: string;
    journey: string;
    duration: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    // New props for the redesign
    avatarUrl?: ImageSourcePropType;
    taskImage?: ImageSourcePropType;
    backgroundImage?: ImageSourcePropType;
    username?: string;
    tag?: string;
    timestamp?: string;
    count?: number;
    // Gradient configuration: [Base Blob, Highlight Blob, Accent Blob]
    gradientColors?: [string, string, string]; 
}

const UpcomingTaskCard: React.FC<UpcomingTaskCardProps> = ({
    title,
    journey,
    duration,
    icon,
    onPress,
    avatarUrl,
    taskImage,
    backgroundImage,
    username = 'Param',
    tag = '/orb',
    timestamp = '18:12',
    count = 1,
    gradientColors = [
        'rgba(20, 83, 45, 0.35)', // Deep Forest Green
        'rgba(34, 197, 94, 0.25)', // Vibrant Emerald
        'rgba(20, 83, 45, 0.3)'   // Deep Forest Light
    ]
}) => {
    // Animation Shared Values
    const orb1X = useSharedValue(0);
    const orb1Y = useSharedValue(0);
    const orb1Scale = useSharedValue(1);

    const orb2X = useSharedValue(0);
    const orb2Y = useSharedValue(0);
    const orb2Scale = useSharedValue(1);

    const orb3X = useSharedValue(0);
    const orb3Y = useSharedValue(0);
    const orb3Scale = useSharedValue(1);

    // Helper to generate randomish floating motion
    useEffect(() => {
        // Orb 1: Base - Slow, large movements
        orb1X.value = withRepeat(
            withSequence(
                withTiming(40, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
                withTiming(-30, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.ease) })
            ), -1, true
        );
        orb1Y.value = withRepeat(
            withSequence(
                withTiming(-30, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
                withTiming(20, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) })
            ), -1, true
        );
        orb1Scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.9, { duration: 7000, easing: Easing.inOut(Easing.ease) })
            ), -1, true
        );

        // Orb 2: Highlight - Faster, more erratic
        orb2X.value = withRepeat(
            withSequence(
                withDelay(50, withTiming(-500, { duration: 4500, easing: Easing.inOut(Easing.quad) })),
                withTiming(40, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 4500, easing: Easing.inOut(Easing.quad) })
            ), -1, true
        );
        orb2Y.value = withRepeat(
            withSequence(
                withTiming(40, { duration: 5000, easing: Easing.inOut(Easing.quad) }),
                withTiming(-40, { duration: 4500, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.quad) })
            ), -1, true
        );
        orb2Scale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.8, { duration: 5000, easing: Easing.inOut(Easing.ease) })
            ), -1, true
        );

        // Orb 3: Accent - Gentle Drift
        orb3X.value = withRepeat(
            withSequence(
                withTiming(-90, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
                withTiming(90, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
                withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.sin) })
            ), -1, true
        );
        orb3Y.value = withRepeat(
            withSequence(
                withTiming(90, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
                withTiming(-90, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
                withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
            ), -1, true
        );
        orb3Scale.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.85, { duration: 8000, easing: Easing.inOut(Easing.ease) })
            ), -1, true
        );
    }, []);

    const rStyleOrb1 = useAnimatedStyle(() => ({
        transform: [
            { translateX: orb1X.value }, 
            { translateY: orb1Y.value },
            { scale: orb1Scale.value }
        ]
    }));

    const rStyleOrb2 = useAnimatedStyle(() => ({
        transform: [
            { translateX: orb2X.value }, 
            { translateY: orb2Y.value },
            { scale: orb2Scale.value }
        ]
    }));

    const rStyleOrb3 = useAnimatedStyle(() => ({
        transform: [
            { translateX: orb3X.value }, 
            { translateY: orb3Y.value },
            { scale: orb3Scale.value }
        ]
    }));

    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => [
                styles.pressable,
                { transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
        >
            <View style={styles.cardContainer}>
                {/* Fluid Glass Background */}
                <View style={styles.fluidBackgroundWrapper}>
                    <GlassContainer 
                        style={styles.fill} 
                        spacing={40} // High spacing for "blobs merging" effect
                    >
                        {/* Blob 1: Base */}
                        <AnimatedGlassView 
                            style={[styles.orbBase, styles.orb1, rStyleOrb1]}
                            glassEffectStyle="regular"
                            tintColor={gradientColors[0]}
                        />
                        
                        {/* Blob 2: Highlight */}
                        <AnimatedGlassView 
                            style={[styles.orbBase, styles.orb2, rStyleOrb2]}
                            glassEffectStyle="regular"
                            tintColor={gradientColors[1]}
                        />

                        {/* Blob 3: Accent */}
                        <AnimatedGlassView 
                            style={[styles.orbBase, styles.orb3, rStyleOrb3]}
                            glassEffectStyle="regular"
                            tintColor={gradientColors[2]}
                        />
                    </GlassContainer>
                </View>

                {/* Main Card Surface Glass */}
                <GlassView 
                    style={styles.surfaceGlass}
                    glassEffectStyle="regular"
                    tintColor="rgba(255, 255, 255, 0.01)" 
                />

                <View style={styles.contentRow}>
                    {/* Image Section */}
                    <View style={styles.imageShadow}>
                        <View style={styles.imageWrapper}>
                            <GlassView 
                                style={styles.imageOverlay}
                                glassEffectStyle="regular"
                                tintColor="rgba(0, 0, 0, 0.5)"
                                isInteractive={true}
                            />
                            <Image 
                                source={taskImage || require('../../assets/images/task-logo.png')}
                                style={styles.taskImage}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* Text Section */}
                    <View style={styles.textContainer}>
                        {/* Header: User + Time */}
                        <View style={styles.headerRow}>
                            <Text style={styles.usernameText}>{username}</Text>
                            <View style={styles.spacer} />
                            <Text style={styles.timestampText}>{timestamp}</Text>
                        </View>

                        {/* Title */}
                        <Text style={styles.titleText} numberOfLines={1}>{title}</Text>

                        {/* Journey & Duration */}
                        <Text style={styles.subtitleText}>{`${journey} • ${duration}`}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create(theme => ({
    pressable: {
        marginVertical: theme.spacing.xs,
    },
    cardContainer: {
        borderRadius: theme.radius['2xl'],
        overflow: 'hidden',
        minHeight: 90,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.08)',
        borderCurve: 'continuous',
    },
    fluidBackgroundWrapper: {
        position: 'absolute',
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
        overflow: 'hidden',
    },
    fill: {
        flex: 1,
    },
    orbBase: {
        position: 'absolute',
    },
    orb1: {
        top: -40,
        left: -40,
        width: 240,
        height: 240,
        borderRadius: 120,
    },
    orb2: {
        top: 20,
        left: 60,
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    orb3: {
        top: -20,
        right: -50,
        width: 260,
        height: 260,
        borderRadius: 130,
    },
    surfaceGlass: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentRow: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    imageShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageWrapper: {
        width: 72,
        height: 72,
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    taskImage: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    usernameText: {
        fontSize: theme.typography.caption.fontSize,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 0.7)',
    },
    timestampText: {
        fontSize: theme.typography.xs.fontSize,
        color: 'rgba(0, 0, 0, 0.4)',
        fontWeight: '500',
    },
    titleText: {
        fontSize: theme.typography.title.fontSize,
        fontWeight: '700',
        color: '#000',
        marginBottom: 1,
    },
    subtitleText: {
        fontSize: theme.typography.caption.fontSize,
        color: 'rgba(0, 0, 0, 0.5)',
        fontWeight: '500',
    },
    spacer: {
        flex: 1,
    },
}));

export default UpcomingTaskCard;

