import { BlurView, BlurViewProps } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colorKit } from 'reanimated-color-picker';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, { type SharedValue, useAnimatedProps } from 'react-native-reanimated';

import { easeGradient } from '@/utils/ease-gradient';

type FadeStop = {
  location: number;
  opacity: number;
};

/**
 * Props for the EdgeBlurFade component.
 */
type Props = {
  /** 
   * The position of the blur fade. 
   * 'top' places it at the top of the container, 'bottom' at the bottom.
   * Default: 'top'.
   */
  position?: 'top' | 'bottom';
  /** 
   * The height of the fade area. 
   * Default: 100.
   */
  height?: number;
  /** 
   * The intensity of the blur. Can be a number or a Reanimated shared value.
   * Default: 24.
   */
  blurIntensity?: number | SharedValue<number>;
  /** 
   * The color to fade into (usually the background color). 
   * Default: '#FFFFFF'.
   */
  fadeColor?: string;
  /** 
   * The relative start position (0-1) of the solid fade color.
   * Default: 0 for top, 0.15 for bottom.
   */
  fadeStart?: number;
  /** 
   * The relative end position (0-1) where the fade becomes transparent.
   * Default: 0.85 for top, 1 for bottom.
   */
  fadeEnd?: number;
  /** 
   * The starting opacity of the fade color.
   * Default: 0.9.
   */
  fadeFromOpacity?: number;
  /** 
   * The ending opacity of the fade color.
   * Default: 0.
   */
  fadeToOpacity?: number;
  /** 
   * Custom stops for the fade gradient. If provided, overrides start/end/opacity props.
   */
  fadeStops?: FadeStop[];
  /** 
   * Whether to mask the blur so it fades out as well.
   * Default: true.
   */
  progressiveBlur?: boolean;
  /** 
   * The relative start position (0-1) of the blur mask.
   * Default: 0 for top, 0.2 for bottom.
   */
  blurStart?: number;
  /** 
   * The relative end position (0-1) of the blur mask.
   * Default: 0.8 for top, 1 for bottom.
   */
  blurEnd?: number;
  /** Custom container styles. */
  style?: ViewStyle;
  /** Additional props to pass to the underlying BlurView. */
  blurViewProps?: BlurViewProps;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * A component that creates a smooth fade-out effect at the edge of a scroll view 
 * or container. It combines a gradient fade (color) with a progressive blur, 
 * helping content disappear naturally.
 */
export const EdgeBlurFade: FC<Props> = ({
  position = 'top',
  height = 100,
  blurIntensity = 24,
  fadeColor = '#FFFFFF',
  fadeStart,
  fadeEnd,
  fadeFromOpacity,
  fadeToOpacity,
  fadeStops,
  progressiveBlur = true,
  blurStart,
  blurEnd,
  style,
  blurViewProps,
}) => {
  const resolvedFadeStart = fadeStart ?? (position === 'top' ? 0 : 0.15);
  const resolvedFadeEnd = fadeEnd ?? (position === 'top' ? 0.85 : 1);
  const resolvedFadeFromOpacity = fadeFromOpacity ?? 0.9;
  const resolvedFadeToOpacity = fadeToOpacity ?? 0;
  const resolvedBlurStart = blurStart ?? (position === 'top' ? 0 : 0.2);
  const resolvedBlurEnd = blurEnd ?? (position === 'top' ? 0.8 : 1);

  const { colors, locations } = useMemo(() => {
    const defaultStops: FadeStop[] =
      position === 'top'
        ? [
            { location: resolvedFadeStart, opacity: resolvedFadeFromOpacity },
            { location: resolvedFadeEnd, opacity: resolvedFadeToOpacity },
          ]
        : [
            { location: resolvedFadeStart, opacity: resolvedFadeToOpacity },
            { location: resolvedFadeEnd, opacity: resolvedFadeFromOpacity },
          ];

    const resolvedStops = fadeStops?.length ? fadeStops : defaultStops;
    const colorStops: Record<number, { color: string }> = {};

    resolvedStops.forEach(stop => {
      colorStops[stop.location] = {
        color: colorKit.setAlpha(fadeColor, stop.opacity).hex(),
      };
    });

    return easeGradient({ colorStops });
  }, [
    fadeColor,
    fadeStops,
    position,
    resolvedFadeEnd,
    resolvedFadeFromOpacity,
    resolvedFadeStart,
    resolvedFadeToOpacity,
  ]);

  const { blurMaskColors, blurMaskLocations } = useMemo(() => {
    if (position === 'top') {
      return {
        blurMaskColors: ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
        blurMaskLocations: [0, resolvedBlurStart, resolvedBlurEnd],
      };
    }

    return {
      blurMaskColors: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)'],
      blurMaskLocations: [resolvedBlurStart, resolvedBlurEnd, 1],
    };
  }, [position, resolvedBlurEnd, resolvedBlurStart]);

  const isAnimatedIntensity =
    typeof blurIntensity === 'object' &&
    blurIntensity !== null &&
    'value' in blurIntensity;
  const resolvedIntensity = isAnimatedIntensity ? 0 : blurIntensity;
  const hasBlur = isAnimatedIntensity || resolvedIntensity > 0;

  const { intensity: _ignoredIntensity, ...restBlurProps } = blurViewProps ?? {};
  const animatedBlurProps = useAnimatedProps(() => ({
    intensity: isAnimatedIntensity ? blurIntensity.value : resolvedIntensity,
  }));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        position === 'top' ? styles.top : styles.bottom,
        { height },
        style,
      ]}
    >
      {hasBlur && (
        progressiveBlur ? (
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={
              <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={blurMaskColors}
                locations={blurMaskLocations}
              />
            }
          >
            <AnimatedBlurView
              style={StyleSheet.absoluteFill}
              animatedProps={animatedBlurProps}
              {...restBlurProps}
            />
          </MaskedView>
        ) : (
          <AnimatedBlurView
            style={StyleSheet.absoluteFill}
            animatedProps={animatedBlurProps}
            {...restBlurProps}
          />
        )
      )}
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={colors}
        locations={locations}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});
