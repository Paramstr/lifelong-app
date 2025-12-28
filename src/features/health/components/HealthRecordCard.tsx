import React from 'react';
import { View, Text, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export type RecordType = 'image' | 'file' | 'collection' | 'generic';

interface HealthRecordCardProps {
  title: string;
  subtitle: string;
  type: RecordType;
  icon?: string;
  iconColor?: string;
  imageUrl?: string;
  itemCount?: number;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({
  title,
  subtitle,
  type,
  icon = 'doc.fill',
  iconColor = '#6FA8C9',
  imageUrl,
  itemCount,
}) => {
  const renderThumbnail = () => {
    if (imageUrl) {
      return <Image source={{ uri: imageUrl }} style={styles.thumbnailImage} contentFit="cover" />;
    }

    return (
      <View style={[styles.thumbnailIcon, { backgroundColor: iconColor + '20' }]}> 
        {Platform.OS === 'ios' ? (
          <SymbolView
            name={icon}
            size={32}
            tintColor={iconColor}
            resizeMode="scaleAspectFit"
          />
        ) : (
          <Ionicons name="document" size={32} color={iconColor} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.thumbnailContainer}>
        {renderThumbnail()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.metaContainer}>
           <Text style={styles.subtitle}>{subtitle}</Text>
           {itemCount !== undefined && (
             <Text style={styles.itemCount}>{itemCount} items</Text>
           )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    // Add subtle shadow if needed, or flat border
    borderWidth: 1,
    borderColor: theme.colors.background.primary === '#FFFFFF' ? theme.colors.border.subtle : 'transparent', // minimal border on light mode
  },
  thumbnailContainer: {
    marginRight: theme.spacing.md,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.lg,
  },
  thumbnailIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
  itemCount: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
}));

export default HealthRecordCard;
