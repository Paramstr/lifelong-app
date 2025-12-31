import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface NoteFormProps {
    onSave: (text: string) => void;
    onCancel: () => void;
}

export const NoteForm = ({ onSave, onCancel }: NoteFormProps) => {
    const { theme } = useUnistyles();
    const [text, setText] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TextInput
                style={styles.input}
                placeholder="How are you feeling?"
                placeholderTextColor="rgba(0,0,0,0.3)"
                multiline
                autoFocus
                value={text}
                onChangeText={setText}
                selectionColor={theme.colors.brand.primary}
            />

            <View style={styles.footer}>
                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.postButton, !text && styles.postButtonDisabled]}
                    disabled={!text}
                    onPress={() => onSave(text)}
                >
                    <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        justifyContent: 'center',
    },
    input: {
        fontSize: 28,
        fontWeight: '500',
        color: '#000',
        minHeight: 120,
        textAlignVertical: 'top',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
    },
    cancelButton: {
        padding: theme.spacing.sm,
    },
    cancelText: {
        fontSize: 17,
        color: 'rgba(0,0,0,0.5)',
    },
    postButton: {
        backgroundColor: '#000',
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: 12,
        borderRadius: 30,
    },
    postButtonDisabled: {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    postText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    }
}));
