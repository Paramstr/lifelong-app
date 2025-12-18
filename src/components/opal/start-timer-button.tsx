import { View, Text, StyleSheet, Platform, Dimensions, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { Blur, Canvas, Path, processTransform3d, Skia, usePathValue } from '@shopify/react-native-skia';
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { memo, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colorKit } from 'reanimated-color-picker';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { easeGradient } from '@/utils/ease-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BUTTON_WIDTH = Dimensions.get('window').width - 24;
const BUTTON_HEIGHT = 58;

const OVAL_BREATHE_DURATION = 4000;
const OVAL_PRIMARY_COLOR = '#04cea9ff';
const OVAL_SECONDARY_COLOR = '#5c8e5bff';

const SHIMMER_DELAY = 4000;
const SHIMMER_BASE_DURATION = 1500;
const SHIMMER_REFERENCE_WIDTH = 200;
const SHIMMER_OVERSHOOT = 1.2;

const GRADIENT_COLOR = '#99f6e4';

const StartTimerButton = () => {
  const ovalWidth = BUTTON_HEIGHT * 3.4;
  const ovalHeight = BUTTON_HEIGHT * 1.7;
  const centerY = BUTTON_HEIGHT / 1.5 + ovalHeight / 2.2;

  const leftOvalRect = {
    x: ovalWidth / 13,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const leftOvalPathBase = Skia.Path.Make().addOval(leftOvalRect);

  const breathingProgress = useSharedValue(0);

  const scaleLeft = useDerivedValue(() => interpolate(breathingProgress.get(), [0, 1], [1, 1.2]));
  const colorProgressLeft = useDerivedValue(() => breathingProgress.get());

  const leftOvalPath = usePathValue((path) => {
    'worklet';
    path.transform(processTransform3d([{ scale: scaleLeft.get() }]));
  }, leftOvalPathBase);

  const rightOvalRect = {
    x: BUTTON_WIDTH - 1.2 * ovalWidth,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const rightOvalPathBase = Skia.Path.Make().addOval(rightOvalRect);

  const scaleRight = useDerivedValue(() => {
    const opposite = 1 - breathingProgress.get();
    return interpolate(opposite, [0, 1], [1, 1.2]);
  });

  const colorProgressRight = useDerivedValue(() => 1 - breathingProgress.get());

  const rightOvalPath = usePathValue((path) => {
    'worklet';
    path.transform(processTransform3d([{ scale: scaleRight.get() }]));
  }, rightOvalPathBase);

  useEffect(() => {
    breathingProgress.set(withRepeat(withTiming(1, { duration: OVAL_BREATHE_DURATION }), -1, true));
  }, [breathingProgress]);

  const leftOvalColor = useDerivedValue(() =>
    interpolateColor(colorProgressLeft.get(), [0, 1], [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR])
  );

  const rightOvalColor = useDerivedValue(() =>
    interpolateColor(colorProgressRight.get(), [0, 1], [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR])
  );

  const shimmerComponentWidth = useSharedValue(0);
  const shimmerProgress = useSharedValue(0);

  const pressScale = useSharedValue(1);
  const rPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.get() }],
  }));

  const rShimmerStyle = useAnimatedStyle(() => {
    if (shimmerComponentWidth.get() === 0) {
      return { opacity: 0 };
    }

    const translateX = interpolate(
      shimmerProgress.get(),
      [0, 1],
      [-shimmerComponentWidth.get() * SHIMMER_OVERSHOOT, BUTTON_WIDTH * SHIMMER_OVERSHOOT]
    );
    const opacity = interpolate(shimmerProgress.get(), [0, 0.2, 0.7, 1], [0, 0.15, 0.1, 0]);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  useEffect(() => {
    const duration = Math.max(
      SHIMMER_BASE_DURATION * (BUTTON_WIDTH / SHIMMER_REFERENCE_WIDTH),
      SHIMMER_BASE_DURATION
    );
    shimmerProgress.set(
      withRepeat(
        withSequence(
          withDelay(SHIMMER_DELAY, withTiming(0, { duration: 0 })),
          withTiming(1, { duration, easing: Easing.bezier(0.9, 0, 0.5, 0.3) })
        ),
        -1,
        false
      )
    );
  }, [shimmerProgress]);

  const { colors: leftColors, locations: leftLocations } = easeGradient({
    colorStops: {
      0: { color: colorKit.setAlpha(GRADIENT_COLOR, 0).hex() },
      1: { color: GRADIENT_COLOR },
    },
  });

  const { colors: rightColors, locations: rightLocations } = easeGradient({
    colorStops: {
      0: { color: GRADIENT_COLOR },
      1: { color: colorKit.setAlpha(GRADIENT_COLOR, 0).hex() },
    },
  });

  return (
    <Animated.View entering={FadeInDown}>
      <AnimatedPressable
        onPressIn={() => {
          impactAsync(ImpactFeedbackStyle.Light).catch(() => {});
          pressScale.set(withTiming(0.96, { duration: 150, easing: Easing.out(Easing.quad) }));
        }}
        onPressOut={() => {
          pressScale.set(withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }));
        }}
        style={[
          styles.container,
          Platform.OS === 'android' ? styles.containerAndroid : styles.containerIOS,
          rPressStyle,
        ]}
      >
        {Platform.OS === 'ios' && (
          <BlurView pointerEvents="none" intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
        )}
        <Canvas pointerEvents="none" style={styles.canvas}>
          <Path path={leftOvalPath} color={leftOvalColor}>
            <Blur blur={35} />
          </Path>
          <Path path={rightOvalPath} color={rightOvalColor}>
            <Blur blur={35} />
          </Path>
        </Canvas>
        <View pointerEvents="none" style={styles.contentRow}>
          <Ionicons name="play" size={18} color="white" />
          <Text style={styles.text}>Start Timer</Text>
        </View>
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmerWrapper, rShimmerStyle]}
          onLayout={(e) => shimmerComponentWidth.set(e.nativeEvent.layout.width)}
        >
          <LinearGradient
            colors={leftColors}
            locations={leftLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
          <LinearGradient
            colors={rightColors}
            locations={rightLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    borderCurve: 'continuous',
    borderRadius: BUTTON_HEIGHT,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 12,
  },
  containerAndroid: {
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  containerIOS: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#4b5563',
  },
  canvas: {
    flex: 1,
    borderRadius: 999,
  },
  contentRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  shimmerWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: BUTTON_WIDTH / 2,
    flexDirection: 'row',
  },
  gradient: {
    flex: 1,
  },
});

export default memo(StartTimerButton);
