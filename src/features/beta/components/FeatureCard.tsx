import React from 'react';
import { View, Text, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';
import { GlassView } from 'expo-glass-effect';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  isGreyedOut?: boolean;
}

export const FeatureCard = ({ title, description, icon, iconColor, isGreyedOut = false }: FeatureCardProps) => {
  const opacity = isGreyedOut ? 0.4 : 1;

  return (
    <View style={styles.shadowContainer}>
      <GlassView style={[styles.container, { opacity }]} glassEffectStyle="regular">
        <View style={[styles.iconContainer, { backgroundColor: isGreyedOut ? '#8882' : iconColor + '20' }]}>
          {Platform.OS === 'ios' ? (
            <SymbolView
              name={icon as any}
              size={24}
              tintColor={isGreyedOut ? '#888' : iconColor}
              resizeMode="scaleAspectFit"
            />
          ) : (
            <Ionicons name={icon as any} size={24} color={isGreyedOut ? '#888' : iconColor} />
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </View>
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: 'transparent',
    borderRadius: theme.radius.xl,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.background.primary === '#FFFFFF'
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(20, 20, 20, 0.4)',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: theme.spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.headline,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  description: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
}));