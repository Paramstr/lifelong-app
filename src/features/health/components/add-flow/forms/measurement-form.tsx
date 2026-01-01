import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface MeasurementFormProps {
    onSave: (data: any) => void;
    onCancel: () => void;
}

const TYPES = ['Weight', 'Heart Rate', 'Blood Pressure', 'Temp'];

export const MeasurementForm = ({ onSave, onCancel }: MeasurementFormProps) => {
    const { theme } = useUnistyles();
    const [selectedType, setSelectedType] = useState('Weight');
    const [value, setValue] = useState('');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Type Selector */}
            <View style={styles.typeRow}>
                {TYPES.map(t => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setSelectedType(t)}
                        style={[styles.typeChip, selectedType === t && styles.typeChipActive]}
                    >
                        <Text style={[styles.typeText, selectedType === t && styles.typeTextActive]}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Hero Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.heroInput}
                    placeholder="0"
                    placeholderTextColor="rgba(0,0,0,0.1)"
                    keyboardType="numeric"
                    autoFocus
                    value={value}
                    onChangeText={setValue}
                />
                <Text style={styles.unit}>
                    {selectedType === 'Weight' ? 'lb' :
                        selectedType === 'Heart Rate' ? 'bpm' :
                            selectedType === 'Temp' ? '°F' : ''}
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={onCancel} style={styles.button}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.saveButton, !value && styles.disabled]}
                    onPress={() => onSave({ type: selectedType, value })}
                    disabled={!value}
                >
                    <Text style={styles.saveText}>Save Record</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        padding: theme.spacing.lg,
        paddingTop: 40,
    },
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 40,
        justifyContent: 'center',
    },
    typeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    typeChipActive: {
        backgroundColor: '#3CB371', // Match the green theme
        borderColor: '#3CB371',
    },
    typeText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
    },
    typeTextActive: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: 40,
    },
    heroInput: {
        fontSize: 80,
        fontWeight: '700',
        color: '#000',
    },
    unit: {
        fontSize: 24,
        fontWeight: '600',
        color: 'rgba(0,0,0,0.4)',
        marginLeft: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        padding: 12,
    },
    cancelText: {
        fontSize: 17,
        color: 'rgba(0,0,0,0.5)',
    },
    saveButton: {
        backgroundColor: '#3CB371',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17,
    },
}));
