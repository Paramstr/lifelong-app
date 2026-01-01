import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet as RNStyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { HEALTH_ADD_OPTIONS, HealthOptionId } from '../../data/add-options';

// Forms
import { InjuryForm } from './forms/injury-form';
import { MeasurementForm } from './forms/measurement-form';
import { MedicalRecordForm } from './forms/medical-record-form';
import { NoteForm } from './forms/note-form';

interface HealthInputOverlayProps {
    visible: boolean;
    onClose: () => void;
    topInset: number;
}

type Mode = 'selection' | HealthOptionId;

export const HealthInputOverlay = ({ visible, onClose, topInset }: HealthInputOverlayProps) => {
    const { theme } = useUnistyles();
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<Mode>('selection');

    // Reset mode when visibility changes
    useEffect(() => {
        if (visible) {
            setMode('selection');
        }
    }, [visible]);

    if (!visible) return null;

    const handleSelect = (id: HealthOptionId) => {
        // Configure layout animation for smooth height changes
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMode(id);
    };

    const activeOption = HEALTH_ADD_OPTIONS.find(o => o.id === mode);

    return (
        <View style={[RNStyleSheet.absoluteFill, { zIndex: 2000 }]}>
            {/* Background Blur */}
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={RNStyleSheet.absoluteFill}
            >
                <BlurView intensity={30} tint="default" style={RNStyleSheet.absoluteFill} />
                {/* Helper to close on tapping background (only in selection mode) */}
                {mode === 'selection' && (
                    <Pressable style={RNStyleSheet.absoluteFill} onPress={onClose} />
                )}
            </Animated.View>

            {/* Content Container */}
            <View style={[styles.contentContainer, { paddingTop: topInset + 20, paddingBottom: insets.bottom + 20 }]}>

                {/* Header (Active Mode Title) */}
                {mode !== 'selection' && activeOption && (
                    <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
                        <View style={[styles.headerIcon, { backgroundColor: activeOption.color }]}>
                            {Platform.OS === 'ios' ? (
                                <SymbolView name={activeOption.icon as any} tintColor="#fff" size={20} />
                            ) : (
                                <Ionicons name={activeOption.fallbackIcon} color="#fff" size={20} />
                            )}
                        </View>
                        <Text style={styles.headerTitle}>{activeOption.label}</Text>
                    </Animated.View>
                )}

                {/* Selection List */}
                {mode === 'selection' && (
                    <View style={styles.selectionList}>
                        {HEALTH_ADD_OPTIONS.map((option, index) => (
                            <Animated.View
                                key={option.id}
                                entering={SlideInDown.delay(index * 50).duration(300).damping(20)}
                                exiting={FadeOut.duration(100)}
                            >
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => handleSelect(option.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.optionLabel}>{option.label}</Text>
                                    <View style={styles.optionIconContainer}>
                                        {Platform.OS === 'ios' ? (
                                            <SymbolView name={option.icon as any} tintColor={option.color} size={24} />
                                        ) : (
                                            <Ionicons name={option.fallbackIcon} color={option.color} size={24} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                )}

                {/* Forms */}
                {mode === 'note' && (
                    <Animated.View entering={FadeIn} style={styles.formContainer}>
                        <NoteForm onSave={onClose} onCancel={() => setMode('selection')} />
                    </Animated.View>
                )}
                {mode === 'measurement' && (
                    <Animated.View entering={FadeIn} style={styles.formContainer}>
                        <MeasurementForm onSave={onClose} onCancel={() => setMode('selection')} />
                    </Animated.View>
                )}
                {mode === 'injury' && (
                    <Animated.View entering={FadeIn} style={styles.formContainer}>
                        <InjuryForm onSave={onClose} onCancel={() => setMode('selection')} />
                    </Animated.View>
                )}
                {mode === 'record' && (
                    <Animated.View entering={FadeIn} style={styles.formContainer}>
                        <MedicalRecordForm onSave={onClose} onCancel={() => setMode('selection')} />
                    </Animated.View>
                )}

            </View>
        </View>
    );
};

const styles = StyleSheet.create(theme => ({
    contentContainer: {
        flex: 1,
    },
    // Selection Styles
    selectionList: {
        position: 'absolute',
        right: 20,
        top: 100, // Approximate header height offset
        width: 220,
        gap: 16,
        alignItems: 'flex-end',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    optionIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // Optional: Add a subtle glass backing to icons if needed
    },
    // Active Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    headerIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    // Form Container
    formContainer: {
        flex: 1,
    }
}));
