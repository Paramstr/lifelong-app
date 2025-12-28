import React from 'react';
import { View, Text, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { SymbolView } from 'expo-symbols';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { GlassView } from 'expo-glass-effect';

export type RecordType =
  | 'image'
  | 'file'
  | 'collection'
  | 'generic'
  | 'note'
  | 'measurement'
  | 'injury'
  | 'record';

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
  const isNote = type === 'note';
  const isMeasurement = type === 'measurement';
  const isTextLite = isNote || isMeasurement;

  const typeMeta = {
    record: {
      label: 'Medical Record',
      icon: 'doc.text.fill',
      fallbackIcon: 'document-text' as const,
      color: '#4DA3D9',
    },
    file: {
      label: 'Medical Record',
      icon: 'doc.text.fill',
      fallbackIcon: 'document-text' as const,
      color: '#4DA3D9',
    },
    note: {
      label: 'Note',
      icon: 'note.text',
      fallbackIcon: 'create' as const,
      color: '#E6A23C',
    },
    injury: {
      label: 'Injury',
      icon: 'bandage.fill',
      fallbackIcon: 'medkit' as const,
      color: '#E5533D',
    },
    measurement: {
      label: 'Measurement',
      icon: 'ruler.fill',
      fallbackIcon: 'analytics' as const,
      color: '#3CB371',
    },
  } as const;

  const renderThumbnail = () => {
    if (imageUrl) {
      return <Image source={{ uri: imageUrl }} style={styles.thumbnailImage} contentFit="cover" />;
    }

    if (isTextLite) return null;

    if (!icon) return null;

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

  const thumbnail = renderThumbnail();
  const meta = typeMeta[type];

  return (
    <GlassView style={styles.container} glassEffectStyle="regular">
      {thumbnail && (
        <View style={styles.thumbnailContainer}>
          {thumbnail}
        </View>
      )}
      <View style={styles.contentContainer}>
        <Text
          style={isTextLite ? styles.noteTitle : styles.title}
          numberOfLines={isNote ? 3 : 1}
        >
          {title}
        </Text>
        <View style={styles.metaContainer}>
           <View style={styles.metaLeft}>
             {!thumbnail && meta && (
               <View style={styles.typeBadge}>
                 {Platform.OS === 'ios' ? (
                   <SymbolView
                     name={meta.icon}
                     size={12}
                     tintColor={meta.color}
                     resizeMode="scaleAspectFit"
                   />
                 ) : (
                   <Ionicons name={meta.fallbackIcon} size={12} color={meta.color} />
                 )}
                 <Text style={styles.typeBadgeText}>{meta.label}</Text>
               </View>
             )}
             <Text style={styles.subtitle}>{subtitle}</Text>
           </View>
           {itemCount !== undefined && (
             <Text style={styles.itemCount}>{itemCount} items</Text>
           )}
        </View>
      </View>
    </GlassView>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.primary === '#FFFFFF'
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(0, 0, 0, 0.25)',
    // Add subtle shadow if needed, or flat border
    borderWidth: 1,
    borderColor: theme.colors.background.primary === '#FFFFFF'
      ? 'rgba(255, 255, 255, 0.45)'
      : 'rgba(255, 255, 255, 0.1)',
    ...theme.shadows.sm,
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
  noteTitle: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flexShrink: 1,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  typeBadgeText: {
    ...theme.typography.xs,
    color: theme.colors.text.secondary,
  },
  itemCount: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
  },
}));

export default HealthRecordCard;
