import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface MedicalRecordFormProps {
    onSave: (data: any) => void;
    onCancel: () => void;
}

export const MedicalRecordForm = ({ onSave, onCancel }: MedicalRecordFormProps) => {
    const { theme } = useUnistyles();
    const [file, setFile] = useState<any>(null);

    const handlePickFile = () => {
        // Mock file picking for UI demo
        setFile({ name: 'blood_work_dec_2025.pdf', size: '1.2 MB' });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity
                    style={[styles.uploadArea, file && styles.uploadAreaFilled]}
                    onPress={handlePickFile}
                    activeOpacity={0.8}
                >
                    {file ? (
                        <View style={styles.fileContent}>
                            <SymbolView name="doc.fill" tintColor="#4DA3D9" size={32} />
                            <View>
                                <Text style={styles.fileName}>{file.name}</Text>
                                <Text style={styles.fileSize}>{file.size}</Text>
                            </View>
                        </View>
                    ) : (
                        <>
                            <SymbolView name="arrow.up.doc" tintColor="rgba(0,0,0,0.3)" size={40} />
                            <Text style={styles.uploadText}>Tap to select a document</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={onCancel} style={styles.button}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.saveButton, !file && styles.disabled]}
                    disabled={!file}
                    onPress={() => onSave({ file })}
                >
                    <Text style={styles.saveText}>Save Record</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    uploadArea: {
        height: 200,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)',
        borderStyle: 'dashed',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        gap: 16,
    },
    uploadAreaFilled: {
        borderStyle: 'solid',
        backgroundColor: '#fff',
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    uploadText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.5)',
        fontWeight: '500',
    },
    fileContent: {
        alignItems: 'center',
        gap: 12,
    },
    fileName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    fileSize: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        textAlign: 'center',
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
        backgroundColor: '#4DA3D9',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
    },
    disabled: { opacity: 0.5 },
    saveText: { color: '#fff', fontWeight: '600', fontSize: 17 },
}));
