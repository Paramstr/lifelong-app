import {
    Circle,
    Text as ExpoText,
    GlassEffectContainer,
    Host,
    HStack,
    Spacer,
    VStack,
    ZStack
} from '@expo/ui/swift-ui';
import {
    border,
    cornerRadius,
    foregroundStyle,
    frame,
    offset,
    opacity,
    padding,
    shadow
} from '@expo/ui/swift-ui/modifiers';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface UpcomingTaskCardProps {
    title: string;
    journey: string;
    duration: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    // New props for the redesign
    avatarUrl?: ImageSourcePropType;
    taskImage?: ImageSourcePropType;
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
    username = 'Param',
    tag = '/orb',
    timestamp = '18:12',
    count = 1,
}) => {
    return (
        <Pressable onPress={onPress}>
            {/* 
              matchContents ensures the Host only takes as much space as the card.
            */}
            <Host>
                {/* 
                  Modifiers belong on the GlassEffectContainer to ensure the background,
                  border, and shadow all share the same layout and rounding.
                */}
                <GlassEffectContainer 
                    modifiers={[
                        cornerRadius(16),
                        border({ 
                            color: 'rgba(128, 128, 128, 0.3)', // Gray border
                            width: 1
                        }),
                        shadow({
                            radius: 12,
                            x: 0,
                            y: 4,
                            color: 'rgba(0, 0, 0, 0.08)',
                        }),
                    ]}
                >
                    {/* 
                      ZStack for layering the main content and the bottom-right notification badge.
                      We apply rounding here too to ensure the "water" (glass) and content match.
                    */}
                    <ZStack 
                        alignment="bottomTrailing"
                        modifiers={[
                            cornerRadius(16)
                        ]}
                    >
                        {/* 
                          Main layout row: 
                          - Image column is content-sized.
                          - Text column is flexible.
                        */}
                        <HStack 
                            spacing={12} 
                            alignment="center"
                            modifiers={[
                                padding({ all: 12 }),
                                cornerRadius(16)
                            ]}
                        >
                            {/* 1. Strictly content-sized image column */}
                            <ZStack 
                                alignment="bottomTrailing"
                                modifiers={[
                                    frame({ width: 80, height: 80 })
                                ]}
                            >
                                <Image 
                                    source={taskImage || require('../../assets/images/task-logo.png')}
                                    style={{ 
                                        width: 80, 
                                        height: 80, 
                                        borderRadius: 20,
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        // Ensure image is visible
                                        opacity: 1,
                                    }}
                                    resizeMode="cover"
                                />

                            </ZStack>

                            {/* 2. Flexible text column */}
                            <VStack 
                                alignment="leading" 
                                spacing={2} 
                                modifiers={[
                                    frame({ maxWidth: 'infinity' as any, alignment: 'leading' })
                                ]}
                            >
                                {/* 4. Header row strictly contains the Spacer */}
                                <HStack spacing={6} alignment="center">
                                    {avatarUrl && (
                                        <Image 
                                            source={avatarUrl}
                                            style={styles.avatar}
                                        />
                                    )}
                                    <ExpoText weight="semibold" size={14}>
                                        {username}
                                    </ExpoText>
                                    <Spacer />
                                    <ExpoText modifiers={[opacity(0.4)]} size={11}>
                                        {timestamp}
                                    </ExpoText>
                                </HStack>

                                {/* Task Title */}
                                <ExpoText weight="bold" size={18}>
                                    {title}
                                </ExpoText>

                                {/* Journey & Duration details */}
                                <ExpoText modifiers={[opacity(0.6)]} size={14}>
                                    {`${journey}: ${duration}`}
                                </ExpoText>
                            </VStack>
                        </HStack>

                        {/* Restoring Badge as it's part of the visual design */}
                        <ZStack modifiers={[
                            frame({ width: 28, height: 28 }),
                            offset({ x: -14, y: -14 })
                        ]}>
                            <Circle modifiers={[foregroundStyle('#FF3B30')]} />
                            <ExpoText weight="bold" color="white" size={13}>
                                {count.toString()}
                            </ExpoText>
                        </ZStack>
                    </ZStack>
                </GlassEffectContainer>
            </Host>
        </Pressable>
    );
};

const styles = StyleSheet.create((theme) => ({
    pinContainer: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        zIndex: 10,
    },
    pinCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    badgeContainer: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF3B30', // Red badge like in the design
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
}));

export default UpcomingTaskCard;
