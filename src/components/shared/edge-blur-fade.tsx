import { BlurView, BlurViewProps } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colorKit } from 'reanimated-color-picker';
import MaskedView from '@react-native-masked-view/masked-view';

import { easeGradient } from '@/utils/ease-gradient';

type FadeStop = {
  location: number;
  opacity: number;
};

type Props = {
  position?: 'top' | 'bottom';
  height?: number;
  blurIntensity?: number;
  fadeColor?: string;
  fadeStart?: number;
  fadeEnd?: number;
  fadeFromOpacity?: number;
  fadeToOpacity?: number;
  fadeStops?: FadeStop[];
  progressiveBlur?: boolean;
  blurStart?: number;
  blurEnd?: number;
  style?: ViewStyle;
  blurViewProps?: BlurViewProps;
};

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
      {progressiveBlur ? (
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
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={blurViewProps?.intensity ?? blurIntensity}
            {...blurViewProps}
          />
        </MaskedView>
      ) : (
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={blurViewProps?.intensity ?? blurIntensity}
          {...blurViewProps}
        />
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
