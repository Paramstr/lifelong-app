import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedProps,
    useAnimatedStyle,
} from 'react-native-reanimated';

import { simulatePress } from '@/utils/simulate-press';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface CarouselItemProps {
  item: string;
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
  screenWidth: number;
  horizontalPadding: number;
  innerPadding: number;
}

const CarouselItem = ({
  item,
  index,
  scrollX,
  itemWidth,
  screenWidth,
  horizontalPadding,
  innerPadding,
}: CarouselItemProps) => {
  const router = useRouter();

  const rItemStyle = useAnimatedStyle(() => {
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;
    const itemLeftEdge = index * itemWidth - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;
    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);
    const fullyVisibleRange = itemWidth;
    const partiallyVisibleRange = itemWidth * 1.5;

    const scale = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [1, 1, 0.88],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const rBlurProps = useAnimatedProps(() => {
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;
    const itemLeftEdge = index * itemWidth - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;
    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);
    const fullyVisibleRange = itemWidth;
    const partiallyVisibleRange = itemWidth * 1.5;

    const blurIntensity = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [0, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      intensity: blurIntensity,
    };
  });

  const _innerPadding = Math.max(innerPadding ?? 0, 6);

  return (
    <AnimatedPressable
      style={[{ width: itemWidth, padding: _innerPadding }, rItemStyle]}
      onPress={() => simulatePress()}
    >
      <View style={[styles.container, styles.aspect2_3]}>
        <Animated.View style={[styles.cardContainer, StyleSheet.absoluteFill]}>
          <View style={[StyleSheet.absoluteFill, styles.bgNeutral]} />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.95)', 'black', 'black']}
            locations={[0, 0.81, 0.88, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.contentContainer}>
            <View style={styles.placeholderLine1} />
            <View style={styles.placeholderLine2} />
            <View style={styles.placeholderLine3} />
            <View style={styles.footerRow}>
              <Ionicons name="add" size={15} color="#d4d4d4" />
              <Text style={styles.footerText}>Add </Text>
            </View>
          </View>
        </Animated.View>

        {Platform.OS === 'ios' && (
          <View style={[styles.blurContainer, StyleSheet.absoluteFill]}>
            <AnimatedBlurView
              animatedProps={rBlurProps}
              pointerEvents="none"
              tint="systemThinMaterialDark"
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  aspect2_3: {
    aspectRatio: 2 / 3,
  },
  cardContainer: {
    padding: 12,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderCurve: 'continuous',
  },
  bgNeutral: {
    backgroundColor: '#171717',
  },
  contentContainer: {
    marginTop: 'auto',
  },
  placeholderLine1: {
    marginBottom: 8,
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(38, 38, 38, 0.7)',
  },
  placeholderLine2: {
    marginBottom: 4,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(38, 38, 38, 0.7)',
  },
  placeholderLine3: {
    marginBottom: 16,
    width: '75%',
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(38, 38, 38, 0.7)',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(38, 38, 38, 0.7)',
    paddingVertical: 4,
  },
  footerText: {
    ...theme.typography.label,
    color: '#d4d4d4',
    fontWeight: '600',
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
}));

export default memo(CarouselItem);
