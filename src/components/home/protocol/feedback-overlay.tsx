import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

interface FeedbackOverlayProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ visible, onClose, onSubmit }) => {
    const [rating, setRating] = useState<number | null>(null);

    if (!visible) return null;

    return (
        <View style={styles.overlayContainer} pointerEvents="box-none">
            {/* Backdrop */}
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.backdrop}>
                 <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
            </Animated.View>

            {/* Modal Content */}
            <Animated.View entering={SlideInDown.springify().damping(20)} exiting={SlideOutDown} style={styles.modalWrapper}>
                <GlassView style={styles.modalContent} glassEffectStyle="regular">
                    
                    <View style={styles.header}>
                        <Text style={styles.title}>Session Complete</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={24} color="rgba(0,0,0,0.4)" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>How was the intensity?</Text>
                    
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <TouchableOpacity 
                                key={item} 
                                onPress={() => setRating(item)}
                                style={[styles.ratingButton, rating === item && styles.ratingButtonSelected]}
                            >
                                <Text style={[styles.ratingText, rating === item && styles.ratingTextSelected]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.labelsRow}>
                         <Text style={styles.labelText}>Too Easy</Text>
                         <Text style={styles.labelText}>Too Hard</Text>
                    </View>

                    <Text style={styles.subtitle}>Any notes?</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Felt good, knee pain subsided..."
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        multiline
                    />

                    <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Save Details</Text>
                    </TouchableOpacity>

                </GlassView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create(theme => ({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backdropTouch: {
        flex: 1,
    },
    modalWrapper: {
        padding: 20,
        paddingBottom: 40,
    },
    modalContent: {
        borderRadius: 30,
        overflow: 'hidden',
        padding: 24,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#444',
        marginBottom: 12,
        marginTop: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    ratingButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingButtonSelected: {
        backgroundColor: '#000',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    ratingTextSelected: {
        color: '#fff',
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    labelText: {
        fontSize: 12,
        color: '#888',
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        height: 100,
        marginBottom: 24,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#000',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    }
}));

export default FeedbackOverlay;
