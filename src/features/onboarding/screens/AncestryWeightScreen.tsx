import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, View, TouchableOpacity, Text } from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OPTIONS = ['none', 'balanced', 'strong'] as const;
type InfluenceLevel = typeof OPTIONS[number];
const LABELS: Record<InfluenceLevel, string> = {
  none: 'None',
  balanced: 'Balanced',
  strong: 'Strong',
};

export default function AncestryWeightScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { updateData, nextStep, data } = useOnboarding();
  const [level, setLevel] = useState<InfluenceLevel>(
    (data.ancestryInfluence as InfluenceLevel) || 'balanced'
  );
  const insets = useSafeAreaInsets();
  const [trackWidth, setTrackWidth] = useState(0);
  const sliderX = useRef(new Animated.Value(0)).current;
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const currentLevelRef = useRef(level);

  const thumbSize = 36;
  const trackHeight = 18;
  const sliderRange = Math.max(0, trackWidth - thumbSize);

  useEffect(() => {
    const id = sliderX.addListener(({ value }) => {
      currentXRef.current = value;
    });
    return () => sliderX.removeListener(id);
  }, [sliderX]);

  useEffect(() => {
    currentLevelRef.current = level;
  }, [level]);

  useEffect(() => {
    if (!trackWidth) return;
    const index = OPTIONS.indexOf(level);
    const targetX = (sliderRange * index) / (OPTIONS.length - 1);
    sliderX.setValue(targetX);
  }, [level, sliderRange, sliderX, trackWidth]);

  const clamp = (value: number) => Math.min(Math.max(value, 0), sliderRange);

  const updateLevelFromX = (x: number) => {
    if (sliderRange === 0) return;
    const ratio = x / sliderRange;
    const index = Math.round(ratio * (OPTIONS.length - 1));
    const nextLevel = OPTIONS[index];
    if (nextLevel !== currentLevelRef.current) {
      currentLevelRef.current = nextLevel;
      setLevel(nextLevel);
    }
  };

  const snapToLevel = (nextLevel: InfluenceLevel) => {
    const index = OPTIONS.indexOf(nextLevel);
    const targetX = (sliderRange * index) / (OPTIONS.length - 1);
    Animated.spring(sliderX, {
      toValue: targetX,
      useNativeDriver: false,
      tension: 120,
      friction: 18,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const pressX = clamp(event.nativeEvent.locationX - thumbSize / 2);
          sliderX.setValue(pressX);
          updateLevelFromX(pressX);
          startXRef.current = pressX;
        },
        onPanResponderMove: (_, gesture) => {
          const nextX = clamp(startXRef.current + gesture.dx);
          sliderX.setValue(nextX);
          updateLevelFromX(nextX);
        },
        onPanResponderRelease: (_, gesture) => {
          const nextX = clamp(startXRef.current + gesture.dx);
          const ratio = sliderRange === 0 ? 0 : nextX / sliderRange;
          const index = Math.round(ratio * (OPTIONS.length - 1));
          const snappedLevel = OPTIONS[index];
          setLevel(snappedLevel);
          snapToLevel(snappedLevel);
        },
      }),
    [sliderRange, sliderX]
  );

  const fillWidth = useMemo(() => Animated.add(sliderX, thumbSize / 2), [sliderX, thumbSize]);

  const handleNext = () => {
    updateData({ ancestryInfluence: level });
    nextStep();
    router.push('/onboarding/allergies');
  };

  return (
    <View style={styles.container}>
        <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.prompt}>How much should this influence suggestions?</Text>
            
            <View style={styles.sliderContainer}>
                <View
                  style={[styles.trackWrapper, { height: thumbSize }]}
                  onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
                  {...panResponder.panHandlers}
                >
                  <View style={[styles.trackBase, { height: trackHeight, borderRadius: trackHeight / 2 }]} />
                  <Animated.View style={[styles.trackActive, { height: trackHeight, borderRadius: trackHeight / 2, width: fillWidth }]}>
                    <View style={[styles.trackActiveOverlay, { backgroundColor: theme.colors.text.primary }]} />
                    <GlassView style={styles.trackActiveGlass} glassEffectStyle="regular" />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.thumbContainer,
                      { width: thumbSize, height: thumbSize, borderRadius: thumbSize / 2, transform: [{ translateX: sliderX }] }
                    ]}
                    pointerEvents="none"
                  >
                    <GlassView style={styles.thumbGlass} glassEffectStyle="regular" />
                    <View style={[styles.thumbRing, { borderColor: theme.colors.border.subtle }]} />
                  </Animated.View>
                </View>
                <View style={styles.points}>
                    {OPTIONS.map((opt) => (
                        <TouchableOpacity 
                            key={opt}
                            style={styles.pointContainer} 
                            onPress={() => {
                              setLevel(opt);
                              snapToLevel(opt);
                            }}
                            activeOpacity={0.8}
                        >
                             <View style={[
                                 styles.point, 
                                 level === opt && styles.activePoint,
                                 level === opt && { backgroundColor: theme.colors.text.primary }
                             ]} />
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
    backgroundColor: theme.colors.border.subtle,
    opacity: 0.35,
  },
  trackActive: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  trackActiveOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.18,
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
  thumbRing: {
    position: 'absolute',
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  points: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  pointContainer: {
    alignItems: 'center',
    flex: 1,
  },
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.border.subtle,
    marginBottom: 12,
  },
  activePoint: {
    borderColor: theme.colors.text.primary,
    transform: [{ scale: 1.2 }],
  },
  label: {
    fontSize: 16,
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
