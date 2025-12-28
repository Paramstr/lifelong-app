import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

type Option = {
  id: string;
  label: string;
  icon: string; // SF Symbol name
  fallbackIcon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const OPTIONS: Option[] = [
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

interface AddRecordDropdownProps {
  visible: boolean;
  onSelect: (optionId: string) => void;
  onClose: () => void;
  top?: number;
}

const AddRecordDropdown: React.FC<AddRecordDropdownProps> = ({ visible, onSelect, onClose, top = 60 }) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, { top }]}>
      {OPTIONS.map((option, index) => (
        <Animated.View
          key={option.id}
          entering={FadeInDown.delay(index * 30).springify().mass(0.6).damping(14).stiffness(150)}
          exiting={FadeOutUp.duration(150)}
        >
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onSelect(option.id);
              onClose();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option.label}</Text>
            <View style={styles.iconContainer}>
              {Platform.OS === 'ios' ? (
                <SymbolView
                  name={option.icon}
                  size={26}
                  tintColor={option.color}
                  resizeMode="scaleAspectFit"
                />
              ) : (
                <Ionicons name={option.fallbackIcon} size={26} color={option.color} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    right: theme.spacing.lg, // Aligned with header's paddingHorizontal
    zIndex: 1000,
    minWidth: 200,
    gap: theme.spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: theme.spacing.xs,
    paddingRight: theme.spacing.xs, // Slight adjustment to match the + icon's internal padding
  },
  optionText: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.md,
    fontWeight: '600',
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default AddRecordDropdown;