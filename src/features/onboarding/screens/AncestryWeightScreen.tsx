import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useDerivedValue,
  interpolateColor,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//
const OPTIONS = ['none', 'balanced', 'strong'] as const;
type InfluenceLevel = typeof OPTIONS[number];
const LABELS: Record<InfluenceLevel, string> = {
  none: 'None',
  balanced: 'Balanced',
  strong: 'Strong',
};

// --- TWEAK COLORS HERE ---
const SLIDER_CONFIG = {
  // Use light/pastel versions for a "lighter" look
  colors: ['#A8D5BA', '#BAE1FF'], // Light Forest Green to Soft Sky Blue
  stops: [0, 1], // You can add more colors/stops here if needed
  trackOpacity: 0.6,
  thumbTintOpacity: 0.25,
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function AncestryWeightScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [level, setLevel] = useState<InfluenceLevel>(
    (data.ancestryInfluence as InfluenceLevel) || 'balanced'
  );
  const insets = useSafeAreaInsets();
  const [trackWidth, setTrackWidth] = useState(0);

  const thumbSize = 36;
  const trackHeight = 18;
  
  const sliderX = useSharedValue(0);
  const thumbScale = useSharedValue(1);
  const contextX = useSharedValue(0);
  const gradientShift = useSharedValue(0);

  useEffect(() => {
    gradientShift.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.sin }),
      -1,
      true
    );
  }, []);

  // Sync initial level to slider position once we know the width
  useEffect(() => {
    if (trackWidth > 0) {
      const sliderRange = Math.max(0, trackWidth - thumbSize);
      const index = OPTIONS.indexOf(level);
      const targetX = (sliderRange * index) / (OPTIONS.length - 1);
      sliderX.value = withSpring(targetX, { damping: 20, stiffness: 150 });
    }
  }, [trackWidth, level, thumbSize]);

  const updateLevel = (newLevel: InfluenceLevel) => {
    setLevel(newLevel);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = sliderX.value;
      thumbScale.value = withSpring(1.5);
    })
    .onUpdate((e) => {
      const sliderRange = Math.max(0, trackWidth - thumbSize);
      if (sliderRange === 0) return;

      let nextX = contextX.value + e.translationX;
      // Clamp
      if (nextX < 0) nextX = 0;
      if (nextX > sliderRange) nextX = sliderRange;

      sliderX.value = nextX;

      const ratio = nextX / sliderRange;
      const index = Math.round(ratio * (OPTIONS.length - 1));
      // const nextLevel = OPTIONS[index];
    })
    .onEnd(() => {
      const sliderRange = Math.max(0, trackWidth - thumbSize);
      thumbScale.value = withSpring(1);

      if (sliderRange > 0) {
        const ratio = sliderX.value / sliderRange;
        const index = Math.round(ratio * (OPTIONS.length - 1));
        const snappedLevel = OPTIONS[index];
        const targetX = (sliderRange * index) / (OPTIONS.length - 1);

        sliderX.value = withSpring(targetX, { damping: 20, stiffness: 150 });
        runOnJS(updateLevel)(snappedLevel);
      }
    });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: sliderX.value },
        { scale: thumbScale.value },
      ],
    };
  });

  const thumbTintStyle = useAnimatedStyle(() => {
    const sliderRange = Math.max(0, trackWidth - thumbSize);
    const backgroundColor = interpolateColor(
      sliderX.value,
      [0, sliderRange],
      SLIDER_CONFIG.colors
    );
    return {
      backgroundColor,
    };
  });

  const activeTrackAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: sliderX.value + thumbSize / 2,
    };
  });

  const gradientAnimatedProps = useAnimatedProps(() => {
      const shift = gradientShift.value * 0.2;
      return {
          start: { x: 0 - shift, y: 0 },
          end: { x: 1 + shift, y: 0 }
      };
  });

  const handleNext = () => {
    updateData({ ancestryInfluence: level });
    nextStep();
    router.push('/onboarding/allergies');
  };

  const handlePointPress = (opt: InfluenceLevel) => {
    setLevel(opt);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <Text style={styles.prompt}>How much should this influence suggestions?</Text>

        <View style={styles.sliderContainer}>
          <GestureDetector gesture={panGesture}>
            <View
              style={[styles.trackWrapper, { height: thumbSize }]}
              onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
            >
              {/* Background Track (Glass) */}
              <View style={[styles.trackBase, { height: trackHeight, borderRadius: trackHeight / 2 }]}>
                 <GlassView style={styles.glassBase} glassEffectStyle="regular" />
                 <View style={styles.glassBaseOverlay} />
                {/* Points on the bar */}
                {trackWidth > 0 && OPTIONS.map((opt, i) => {
                  const pct = i / (OPTIONS.length - 1);
                  const thumbCenterRange = trackWidth - thumbSize;
                  const left = (thumbSize / 2) + (pct * thumbCenterRange);

                  return (
                    <View
                      key={opt}
                      style={[
                        styles.trackPoint,
                        { left: left - 2 }
                      ]}
                    />
                  );
                })}
              </View>

              {/* Active Track (Animated Width & Gradient) */}
              <Animated.View
                style={[
                  styles.trackActive,
                  { height: trackHeight, borderRadius: trackHeight / 2 },
                  activeTrackAnimatedStyle,
                ]}
              >
                <AnimatedLinearGradient
                  colors={SLIDER_CONFIG.colors}
                  locations={SLIDER_CONFIG.stops}
                  animatedProps={gradientAnimatedProps}
                  style={{ width: trackWidth, height: '100%', opacity: SLIDER_CONFIG.trackOpacity }}
                />
              </Animated.View>

              {/* Thumb (Animated Position & Scale) */}
              <Animated.View
                style={[
                  styles.thumbContainer,
                  {
                    width: thumbSize,
                    height: thumbSize,
                    borderRadius: thumbSize / 2,
                  },
                  thumbAnimatedStyle,
                ]}
              >
                <GlassView style={styles.thumbGlass} glassEffectStyle="regular" />
                {/* Thumb Tint Layer */}
                <Animated.View style={[styles.thumbTint, thumbTintStyle, { opacity: SLIDER_CONFIG.thumbTintOpacity }]} />
                <View style={[styles.thumbRing, { borderColor: theme.colors.border.subtle }]} />
              </Animated.View>
            </View>
          </GestureDetector>

          <View style={styles.labelsContainer}>
            {OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.labelWrapper}
                onPress={() => handlePointPress(opt)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.label,
                  level === opt && styles.activeLabel
                ]}>{LABELS[opt]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Next</Text>
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
  content: {
    flex: 1,
  },
  prompt: {
    ...theme.typography.display,
    fontSize: 32,
    color: theme.colors.text.primary,
    marginBottom: 60,
  },
  sliderContainer: {
    marginTop: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  trackWrapper: {
    justifyContent: 'center',
  },
  trackBase: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: theme.colors.border.subtle, // Fallback
  },
  glassBase: {
      flex: 1,
  },
  glassBaseOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.background.primary,
      opacity: 0.1,
  },
  trackPoint: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.text.muted,
    opacity: 0.5,
    height: 8,
    top: 5,
  },
  trackActive: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  trackActiveGlass: {
    flex: 1,
  },
  thumbContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  thumbGlass: {
    flex: 1,
  },
  thumbTint: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.3, // Subtle tint
  },
  thumbRing: {
    position: 'absolute',
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  labelWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
  activeLabel: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  footer: {
    paddingTop: 20,
  },
  button: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.background.primary,
    fontSize: 18,
    fontWeight: '600',
  },
}));
