import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { type FC, type ReactNode, useMemo } from 'react';
import { Platform, StyleSheet, type ViewStyle, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { easeGradient } from '@/utils/ease-gradient';

type Range = [number, number];

/**
 * Props for the ProgressiveBlurHeader component.
 */
type Props = {
  /** The shared value for vertical scroll position (from Reanimated). */
  scrollY: SharedValue<number>;
  /** The total height of the header component. */
  height: number;
  /** Top inset (safe area), usually `insets.top`. */
  insetsTop?: number;
  /** 
   * The maximum blur intensity to apply when fully scrolled. 
   * Default: 75. 
   */
  blurMaxIntensity?: number;
  /** 
   * The scroll range [start, end] over which the blur intensity increases from 0 to `blurMaxIntensity`.
   * Default: [0, 160].
   */
  blurRange?: Range;
  /** 
   * The scroll range [start, end] over which the background opacity transitions from 0 to 1. 
   * Default: [0, 100].
   */
  backgroundRange?: Range;
  /** 
   * The scroll range [start, end] for the "travel" (parallax) effect. 
   * This determines when the `travelTranslateY` movement happens.
   * Default: [0, 160].
   */
  travelRange?: Range;
  /** 
   * The vertical translation range [start, end] applied to the background during the `travelRange`.
   * Use this to create a subtle "slide down" effect as the header appears.
   * Default: [0, 24].
   */
  travelTranslateY?: Range;
  /** 
   * The scroll range [start, end] over which the header content (children) fades in and slides up. 
   * Default: [45, 95].
   */
  contentRange?: Range;
  /** 
   * The background color of the header when fully opaque. 
   * Defaults to the theme's primary background color if not provided.
   */
  backgroundColor?: string;
  /** 
   * Whether to enable the blur effect. 
   * Default: true. 
   */
  enableBlur?: boolean;
  /** Custom styles for the content container. */
  contentStyle?: ViewStyle;
  /** 
   * The tint of the blur effect. 
   * Common values: 'light', 'dark', 'extraLight', 'regular', 'prominent'.
   * On iOS, you can also use 'systemMaterial', 'systemChromeMaterialLight', etc.
   * Default: 'systemChromeMaterialLight' on iOS, 'light' on Android.
   */
  blurTint?: 'light' | 'dark' | 'extraLight' | 'regular' | 'prominent' | 'systemMaterial' | 'systemChromeMaterial' | 'systemMaterialLight' | 'systemMaterialDark' | 'systemChromeMaterialLight' | 'systemChromeMaterialDark';
  /**
   * Custom tint colors for the glass effect gradient.
   * Pass an array of color strings (e.g. `['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']`).
   * Default: `['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.3)']`.
   */
  tintColors?: readonly [string, string, ...string[]];
  /**
   * Custom gradient stops for the mask. 
   * Controls where the blur/background is opaque vs transparent.
   * Format: { location: number, opacity: number }[]
   * Default: Starts fading out at 0.8.
   */
  maskStops?: { location: number; opacity: number }[];
  children?: ReactNode;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * A header component that progressively reveals a blurred, glass-morphism background 
 * as the user scrolls. It supports smooth parallax transitions, opacity changes, 
 * and configurable blur intensity.
 */
export const ProgressiveBlurHeader: FC<Props> = ({
  scrollY,
  height,
  insetsTop = 0,
  blurMaxIntensity = 75,
  blurRange = [0, 160],
  backgroundRange = [0, 100],
  travelRange = [0, 160],
  travelTranslateY = [0, 24],
  contentRange = [45, 95],
  backgroundColor,
  enableBlur = true,
  contentStyle,
  blurTint,
  tintColors,
  maskStops,
  children,
}) => {
  const { theme } = useUnistyles();
  const resolvedBackground = backgroundColor ?? theme.colors.background.primary;

  const { colors, locations } = useMemo(() => {
    const stops = maskStops ?? [
      { location: 0, opacity: 1 },
      { location: 0.8, opacity: 1 },
      { location: 1, opacity: 0 },
    ];
    
    const colorStops: Record<number, { color: string }> = {};
    stops.forEach(stop => {
      // Use black with varying alpha for the mask (black = visible, transparent = hidden)
      // Note: We use 'black' as the base color because MaskedView uses alpha channel
      colorStops[stop.location] = { 
        color: stop.opacity === 1 ? 'black' : `rgba(0,0,0,${stop.opacity})` 
      };
    });

    return easeGradient({ colorStops });
  }, [maskStops]);

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, backgroundRange, [0, 1], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          travelRange,
          travelTranslateY,
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, contentRange, [0, 1], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, contentRange, [10, 0], Extrapolate.CLAMP),
      },
    ],
  }));

  const animatedBlurProps = useAnimatedProps(() => ({
    intensity: interpolate(scrollY.value, blurRange, [0, blurMaxIntensity], Extrapolate.CLAMP),
  }));

  const resolvedBlurTint = blurTint ?? (Platform.OS === 'ios' ? 'systemChromeMaterialLight' : 'light');

  return (
    <View style={[styles.container, { height }]} pointerEvents="box-none">
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          { top: -100, height: height + 100 }, // Extend upwards to cover safe area gap
          backgroundAnimatedStyle
        ]} 
        pointerEvents="none"
      >
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <LinearGradient
              colors={colors}
              locations={locations}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <LinearGradient
            colors={tintColors ?? ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.3)']}
            style={StyleSheet.absoluteFill}
          />
          {enableBlur ? (
            <AnimatedBlurView
              animatedProps={animatedBlurProps}
              tint={resolvedBlurTint}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
        </MaskedView>
      </Animated.View>
      {children ? (
        <Animated.View
          style={[
            styles.content,
            { paddingTop: insetsTop },
            contentStyle,
            contentAnimatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
