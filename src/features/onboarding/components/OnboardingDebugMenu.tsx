import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROUTES = [
  { name: 'index', title: 'Index' },
  { name: 'landing', title: 'Landing' },
  { name: 'initial-synthesis', title: 'Init Synth' },
  { name: 'full-name', title: 'Name' },
  { name: 'age', title: 'Age' },
  { name: 'gender', title: 'Gender' },
  { name: 'ancestry-origin', title: 'Ancestry' },
  { name: 'ancestry-weight', title: 'Anc. Wgt' },
  { name: 'ancestry-insight', title: 'Anc. Ins' },
  { name: 'dietary-baseline', title: 'Diet Base' },
  { name: 'sensitivities', title: 'Senses' },
  { name: 'allergies', title: 'Allergies' },
  { name: 'nutrition-context', title: 'Nutr Ctx' },
  { name: 'nutrition-targets', title: 'Nutr Tgt' },
  { name: 'lifelong-statement', title: 'Statement' },
  { name: 'camera-permission', title: 'Cam Perm' },
  { name: 'microphone-permission', title: 'Mic Perm' },
  { name: 'weight', title: 'Weight' },
  { name: 'sign-in', title: 'Sign In' },
];

export const OnboardingDebugMenu = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Only show in development mode
  if (!__DEV__) {
    return null;
  }

  return (
    <View style={[styles.container, { top: insets.top + 10 }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ROUTES.map((route, index) => {
          const isActive = pathname.includes(route.name);
          return (
            <TouchableOpacity 
              key={route.name}
              onPress={() => router.push(`/onboarding/${route.name}`)}
              style={[styles.button, isActive && styles.activeButton]}
            >
              <Text style={[styles.number, isActive && styles.activeText]}>{index + 1}</Text>
              <Text style={[styles.title, isActive && styles.activeText]}>{route.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    height: 50,
  },
  scrollContent: {
    paddingHorizontal: 10,
    gap: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  number: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'SpaceMono', // Match project convention
    fontWeight: '700',
  },
  title: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: 'black',
  },
});
