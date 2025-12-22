import { Ionicons } from '@expo/vector-icons';
import { GlassContainer, GlassView } from 'expo-glass-effect';
import React, { useEffect } from 'react';
import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

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
}) => {
    // Animation Shared Values
    const orb1X = useSharedValue(0);
    const orb1Y = useSharedValue(0);
    const orb2X = useSharedValue(0);
    const orb2Y = useSharedValue(0);

    useEffect(() => {
        // Orb 1: Circular/Figure-8 motion
        orb1X.value = withRepeat(
            withSequence(
                withTiming(30, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(-20, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        orb1Y.value = withRepeat(
            withSequence(
                withTiming(-20, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
                withTiming(20, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        // Orb 2: Counter motion
        orb2X.value = withRepeat(
            withSequence(
                withTiming(-20, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
                withTiming(30, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 4500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        orb2Y.value = withRepeat(
            withSequence(
                withTiming(20, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
                withTiming(-30, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
                withTiming(0, { duration: 5500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const rStyleOrb1 = useAnimatedStyle(() => ({
        transform: [{ translateX: orb1X.value }, { translateY: orb1Y.value }]
    }));

    const rStyleOrb2 = useAnimatedStyle(() => ({
        transform: [{ translateX: orb2X.value }, { translateY: orb2Y.value }]
    }));

    return (
        <Pressable 
            onPress={onPress} 
            style={({ pressed }) => ({
                marginVertical: 8,
                transform: [{ scale: pressed ? 0.98 : 1 }]
            })}
        >
            <View style={{
                borderRadius: 24,
                overflow: 'hidden',
                minHeight: 104,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.08)',
                // @ts-ignore: borderCurve is a valid react-native style for iOS 13+ but requires newer types
                borderCurve: 'continuous',
            }}>
                {/* Fluid Glass Background */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden',
                }}>
                    <GlassContainer 
                        style={{ flex: 1 }} 
                        spacing={40} // High spacing for "blobs merging" effect
                    >
                        {/* Blob 1: Deep Forest Green - Base */}
                        <AnimatedGlassView 
                            style={[{
                                position: 'absolute',
                                top: -40,
                                left: -40,
                                width: 220,
                                height: 220,
                                borderRadius: 110,
                            }, rStyleOrb1]}
                            glassEffectStyle="regular"
                            tintColor="rgba(20, 83, 45, 0.35)" // Deep Forest
                        />
                        
                        {/* Blob 2: Vibrant Emerald - Highlight */}
                        <AnimatedGlassView 
                            style={[{
                                position: 'absolute',
                                top: 20,
                                left: 60,
                                width: 180,
                                height: 180,
                                borderRadius: 90,
                            }, rStyleOrb2]}
                            glassEffectStyle="regular"
                            tintColor="rgba(34, 197, 94, 0.25)" // Emerald/Leaf
                        />
                    </GlassContainer>
                </View>

                {/* Main Card Surface Glass (Optional overlay to unify) 
                    Set to 'clear' or transparent white to just let the blobs show through but still blur background if needed.
                */}
                <GlassView 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                    glassEffectStyle="regular"
                    tintColor="rgba(255, 255, 255, 0.1)" 
                />

                <View style={{
                    flexDirection: 'row',
                    padding: 12,
                    alignItems: 'center',
                }}>
                    {/* Image Section */}
                    {/* Shadow Wrapper */}
                    <View style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    }}>
                        {/* Glass Tile Container */}
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 18,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                        }}>
                            <GlassView 
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                glassEffectStyle="regular"
                                tintColor="rgba(0, 0, 0, 0.5)"
                                isInteractive={true}

                            />
                            <Image 
                                source={taskImage || require('../../assets/images/task-logo.png')}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0.9,
                                }}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* Text Section */}
                    <View style={{
                        flex: 1,
                        marginLeft: 14,
                        justifyContent: 'center',
                    }}>
                        {/* Header: User + Time */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 4,
                        }}>

                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: 'rgba(0, 0, 0, 0.7)',
                            }}>{username}</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={{
                                fontSize: 11,
                                color: 'rgba(0, 0, 0, 0.4)',
                                fontWeight: '500',
                            }}>{timestamp}</Text>
                        </View>

                        {/* Title */}
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: '#000',
                            marginBottom: 2,
                        }} numberOfLines={1}>{title}</Text>

                        {/* Journey & Duration */}
                        <Text style={{
                            fontSize: 13,
                            color: 'rgba(0, 0, 0, 0.5)',
                            fontWeight: '500',
                        }}>{`${journey} • ${duration}`}</Text>
                    </View>
                </View>


            </View>
        </Pressable>
    );
};

export default UpcomingTaskCard;
