import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface UpcomingTaskCardProps {
    title: string;
    journey: string;
    duration: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
}

const UpcomingTaskCard: React.FC<UpcomingTaskCardProps> = ({
    title,
    journey,
    duration,
    icon,
    onPress,
}) => {
    return (
        <Pressable onPress={onPress} style={styles.card}>
            <View style={styles.infoContainer}>
                <View style={styles.journeyTag}>
                    <Text style={styles.journeyText}>{journey}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.duration}>{duration}</Text>
                
                <View style={styles.startButton}>
                    <Ionicons name="play" size={14} color="white" />
                    <Text style={styles.startButtonText}>Start</Text>
                </View>
            </View>

            <View style={styles.iconContainer}>
                <Ionicons 
                    name={icon} 
                    size={64} 
                    color="rgba(124, 138, 157, 0.15)" 
                    style={styles.bgIcon}
                />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create((theme) => ({
    card: {
        width: '100%',
        backgroundColor: theme.colors.surface.card,
        borderRadius: theme.radius['2xl'],
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        padding: theme.spacing.md,
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    journeyTag: {
        backgroundColor: theme.colors.semantic.infoSoft,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.radius.sm,
        alignSelf: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    journeyText: {
        color: theme.colors.semantic.info,
        fontSize: theme.typography.small.fontSize,
        fontWeight: '600',
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.title.fontSize,
        fontWeight: '700',
        marginBottom: 4,
    },
    duration: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.caption.fontSize,
        marginBottom: theme.spacing.md,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.brand.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 8,
        borderRadius: theme.radius.full,
        alignSelf: 'flex-start',
        gap: 6,
    },
    startButtonText: {
        color: 'white',
        fontSize: theme.typography.small.fontSize,
        fontWeight: '600',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.md,
    },
    bgIcon: {
        position: 'absolute',
        right: -10,
    },
}));

export default UpcomingTaskCard;
