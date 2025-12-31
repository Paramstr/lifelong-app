import { useAuthActions } from '@convex-dev/auth/react';
import { GlassView } from 'expo-glass-effect';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Image, Linking, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import SoftRadialGradient from '../src/components/shared/soft-radial-gradient';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuthActions();
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <SoftRadialGradient />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <SymbolView name="chevron.left" tintColor={theme.colors.text.primary} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity Card */}
        <GlassView style={styles.identityCard} glassEffectStyle="regular">
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/images/family/param_avatar.jpg')}
              style={styles.avatar}
            />
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.identityContent}>
            <Text style={styles.name}>Param Singh</Text>
            <Text style={styles.handle}>@param</Text>
            <View style={styles.membershipBadge}>
              <SymbolView name="sparkles" tintColor="#fff" style={styles.badgeIcon} />
              <Text style={styles.membershipText}>Lifelong Pro</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <SymbolView name="pencil" tintColor={theme.colors.text.secondary} style={styles.editIcon} />
          </TouchableOpacity>
        </GlassView>

        {/* Manage Family Button */}
        <TouchableOpacity
          onPress={() => router.push('/manage-family')}
          activeOpacity={0.8}
        >
          <GlassView style={styles.menuButton} glassEffectStyle="regular">
            <View style={[styles.menuIconContainer, { backgroundColor: '#FF9F0A' }]}>
              <SymbolView name="person.2.fill" tintColor="#fff" style={styles.rowIcon} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.menuTitle}>Manage Family</Text>
              <Text style={styles.menuSubtitle}>3 Members • Invite pending</Text>
            </View>
            <SymbolView name="chevron.right" tintColor={theme.colors.text.muted} style={styles.chevron} />
          </GlassView>
        </TouchableOpacity>

        {/* Settings Groups */}
        <SettingsSection title="Preferences">
          <SettingsRow
            icon="bell.fill"
            iconColor={theme.colors.brand.primary}
            label="Notifications"
            value="On"
          />
          <SettingsRow
            icon="moon.fill"
            iconColor="#5E5CE6"
            label="Appearance"
            value="Auto"
          />
          <SettingsRow
            icon="textformat.size"
            iconColor="#007AFF"
            label="Text Size"
          />
        </SettingsSection>

        <SettingsSection title="Health Integration">
          <SettingsRow
            icon="heart.fill"
            iconColor="#FF2D55"
            label="HealthKit"
            value="Connected"
          />
          <SettingsRow
            icon="waveform.path.ecg"
            iconColor="#FF9F0A"
            label="Data Sources"
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow
            icon="lock.fill"
            iconColor="#32ADE6"
            label="Privacy"
          />
          <SettingsRow
            icon="doc.text.fill"
            iconColor="#8E8E93"
            label="Terms of Service"
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsRow
            icon="envelope.fill"
            iconColor="#5856D6"
            label="Send Feedback"
            onPress={() => Linking.openURL('mailto:feedback@lifelong.app')}
          />
        </SettingsSection>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => signOut()}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0 (24)</Text>
      </ScrollView>
    </View>
  );
}

// -- Components --

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const { theme } = useUnistyles();
  const validChildren = React.Children.toArray(children).filter(child => React.isValidElement(child));

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <GlassView style={styles.sectionCard} glassEffectStyle="regular">
        {validChildren.map((child, index) => (
          <View key={index}>
            {index > 0 && <View style={styles.separator} />}
            {child}
          </View>
        ))}
      </GlassView>
    </View>
  );
};

interface SettingsRowProps {
  icon: string;
  iconColor: string;
  label: string;
  value?: string;
  isSwitch?: boolean;
  onPress?: () => void;
}

const SettingsRow = ({ icon, iconColor, label, value, isSwitch, onPress }: SettingsRowProps) => {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !isSwitch}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <SymbolView name={icon} tintColor="#FFF" style={styles.rowIcon} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>

      <View style={styles.rowRight}>
        {value && !isSwitch && <Text style={styles.rowValue}>{value}</Text>}
        {isSwitch ? (
          <Switch value={true} onValueChange={() => { }} trackColor={{ true: theme.colors.brand.primary }} />
        ) : (
          <SymbolView name="chevron.right" tintColor={theme.colors.text.muted} style={styles.chevron} resizeMode="scaleAspectFit" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    ...theme.typography.headline,
    color: theme.colors.text.primary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 32,
  },
  // Identity Card
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    gap: 16,
    overflow: 'hidden',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.semantic.success,
    borderWidth: 2,
    borderColor: '#fff',
  },
  identityContent: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  handle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.brand.primary,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
    marginTop: 4,
  },
  badgeIcon: {
    width: 12,
    height: 12,
  },
  membershipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.card, // Fallback/bg
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  // Section
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.divider,
    marginLeft: 60,
  },
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIcon: {
    width: 18,
    height: 18,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  chevron: {
    width: 14,
    height: 14,
    opacity: 0.4,
  },
  // Family/Menu Button
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  menuSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },

  // Footer
  logoutButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.semantic.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: -8,
  },
}));
