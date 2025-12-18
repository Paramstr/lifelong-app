import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import StartTimerButton from '@/components/opal/start-timer-button';

type TimerStep = {
  id: number;
  value: number;
};

const MINUTES: TimerStep[] = Array.from({ length: 13 }, (_, index) => ({
  id: index * 5,
  value: index * 5,
}));

const HOURS: TimerStep[] = Array.from({ length: 23 }, (_, index) => ({
  id: (index + 2) * 60,
  value: (index + 2) * 60,
}));

const TIMER_DATA: TimerStep[] = [...MINUTES, ...HOURS];
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH * 0.71;
const SLIDER_HEIGHT = 40;
const STEPPER_BUTTON_SIZE = 40;
const STEPPER_CENTER_WIDTH = SCREEN_WIDTH * 0.22;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 60,
        },
      ]}
    >
      <View style={styles.timerArea}>
        <SetTimer />
      </View>
      <StartTimerButton />
    </View>
  );
};

const SetTimer = () => {
  const value = useSharedValue<number>(5);
  const [displayValue, setDisplayValue] = useState('5m');
  const presentationState = useSharedValue(0);

  useAnimatedReaction(
    () => value.get(),
    (val) => {
      const text = val < 60 ? `${val}m` : `${Math.floor(val / 60)}h`;
      runOnJS(setDisplayValue)(text);
    },
    []
  );

  const togglePresentation = () => {
    const target = presentationState.get() === 0 ? 1 : 0;
    presentationState.set(withTiming(target, { duration: 180 }));
  };

  const sliderAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(presentationState.get(), [0.8, 1], [0, 1], Extrapolation.CLAMP);
    const scale = withSpring(interpolate(presentationState.get(), [0, 1], [0.75, 1], Extrapolation.CLAMP), {
      damping: 90,
      stiffness: 1200,
    });

    return {
      opacity,
      pointerEvents: opacity === 1 ? 'auto' : 'none',
      transform: [{ scale }],
    };
  });

  const blockAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(presentationState.get(), [0, 1], [1, 0]);
    const scale = withSpring(interpolate(presentationState.get(), [0, 1], [1, 0.85]), {
      damping: 90,
      stiffness: 1200,
    });
    return {
      opacity,
      pointerEvents: opacity === 1 ? 'auto' : 'none',
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.setTimerRow}>
      <Stepper
        data={TIMER_DATA}
        value={value}
        displayValue={displayValue}
        onTogglePresentation={togglePresentation}
        presentationState={presentationState}
      />
      <Animated.View style={[styles.flexOne, blockAnimatedStyle]}>
        <BlockButton />
      </Animated.View>
      <Animated.View style={[styles.sliderContainer, sliderAnimatedStyle]}>
        <Slider data={TIMER_DATA} value={value} presentationState={presentationState} />
      </Animated.View>
    </View>
  );
};

type StepperProps = {
  data: TimerStep[];
  value: SharedValue<number>;
  displayValue: string;
  onTogglePresentation: () => void;
  presentationState: SharedValue<number>;
};

const Stepper = ({ data, value, displayValue, onTogglePresentation, presentationState }: StepperProps) => {
  const pressScale = useSharedValue(1);

  const stepperOpacityStyle = useAnimatedStyle(() => ({
    opacity: 1 - presentationState.get(),
  }));

  const centerButtonStyle = useAnimatedStyle(() => {
    const translateX = withSpring(-presentationState.get() * (STEPPER_BUTTON_SIZE + 6), {
      damping: 90,
      stiffness: 1400,
    });

    return {
      transform: [{ translateX }, { scale: pressScale.get() }],
    };
  });

  const updateValue = (direction: 'inc' | 'dec') => {
    const currentIndex = data.findIndex((item) => item.value === value.get());
    if (currentIndex === -1) return;
    const nextIndex = direction === 'inc' ? Math.min(currentIndex + 1, data.length - 1) : Math.max(currentIndex - 1, 0);
    value.set(data[nextIndex].value);
  };

  return (
    <View style={styles.stepperRow}>
      <Animated.View style={stepperOpacityStyle}>
        <Pressable
          onPress={() => updateValue('dec')}
          style={[styles.stepperButton, Platform.OS === 'android' && styles.stepperAndroidBg]}
        >
          <Ionicons name="remove" size={16} color="white" />
        </Pressable>
      </Animated.View>
      <Animated.View style={centerButtonStyle}>
        <Pressable
          onPressIn={() => {
            pressScale.set(withTiming(0.95, { duration: 100 }));
          }}
          onPressOut={() => {
            pressScale.set(withTiming(1, { duration: 120 }));
            onTogglePresentation();
          }}
          style={styles.stepperCenter}
        >
          <Text style={styles.stepperCenterText}>{displayValue}</Text>
        </Pressable>
      </Animated.View>
      <Animated.View style={stepperOpacityStyle}>
        <Pressable
          onPress={() => updateValue('inc')}
          style={[styles.stepperButton, Platform.OS === 'android' && styles.stepperAndroidBg]}
        >
          <Ionicons name="add" size={16} color="white" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

type SliderProps = {
  data: TimerStep[];
  value: SharedValue<number>;
  presentationState: SharedValue<number>;
};

const Slider = ({ data, value, presentationState }: SliderProps) => {
  const totalSteps = data.length;
  const stepWidth = SLIDER_WIDTH / totalSteps;
  const progress = useSharedValue(stepWidth);
  const lastStep = useSharedValue(1);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((event) => {
          const tapIndex = Math.ceil(event.x / stepWidth);
          const clamped = Math.max(1, Math.min(tapIndex, totalSteps - 1));
          progress.set(clamped === totalSteps - 1 ? SLIDER_WIDTH : clamped * stepWidth);
          value.set(data[clamped].value);
          lastStep.set(clamped);
        })
        .onChange((event) => {
          const tapIndex = Math.ceil(event.x / stepWidth);
          const clamped = Math.max(1, Math.min(tapIndex, totalSteps - 1));
          if (clamped === lastStep.get()) return;
          lastStep.set(clamped);
          progress.set(clamped === totalSteps - 1 ? SLIDER_WIDTH : clamped * stepWidth);
          value.set(data[clamped].value);
        }),
    [data, progress, stepWidth, totalSteps, value]
  );

  useAnimatedReaction(
    () => value.get(),
    (val) => {
      if (presentationState.get() === 1) return;
      const idx = data.findIndex((item) => item.value === val);
      if (idx === -1) return;
      const clamped = Math.max(1, Math.min(idx, totalSteps - 1));
      const width = clamped === totalSteps - 1 ? SLIDER_WIDTH : clamped * stepWidth;
      progress.set(width);
      lastStep.set(clamped);
    },
    [data, stepWidth, totalSteps]
  );

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(progress.get(), { damping: 140, stiffness: 1600 }),
  }));

  return (
    <RubberContainer width={SLIDER_WIDTH} height={SLIDER_HEIGHT} gesture={gesture}>
      <View style={styles.sliderBody}>
        <View style={styles.sliderMarksRow}>
          {data.map((item, index) => (
            <View key={item.id} style={[styles.sliderMarkContainer, { width: stepWidth }]}>
              <View
                style={[
                  styles.sliderMark,
                  index === 0 && styles.sliderMarkHidden,
                  index % 2 === 0 ? styles.sliderMarkTall : styles.sliderMarkShort,
                ]}
              />
            </View>
          ))}
        </View>
        <Animated.View style={[styles.sliderProgress, progressStyle]} />
      </View>
    </RubberContainer>
  );
};

