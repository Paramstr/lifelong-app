import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ProtocolStepItemProps {
    stepNumber: number;
    title: string;
    description: string;
    duration?: string;
    reps?: string;
    videoPlaceholderColor?: string;
    imageUrl?: string;
    onPress?: () => void;
}

const ProtocolStepItem: React.FC<ProtocolStepItemProps> = ({
    stepNumber,
    title,
    description,
    duration,
    reps,
    videoPlaceholderColor = '#f0f0f0',
    imageUrl,
    onPress
}) => {
    return (
        <GlassView style={styles.container} glassEffectStyle="regular">
            <View style={styles.content}>
                {/* Header: Step Info */}
                <View style={styles.header}>
                    <View style={styles.stepBadge}>
                        <Text style={styles.stepText}>{stepNumber}</Text>
                    </View>
                    <Text style={styles.title}>{title}</Text>
                </View>

                {/* Video Placeholder */}
                <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                    <View style={[styles.videoPlaceholder, { backgroundColor: videoPlaceholderColor }]}>
                        {imageUrl ? (
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.videoThumbnail}
                                resizeMode="cover"
                            />
                        ) : null}
                        <View style={styles.playIconContainer}>
                            <Ionicons name="play-circle" size={48} color="rgba(0,0,0,0.5)" />
                        </View>
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
    stepText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
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
