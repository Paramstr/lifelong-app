import { LinearGradient } from 'expo-linear-gradient';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { easeGradient } from '@/utils/ease-gradient';
import { ProgressiveBlurView } from '../progressive-blur-view';

export const ScreenBottomBlur: FC = () => {
  const insets = useSafeAreaInsets();
  const height = insets.bottom + 110;

  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: 'rgba(0, 0, 0, 0)' },
      1: { color: 'rgba(0, 0, 0, 0.5)' },
    },
  });

  return (
    <View className="absolute bottom-0 left-0 right-0" style={{ height }}>
      <LinearGradient colors={colors} locations={locations} style={StyleSheet.absoluteFill} />
      <ProgressiveBlurView position="bottom" height={height} />
    </View>
  );
};
