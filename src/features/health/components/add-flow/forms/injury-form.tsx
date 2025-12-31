import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface InjuryFormProps {
    onSave: (data: any) => void;
    onCancel: () => void;
}

const INJURY_TYPES = ['Sprain', 'Cut', 'Bruise', 'Burn', 'Pain', 'Strain'];
const BODY_PARTS = ['Ankle', 'Knee', 'Back', 'Shoulder', 'Head', 'Wrist'];

export const InjuryForm = ({ onSave, onCancel }: InjuryFormProps) => {
    const { theme } = useUnistyles();
    const [type, setType] = useState('');
    const [location, setLocation] = useState('');

    const canSave = type && location;

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>What happened?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                    {INJURY_TYPES.map(t => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.chip, type === t && styles.chipActive]}
                            onPress={() => setType(t)}
                        >
                            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.label}>Where?</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                    {BODY_PARTS.map(p => (
                        <TouchableOpacity
                            key={p}
                            style={[styles.chip, location === p && styles.chipActive]}
                            onPress={() => setLocation(p)}
                        >
                            <Text style={[styles.chipText, location === p && styles.chipTextActive]}>{p}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Additional notes..."
                        placeholderTextColor="rgba(0,0,0,0.3)"
                        multiline
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={onCancel} style={styles.button}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.saveButton, !canSave && styles.disabled]}
                    disabled={!canSave}
                    onPress={() => onSave({ type, location })}
                >
                    <Text style={styles.saveText}>Log Injury</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        gap: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(0,0,0,0.6)',
        marginLeft: 4,
        marginBottom: 12,
        marginTop: 12,
    },
    scrollRow: {
        gap: 10,
        paddingRight: 20,
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    chipActive: {
        backgroundColor: '#E5533D',
        borderColor: '#E5533D',
    },
    chipText: {
        fontWeight: '500',
        color: '#000',
    },
    chipTextActive: {
        color: '#fff',
    },
    inputContainer: {
        marginTop: 10,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 16,
        minHeight: 100,
    },
    textInput: {
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    button: { padding: 12 },
    cancelText: { fontSize: 17, color: 'rgba(0,0,0,0.5)' },
    saveButton: {
        backgroundColor: '#E5533D',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
    },
    disabled: { opacity: 0.5 },
    saveText: { color: '#fff', fontWeight: '600', fontSize: 17 },
}));
