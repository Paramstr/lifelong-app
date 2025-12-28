import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';

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
      {OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.id}
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
                size={20}
                tintColor={option.color}
                resizeMode="scaleAspectFit"
              />
            ) : (
              <Ionicons name={option.fallbackIcon} size={20} color={option.color} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    top: 60, // Adjust based on header height
    right: theme.spacing.md,
    backgroundColor: theme.colors.surface.card, // Or transparent if strictly requested "no border or fill" but usually needs background to read over content. 
    // User said: "dropdown options with no border or fill" -> This might mean the *buttons* inside don't have borders, but the dropdown container usually needs a background.
    // IF the user meant the dropdown CONTAINER has no border/fill, it would float on top of other text which is bad UI.
    // However, "dropdown options with no border or fill" likely refers to the items themselves.
    // I will give the container a clean look, maybe just a subtle shadow or blur, but let's stick to a solid card background for readability first.
    // Re-reading: "opens drop down options with no border or fill" -> The options themselves.
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    shadowColor: theme.shadows.lg.shadowColor,
    shadowOffset: theme.shadows.lg.shadowOffset,
    shadowOpacity: theme.shadows.lg.shadowOpacity,
    shadowRadius: theme.shadows.lg.shadowRadius,
    elevation: theme.shadows.lg.elevation,
    zIndex: 1000,
    minWidth: 180,
    gap: theme.spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Text on left, icon on right as per description "text ie. ... with a colour filled sf symbols logo next to it" -> usually implies text then icon? Or icon then text?
    // "text ie. Medical Record... with a ... logo NEXT TO IT".
    // I'll put text left, icon right to align with the "right side" origin of the menu.
    paddingVertical: theme.spacing.xs,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
    fontWeight: '500',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default AddRecordDropdown;
