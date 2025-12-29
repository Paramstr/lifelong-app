import React, { useState, useEffect } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { FeatureCard } from './FeatureCard';
import { ROADMAP_DATA } from '../data/beta-data';

export const RoadmapSection = () => {
  const [layout, setLayout] = useState<{height: number, width: number} | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Roadmap</Text>
      
      <View 
        style={styles.roadmapContainer} 
        onLayout={(e) => setLayout(e.nativeEvent.layout)}
      >
        {/* SVG Timeline Layer */}
        {layout && (
          <View style={[styles.svgLayer, { height: layout.height, width: 40 }]}>
            <Svg height="100%" width="100%">
              {/* Main vertical line */}
              <Line
                x1="20"
                y1="20"
                x2="20"
                y2={layout.height - 20}
                stroke="#888"
                strokeWidth="2"
                strokeDasharray="6, 6"
                strokeOpacity={0.3}
              />
            </Svg>
          </View>
        )}

        {/* Content Layer */}
        {ROADMAP_DATA.map((version, index) => {
          const isLast = index === ROADMAP_DATA.length - 1;
          const isCurrent = version.status === 'current';
          
          return (
            <View key={version.id} style={styles.versionRow}>
              {/* Timeline Node */}
              <View style={styles.timelineNodeContainer}>
                <View style={[
                  styles.timelineNode, 
                  isCurrent ? styles.activeNode : styles.inactiveNode
                ]}>
                  {isCurrent && <View style={styles.activeNodeInner} />}
                </View>
              </View>

              {/* Version Content */}
              <View style={[styles.versionContent, isLast && styles.lastContent]}>
                <View style={styles.versionHeader}>
                  <Text style={[styles.versionTitle, !isCurrent && styles.greyText]}>
                    {version.version}
                  </Text>
                  {version.title && (
                    <Text style={[styles.versionSubtitle, !isCurrent && styles.greyText]}>
                      • {version.title}
                    </Text>
                  )}
                </View>

                <View style={styles.grid}>
                  {version.features.map((feature) => (
                    <View key={feature.id} style={styles.gridItem}>
                      <FeatureCard
                        {...feature}
                        isGreyedOut={!isCurrent}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    marginTop: theme.spacing.xl,
  },
  headerTitle: {
    ...theme.typography.headline,
    fontSize: 22,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  roadmapContainer: {
    position: 'relative',
  },
  svgLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
  },
  versionRow: {
    flexDirection: 'row',
  },
  timelineNodeContainer: {
    width: 40,
    alignItems: 'center',
    paddingTop: 4, 
  },
  timelineNode: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  activeNode: {
    borderColor: theme.colors.text.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  activeNodeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.text.primary,
  },
  inactiveNode: {
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.background.secondary, // muted fill
  },
  versionContent: {
    flex: 1,
    paddingBottom: theme.spacing.xl,
    paddingLeft: theme.spacing.xs,
  },
  lastContent: {
    paddingBottom: 0,
  },
  versionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  versionTitle: {
    ...theme.typography.headline,
    fontSize: 18,
    color: theme.colors.text.primary,
  },
  versionSubtitle: {
    ...theme.typography.body,
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  greyText: {
    color: theme.colors.text.muted,
  },
  grid: {
    flexDirection: 'column', // Changed from row to column
    gap: theme.spacing.sm,
  },
  gridItem: {
    width: '100%', // Changed from 48% to 100%
  },
}));