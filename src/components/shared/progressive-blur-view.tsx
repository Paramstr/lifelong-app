import { BlurView, BlurViewProps } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { colorKit } from 'reanimated-color-picker';

type Props = {
  position?: 'top' | 'bottom';
  height?: number;
  blurViewProps?: BlurViewProps;
};

export const ProgressiveBlurView: FC<Props> = ({ position = 'top', height = 100, blurViewProps }) => {
  return (
    <View
      style={[
        styles.container,
        position === 'top' ? styles.top : styles.bottom,
        { height },
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        intensity={blurViewProps?.intensity ?? 20}
        {...blurViewProps}
      />
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={
          position === 'top'
            ? [colorKit.setAlpha('#000', 0.8).hex(), colorKit.setAlpha('#000', 0).hex()]
            : [colorKit.setAlpha('#000', 0).hex(), colorKit.setAlpha('#000', 0.8).hex()]
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    pointerEvents: 'none',
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});
