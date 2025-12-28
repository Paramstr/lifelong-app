import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, LayoutChangeEvent, ViewStyle, StyleProp, StyleSheet as RNStyleSheet } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

interface DebugLayoutProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  label?: string;
  showDimensions?: boolean;
}

const pickStyle = (obj: any, keys: string[]) => {
  const result: any = {};
  keys.forEach(key => {
    if (obj && obj[key] !== undefined) result[key] = obj[key];
  });
  return Object.keys(result).length > 0 ? result : null;
};

/**
 * A wrapper component for visual debugging.
 * Applies the theme's debug style (dashed border, background)
 * and overlays the component's dimensions (width x height).
 * 
 * Also logs detailed layout metrics (margin, padding, flex) to the console.
 */
const DebugLayoutSingle = ({
  children,
  style,
  label = 'Component',
  showDimensions = false,
}: DebugLayoutProps) => {
  const [layout, setLayout] = useState<{ width: number; height: number } | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const onlyChild = useMemo(() => {
    if (React.Children.count(children) !== 1) return null;
    const child = React.Children.only(children);
    return React.isValidElement(child) ? child : null;
  }, [children]);

  const childFlatStyle = useMemo(() => {
    if (!onlyChild) return null;
    return RNStyleSheet.flatten((onlyChild as any).props?.style) || {};
  }, [onlyChild]);

  const flatStyle = useMemo(() => RNStyleSheet.flatten(style) || {}, [style]);

  const spacingSource = childFlatStyle || flatStyle;

  const resolvedSpacing = useMemo(() => {
    const marginTop = spacingSource.marginTop ?? spacingSource.marginVertical ?? spacingSource.margin ?? 0;
    const marginBottom = spacingSource.marginBottom ?? spacingSource.marginVertical ?? spacingSource.margin ?? 0;
    const marginLeft = spacingSource.marginLeft ?? spacingSource.marginHorizontal ?? spacingSource.margin ?? 0;
    const marginRight = spacingSource.marginRight ?? spacingSource.marginHorizontal ?? spacingSource.margin ?? 0;

    const paddingTop = spacingSource.paddingTop ?? spacingSource.paddingVertical ?? spacingSource.padding ?? 0;
    const paddingBottom = spacingSource.paddingBottom ?? spacingSource.paddingVertical ?? spacingSource.padding ?? 0;
    const paddingLeft = spacingSource.paddingLeft ?? spacingSource.paddingHorizontal ?? spacingSource.padding ?? 0;
    const paddingRight = spacingSource.paddingRight ?? spacingSource.paddingHorizontal ?? spacingSource.padding ?? 0;

    return {
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
    };
  }, [spacingSource]);

  const childMarginStyle = useMemo(() => {
    if (!childFlatStyle) return null;
    return pickStyle(childFlatStyle, [
      'margin',
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight',
      'marginHorizontal',
      'marginVertical',
    ]);
  }, [childFlatStyle]);

  const childStyleWithoutMargin = useMemo(() => {
    if (!childFlatStyle) return null;
    const {
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginHorizontal,
      marginVertical,
      ...rest
    } = childFlatStyle as any;
    return rest;
  }, [childFlatStyle]);

  const renderedChildren = useMemo(() => {
    if (!onlyChild || !childFlatStyle) return children;
    return React.cloneElement(onlyChild as React.ReactElement<any>, {
      style: childStyleWithoutMargin,
    });
  }, [onlyChild, childFlatStyle, childStyleWithoutMargin, children]);

  useEffect(() => {
    if (!layout) return;
    
    // Attempt to get source file info from children (React Native dev mode often adds this)
    const modeTag = 'multi';
    let sourceLabel = label === 'Component' ? modeTag : `${label} (${modeTag})`;
    if (label === 'Component' && React.isValidElement(children)) {
      const source = (children as any)._source;
      if (source && source.fileName) {
        const fileName = source.fileName.split('/').pop();
        sourceLabel = `${fileName}:${source.lineNumber} (${modeTag})`;
      }
    }

    const dims = `${Math.round(layout.width)}x${Math.round(layout.height)}`;
    
    const spacing = {
      mg: pickStyle(spacingSource, ['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginHorizontal', 'marginVertical']),
      pd: pickStyle(spacingSource, ['padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingHorizontal', 'paddingVertical']),
    };
    
    const flex = pickStyle(spacingSource, ['flex', 'flexGrow', 'flexShrink', 'flexDirection', 'justifyContent', 'alignItems', 'alignSelf', 'gap']);
    
    // Construct a compact log line
    const parts = [`[DebugUI] ${sourceLabel}`, `Size: ${dims}`];
    
    if (spacing.mg) parts.push(`Mg: ${JSON.stringify(spacing.mg)}`);
    if (spacing.pd) parts.push(`Pd: ${JSON.stringify(spacing.pd)}`);
    if (flex) parts.push(`Flex: ${JSON.stringify(flex)}`);

    parts.push(
      `Resolved Mg: ${JSON.stringify({
        top: resolvedSpacing.marginTop,
        right: resolvedSpacing.marginRight,
        bottom: resolvedSpacing.marginBottom,
        left: resolvedSpacing.marginLeft,
      })}`,
    );
    parts.push(
      `Resolved Pd: ${JSON.stringify({
        top: resolvedSpacing.paddingTop,
        right: resolvedSpacing.paddingRight,
        bottom: resolvedSpacing.paddingBottom,
        left: resolvedSpacing.paddingLeft,
      })}`,
    );
    
    console.log(parts.join(' · '));

  }, [layout, spacingSource, resolvedSpacing, label, children]);

  // Extract spacing for visual overlays
  const {
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  } = resolvedSpacing;

  return (
    <View
      style={[styles.container, style, childMarginStyle]}
      onLayout={onLayout}
    >
      {renderedChildren}
      {layout && (
        <View style={styles.overlay} pointerEvents="none">
          {/* Visual Padding (Red) */}
          <View style={[styles.paddingOverlay, { height: paddingTop as number, top: 0, left: 0, right: 0 }]} />
          <View style={[styles.paddingOverlay, { height: paddingBottom as number, bottom: 0, left: 0, right: 0 }]} />
          <View style={[styles.paddingOverlay, { width: paddingLeft as number, top: 0, bottom: 0, left: 0 }]} />
          <View style={[styles.paddingOverlay, { width: paddingRight as number, top: 0, bottom: 0, right: 0 }]} />

          {/* Visual Margin (Green) - rendered outside */}
          <View style={[styles.marginOverlay, { height: marginTop as number, top: -(marginTop as number), left: 0, right: 0 }]} />
          <View style={[styles.marginOverlay, { height: marginBottom as number, bottom: -(marginBottom as number), left: 0, right: 0 }]} />
          <View style={[styles.marginOverlay, { width: marginLeft as number, top: 0, bottom: 0, left: -(marginLeft as number) }]} />
          <View style={[styles.marginOverlay, { width: marginRight as number, top: 0, bottom: 0, right: -(marginRight as number) }]} />

          {showDimensions && (
            <View style={[styles.labelContainer, { top: paddingTop as number, transform: [{ translateY: 0 }] }]}>
              <Text style={styles.labelText}>
                {label && label !== 'Component' ? `${label}: ` : ''}{Math.round(layout.width)} x {Math.round(layout.height)}
              </Text>
            </View>
          )}
          {/* Corner markers for precise boundary checking */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      )}
    </View>
  );
};

export const DebugLayout = (props: DebugLayoutProps) => {
  const { children } = props;
  const childCount = React.Children.count(children);

  if (childCount <= 1) {
    return <DebugLayoutSingle {...props} />;
  }

  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <DebugLayoutSingle key={(child as any).key ?? index} {...props}>
            {child}
          </DebugLayoutSingle>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    ...theme.debug,
    position: 'relative',
    // overflowing visible is needed to show margins outside
    overflow: 'visible',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  paddingOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.18)', // Red for Padding
    zIndex: 1,
  },
  marginOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 255, 0, 0.25)', // Green for Margin
    zIndex: 1,
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    opacity: 0.85,
    zIndex: 10,
    alignSelf: 'center',
  },
  labelText: {
    color: theme.colors.text.inverse,
    fontSize: 10,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  corner: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderColor: theme.colors.brand.primary,
  },
  topLeft: {
    top: -1,
    left: -1,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: -1,
    right: -1,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
}));
