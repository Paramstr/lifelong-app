import { Ionicons } from '@expo/vector-icons';

export type HealthOptionId = 'record' | 'note' | 'injury' | 'measurement';

export type HealthOption = {
    id: HealthOptionId;
    label: string;
    icon: string; // SF Symbol name
    fallbackIcon: keyof typeof Ionicons.glyphMap;
    color: string;
};

export const HEALTH_ADD_OPTIONS: HealthOption[] = [
    {
        id: 'record',
        label: 'Medical Record',
        icon: 'doc.text.fill',
        fallbackIcon: 'document-text',
        color: '#4DA3D9', // Info Blue
    },
    {
        id: 'note',
        label: 'Note',
        icon: 'note.text',
        fallbackIcon: 'create',
        color: '#E6A23C', // Warning Orange
    },
    {
        id: 'injury',
        label: 'Injury',
        icon: 'bandage.fill',
        fallbackIcon: 'medkit',
        color: '#E5533D', // Error Red
    },
    {
        id: 'measurement',
        label: 'Measurement',
        icon: 'ruler.fill',
        fallbackIcon: 'analytics',
        color: '#3CB371', // Success Green
    },
];
