import { useAuthActions } from '@convex-dev/auth/react';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuthActions();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
          <SymbolView name="chevron.left" tintColor="#111" style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarRing}>
          <Image
            source={require('../assets/images/family/param_avatar.jpg')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>Param Singh</Text>
        <Text style={styles.subtitle}>Personal details</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  backText: {
    color: theme.colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  footer: {
    width: '100%',
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.text.primary,
  },
  logoutText: {
    color: theme.colors.background.primary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
}));
