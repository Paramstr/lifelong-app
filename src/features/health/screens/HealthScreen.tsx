import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';
import HealthRecordCard, { RecordType } from '../components/HealthRecordCard';
import AddRecordDropdown from '../components/AddRecordDropdown';

// Mock Data
interface HealthRecord {
  id: string;
  title: string;
  subtitle: string;
  type: RecordType;
  icon?: string;
  iconColor?: string;
  imageUrl?: string;
  itemCount?: number;
}

const MOCK_DATA: HealthRecord[] = [
  {
    id: '1',
    title: 'image.png',
    subtitle: '16:48, 8 Apr 2025',
    type: 'image',
    imageUrl: 'https://picsum.photos/200/300', // Placeholder
  },
  {
    id: '2',
    title: 'image.png',
    subtitle: '16:48, 8 Apr 2025',
    type: 'image',
    icon: 'arrow.down.left.square.fill',
    iconColor: '#E91E63',
  },
  {
    id: '3',
    title: 'Flag of Hitoyoshi, Kumamoto',
    subtitle: '16:46, 8 Apr 2025',
    type: 'generic',
    icon: 'flag.fill',
    iconColor: '#FF5722',
  },
  {
    id: '4',
    title: 'gg +',
    subtitle: '16:46, 8 Apr 2025',
    type: 'collection',
    itemCount: 6759,
    icon: 'folder.fill',
    iconColor: '#F26B4F', // Primary Light
  },
  {
    id: '5',
    title: 'gg +',
    subtitle: '16:45, 8 Apr 2025',
    type: 'collection',
    itemCount: 6759,
    icon: 'folder.fill',
    iconColor: '#F26B4F',
  },
  {
    id: '6',
    title: 'GG +',
    subtitle: '16:45, 8 Apr 2025',
    type: 'generic',
    icon: 'globe',
    iconColor: '#6FA8C9', // Secondary Dark
  },
];

const HealthScreen = () => {
  const insets = useSafeAreaInsets();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  const handleSelectOption = (optionId: string) => {
    console.log('Selected option:', optionId);
    // Handle option selection logic here
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="square.and.pencil"
                size={22}
                tintColor="#94A3B8"
                resizeMode="scaleAspectFit"
              />
            ) : (
              <Ionicons name="create-outline" size={24} color="#94A3B8" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleDropdown}>
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="plus"
                size={22}
                tintColor="#94A3B8"
                resizeMode="scaleAspectFit"
              />
            ) : (
              <Ionicons name="add" size={24} color="#94A3B8" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HealthRecordCard
            title={item.title}
            subtitle={item.subtitle}
            type={item.type}
            icon={item.icon}
            iconColor={item.iconColor}
            imageUrl={item.imageUrl}
            itemCount={item.itemCount}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <AddRecordDropdown
        visible={isDropdownVisible}
        onClose={closeDropdown}
        onSelect={handleSelectOption}
        top={insets.top + 60}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.display, // Large title
    color: theme.colors.text.primary,
    fontSize: 32, // Override if needed to match screenshot "History" size
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
}));

export default HealthScreen;
