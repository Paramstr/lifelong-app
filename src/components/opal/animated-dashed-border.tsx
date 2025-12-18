import { Canvas, DashPathEffect, Path, Skia } from '@shopify/react-native-skia';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { View, ViewProps } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface Props extends ViewProps {
  strokeWidth?: number;
  dashLength?: number;
  gapLength?: number;
  animationSpeed?: number;
  borderRadius?: number;
  strokeColor?: string;
  direction?: 'clockwise' | 'counterclockwise';
  children?: React.ReactNode;
}

const AnimatedDashedBorder: React.FC<Props> = ({
  strokeWidth = 2,
  dashLength = 12,
  gapLength = 6,
  animationSpeed = 1500,
  borderRadius = 8,
  strokeColor = '#fff',
  direction = 'clockwise',
  children,
  style,
  ...props
}) => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const rPhase = useSharedValue(0);
  const containerRef = useRef<View>(null);

  const adjustedDashLength = useMemo(() => {
    if (!size.w || !size.h) return Math.max(3, dashLength);
    const w = Math.max(0, size.w - strokeWidth) + 1;
    const h = Math.max(0, size.h - strokeWidth);
    const r = Math.min(borderRadius, Math.min(w, h) / 2);
    const perimeter = 2 * (w + h - 2 * r) + 2 * Math.PI * r;
    const targetNumDashes = Math.floor(perimeter / (dashLength + gapLength));
    const actualNumDashes = Math.max(8, targetNumDashes);
    const totalDashLength = perimeter / actualNumDashes;
    const calculatedDashLength = totalDashLength - gapLength;
    return Math.max(3, calculatedDashLength);
  }, [size, strokeWidth, borderRadius, dashLength, gapLength]);

  const adjustedGapLength = Math.max(3, gapLength);
  const dashCycle = adjustedDashLength + adjustedGapLength;

  useEffect(() => {
    rPhase.set(0);
    const targetValue = direction === 'clockwise' ? -dashCycle : dashCycle;
    rPhase.set(
      withRepeat(
        withTiming(targetValue, {
          duration: animationSpeed,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [animationSpeed, dashCycle, adjustedDashLength, direction]);

  const skPhase = useSharedValue(0);
  useDerivedValue(() => {
    skPhase.set(rPhase.get());
  });

  const path = useMemo(() => {
    if (!size.w || !size.h) return null;
    const inset = strokeWidth / 2;
    const w = Math.max(0, size.w - strokeWidth);
    const h = Math.max(0, size.h - strokeWidth);
    const r = Math.min(borderRadius, Math.min(w, h) / 2);
    const p = Skia.Path.Make();
    const rect = Skia.XYWHRect(inset, inset, w, h);
    p.addRRect(Skia.RRectXY(rect, r, r));
    return p;
  }, [size, strokeWidth, borderRadius]);

  return (
    <View
      ref={containerRef}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ w: width, h: height });
      }}
      style={[{ position: 'relative' }, style]}
      {...props}
    >
      {children}
      {!!path && (
        <Canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size.w + 1,
            height: size.h + 1,
            pointerEvents: 'none',
          }}
        >
          <Path
            path={path}
            style="stroke"
            color={strokeColor}
            strokeWidth={strokeWidth}
            strokeJoin="round"
            strokeCap="round"
          >
            <DashPathEffect intervals={[adjustedDashLength, adjustedGapLength]} phase={skPhase} />
          </Path>
        </Canvas>
      )}
    </View>
  );
};

export default memo(AnimatedDashedBorder);
