import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';

interface ProtocolStepItemProps {
    stepNumber: number;
    title: string;
    description: string;
    duration?: string;
    reps?: string;
    videoPlaceholderColor?: string;
    videoId: string;
    startTime: number;
    endTime?: number;
    onPress?: () => void;
}

const ProtocolStepItem: React.FC<ProtocolStepItemProps> = ({
    stepNumber,
    title,
    description,
    duration,
    reps,
    videoPlaceholderColor = '#f0f0f0',
    videoId,
    startTime,
    endTime,
    onPress
}) => {
    const [playing, setPlaying] = useState(true); // Start playing to load video
    const [muted, setMuted] = useState(true); // Start muted
    const [completed, setCompleted] = useState(false);
    const playerRef = useRef<YoutubeIframeRef>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handlePress = useCallback(() => {
        setPlaying(prev => {
            const nextState = !prev;
            if (nextState) {
                setMuted(false); // Unmute when playing
            }
            return nextState;
        });
    }, []);

    const onStateChange = useCallback((state: string) => {
        if (state === 'playing') {
            // Initial thumbnail load logic:
            // If we are starting muted (auto-play for thumbnail), pause immediately after seeking is done/video starts
             if (muted && !completed) {
                // We use a small timeout to let it render a frame before pausing
                setTimeout(() => {
                    setPlaying(false);
                }, 500);
            }
        }
    }, [muted, completed]);

    useEffect(() => {
        if (playing && !muted && endTime) {
            // Start polling for time check
            intervalRef.current = setInterval(async () => {
                const currentTime = await playerRef.current?.getCurrentTime();
                if (currentTime && currentTime >= endTime) {
                    setPlaying(false);
                    setCompleted(true);
                    setMuted(true); // Mute for next time
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, 1000);
        } else {
             if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
             if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [playing, muted, endTime]);



    return (
        <GlassView style={styles.container} glassEffectStyle="regular">
            <View style={styles.content}>
                {/* Header: Step Info */}
                <View style={styles.header}>

                    <View style={[styles.stepBadge, completed && styles.stepBadgeCompleted]}>
                        <Text style={[styles.stepText, completed && styles.stepTextCompleted]}>
                            {completed ? <Ionicons name="checkmark" size={12} color="#fff" /> : stepNumber}
                        </Text>
                    </View>
                    <Text style={styles.title}>{title}</Text>
                </View>

                {/* Video Placeholder */}
                <TouchableOpacity activeOpacity={0.8} onPress={handlePress} disabled={playing}>
                    <View style={[styles.videoPlaceholder, { backgroundColor: videoPlaceholderColor }]}>
                        <View style={styles.videoThumbnail} pointerEvents={playing && !muted ? 'auto' : 'none'}>
                             <YoutubePlayer
                                ref={playerRef}
                                height={200}
                                play={playing}
                                mute={muted}
                                videoId={videoId}
                                onChangeState={onStateChange}
                                initialPlayerParams={{
                                    start: startTime,
                                    controls: 0, 
                                    showInfo: 0,
                                    modestbranding: 1,
                                    rel: 0
                                }}
                            />
                        </View>
                        {!playing && (
                            <View style={styles.playIconContainer} pointerEvents="none">
                                <Ionicons name="play-circle" size={48} color="rgba(0,0,0,0.5)" />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Description */}
                <Text style={styles.description}>{description}</Text>

                {/* Footer: Metadata */}
                <View style={styles.footer}>
                   {duration && (
                        <View style={styles.metaTag}>
                            <Ionicons name="time-outline" size={14} color="#666" />
                            <Text style={styles.metaText}>{duration}</Text>
                        </View>
                   )}
                   {reps && (
                        <View style={styles.metaTag}>
                            <Ionicons name="repeat-outline" size={14} color="#666" />
                            <Text style={styles.metaText}>{reps}</Text>
                        </View>
                   )}
                </View>
            </View>
        </GlassView>
    );
};

const styles = StyleSheet.create(theme => ({
    container: {
        borderRadius: theme.radius['2xl'],
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // More opaque for light mode
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    content: {
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    stepBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.sm,
    },
    stepBadgeCompleted: {
        backgroundColor: '#51cf66',
    },
    stepText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepTextCompleted: {
        color: '#fff',
    },
    title: {
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
        color: '#1a1a1a', // Darker black
    },
    videoPlaceholder: {
        width: '100%',
        height: 180,
        borderRadius: theme.radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    playIconContainer: {
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 100,
    },
    description: {
        fontSize: theme.typography.body.fontSize,
        color: '#444', // Dark grey
        lineHeight: 22,
        marginBottom: theme.spacing.md,
    },
    footer: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    metaTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.03)',
        gap: 4,
    },
    metaText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
    }
}));

export default ProtocolStepItem;