type RubberContainerProps = {
  width: number;
  height: number;
  gesture: ReturnType<typeof Gesture.Pan>;
  children: React.ReactNode;
};

const RubberContainer = ({ width, height, gesture, children }: RubberContainerProps) => {
  const isActive = useSharedValue(false);
  const lastX = useSharedValue(0);
  const transformOrigin = useSharedValue<'left' | 'right'>('left');

  const panGesture = useMemo(
    () =>
      Gesture.Simultaneous(
        Gesture.Pan()
          .onBegin((event) => {
            isActive.set(true);
            lastX.set(event.x);
          })
          .onChange((event) => {
            lastX.set(event.x);
            transformOrigin.set(event.x > width / 2 ? 'left' : 'right');
          })
          .onFinalize(() => {
            isActive.set(false);
            if (lastX.get() >= 0 && lastX.get() <= width) return;
            const target = transformOrigin.get() === 'left' ? width : 0;
            lastX.set(withSpring(target, { damping: 60, stiffness: 900 }, () => lastX.set(0)));
          }),
        gesture
      ),
    [gesture, isActive, lastX, transformOrigin, width]
  );

  const activeScaleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: isActive.get()
          ? withSpring(1.03, { duration: 600 })
          : withSpring(1, { duration: 1000, dampingRatio: 0.3 }),
      },
    ],
  }));

  const stretchStyle = useAnimatedStyle(() => {
    const maxWidth = 100 * 2.5 * 2.5;
    const scaleX = interpolate(
      lastX.get(),
      [-maxWidth, 0, width, width + maxWidth],
      [2.5, 1, 1, 2.5],
      Extrapolation.CLAMP
    );
    const scaleY = interpolate(
      lastX.get(),
      [-width * 0.1, 0, width, width + width * 0.1],
      [0.9, 1, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transformOrigin: transformOrigin.get(),
      transform: [{ scaleY }, { scaleX }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ width, height }, activeScaleStyle]}>
        <Animated.View style={[styles.flexOne, stretchStyle]}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const BlockButton = () => (
  <Pressable style={styles.blockButton}>
    <Text style={styles.blockText}>Block</Text>
    <View style={styles.blockDotsContainer}>
      <View style={styles.blockDot} />
      <View style={styles.blockDot} />
      <View style={styles.blockDot} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
  },
  timerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  setTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  flexOne: {
    flex: 1,
  },
  sliderContainer: {
    position: 'absolute',
    right: 0,
    alignSelf: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stepperButton: {
    height: STEPPER_BUTTON_SIZE,
    width: STEPPER_BUTTON_SIZE,
    borderRadius: STEPPER_BUTTON_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  stepperAndroidBg: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
  },
  stepperCenter: {
    height: STEPPER_BUTTON_SIZE,
    width: STEPPER_CENTER_WIDTH,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#525252',
  },
  stepperCenterText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  sliderBody: {
    flex: 1,
    height: SLIDER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#404040',
    backgroundColor: Platform.OS === 'android' ? '#0f172a' : 'rgba(255,255,255,0.08)',
  },
  sliderMarksRow: {
    flexDirection: 'row',
    height: '100%',
  },
  sliderMarkContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sliderMark: {
    width: 2,
    borderRadius: 2,
    backgroundColor: '#404040',
  },
  sliderMarkHidden: {
    opacity: 0,
  },
  sliderMarkTall: {
    height: '100%',
  },
  sliderMarkShort: {
    height: '50%',
    opacity: 0.7,
  },
  sliderProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  blockButton: {
    flex: 1,
    height: STEPPER_BUTTON_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: STEPPER_BUTTON_SIZE / 2,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#404040',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  blockText: {
    color: 'white',
    fontSize: 18,
  },
  blockDotsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111827',
  },
});

export default HomeScreen;
