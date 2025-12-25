import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface ProtocolStepItemProps {
    stepNumber: number;
    title: string;
    description: string;
    duration?: string;
    reps?: string;
    videoPlaceholderColor?: string;
}

const ProtocolStepItem: React.FC<ProtocolStepItemProps> = ({
    stepNumber,
    title,
    description,
    duration,
    reps,
    videoPlaceholderColor = '#eee'
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
                <View style={[styles.videoPlaceholder, { backgroundColor: videoPlaceholderColor }]}>
                    <Ionicons name="play-circle-outline" size={40} color="rgba(0,0,0,0.2)" />
                </View>

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
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
        color: '#000',
    },
    videoPlaceholder: {
        width: '100%',
        height: 160,
        borderRadius: theme.radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
    },
    description: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text.secondary,
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
