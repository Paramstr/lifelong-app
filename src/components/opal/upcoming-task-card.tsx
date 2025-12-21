import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

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
                {/* 
                  GlassView from expo-glass-effect provides the liquid glass surface.
                  It fills the container and provides the blur.
                */}
                <GlassView style={StyleSheet.absoluteFill} />

                <View style={{
                    flexDirection: 'row',
                    padding: 12,
                    alignItems: 'center',
                }}>
                    {/* Image Section */}
                    <View style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    }}>
                        <Image 
                            source={taskImage || require('../../assets/images/task-logo.png')}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 18,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            }}
                            resizeMode="cover"
                        />
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
                            {avatarUrl && (
                                <Image 
                                    source={avatarUrl}
                                    style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: 9,
                                        marginRight: 6,
                                    }}
                                />
                            )}
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

                {/* Notification Badge */}
                {count > 0 && (
                    <View style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                    }}>
                        <View style={{
                            backgroundColor: '#FF3B30',
                            minWidth: 26,
                            height: 26,
                            borderRadius: 13,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                        }}>
                            <Text style={{
                                color: '#FFF',
                                fontSize: 13,
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>{count}</Text>
                        </View>
                    </View>
                )}
            </View>
        </Pressable>
    );
};

export default UpcomingTaskCard;
