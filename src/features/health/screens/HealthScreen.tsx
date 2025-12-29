import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform, StyleSheet as RNStyleSheet, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import HealthRecordCard, { RecordType } from '../components/HealthRecordCard';
import AddRecordDropdown from '../components/AddRecordDropdown';
import { ProgressiveBlurHeader } from '@/components/shared/progressive-blur-header';

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
    title: 'Blood work panel.pdf',
    subtitle: '08:32, 12 Dec 2025',
    type: 'record',
    icon: 'doc.text.fill',
    iconColor: '#4DA3D9',
  },
  {
    id: '2',
    title: 'Felt nauseous after breakfast. Mild headache and light chills. Took ginger tea and rested for 30 minutes.',
    subtitle: '07:45, 20 Dec 2025',
    type: 'note',
  },
  {
    id: '3',
    title: 'Right ankle sprain',
    subtitle: '18:10, 23 Dec 2025',
    type: 'injury',
    icon: 'bandage.fill',
    iconColor: '#E5533D',
  },
  {
    id: '4',
    title: 'Blood pressure 118/76',
    subtitle: '09:10, 26 Dec 2025',
    type: 'measurement',
  },
  {
    id: '5',
    title: 'Weight 172 lb',
    subtitle: '07:05, 28 Dec 2025',
    type: 'measurement',
  },
  {
    id: '6',
    title: 'Headache, 2/10 after workout. Mostly behind eyes. Hydrated and symptoms eased within an hour.',
    subtitle: '21:22, 28 Dec 2025',
    type: 'note',
  },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HealthScreen = () => {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

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
    <View style={styles.container}>
      
      <ProgressiveBlurHeader
        scrollY={scrollY}
        height={insets.top + 72}
        insetsTop={insets.top}
        enableBlur={true}
        blurMaxIntensity={60}
        maskStops={[
          { location: 0, opacity: 1 },
          { location: 0.6, opacity: 1 },
          { location: 1, opacity: 0 }
        ]}
        blurRange={[0, 80]}
        backgroundRange={[0, 60]}
        travelRange={[0, 80]}
        travelTranslateY={[0, 32]}
        contentRange={[30, 70]}
        blurTint="light"
        tintColors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.1)']}
        contentStyle={styles.compactHeaderContent}
      >
        <View style={styles.compactHeader}>
           <Text style={styles.compactHeaderTitle}>Health</Text>
        </View>
      </ProgressiveBlurHeader>

      <View style={[styles.fixedActions, { top: insets.top }]}>
          <TouchableOpacity style={styles.iconButton}>
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="square.and.pencil"
                size={22}
                tintColor="black"
                resizeMode="scaleAspectFit"
              />
            ) : (
              <Ionicons name="create-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleDropdown}>
            {Platform.OS === 'ios' ? (
              <SymbolView
                name="plus"
                size={22}
                tintColor="black"
                resizeMode="scaleAspectFit"
              />
            ) : (
              <Ionicons name="add" size={24} color="black" />
            )}
          </TouchableOpacity>
      </View>

      <AnimatedFlatList
        data={MOCK_DATA}
        keyExtractor={(item: any) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }: any) => (
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
        ListHeaderComponent={
          <View style={[styles.largeHeader, { paddingTop: insets.top }]}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Health</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDropdownVisible} 
      />

      {isDropdownVisible && (
        <Animated.View 
            entering={FadeIn.duration(200)} 
            exiting={FadeOut.duration(200)} 
            style={RNStyleSheet.absoluteFill}
        >
             <BlurView
                intensity={20}
                style={RNStyleSheet.absoluteFill}
                tint="default"
            />
            <Pressable style={[RNStyleSheet.absoluteFill, styles.overlay]} onPress={closeDropdown} />
        </Animated.View>
      )}

      <AddRecordDropdown
        visible={isDropdownVisible}
        onClose={closeDropdown}
        onSelect={handleSelectOption}
        top={insets.top + 72}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  compactHeaderContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  compactHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactHeaderTitle: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
    fontSize: 17,
  },
  fixedActions: {
    position: 'absolute',
    right: 0,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    zIndex: 1002,
  },
  largeHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerRow: {
    height: 72,
    justifyContent: 'center',
    paddingTop: 4,
  },
  headerTitle: {
    ...theme.typography.display,
    color: theme.colors.text.primary,
    fontSize: 32,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
  }
}));

export default HealthScreen;
