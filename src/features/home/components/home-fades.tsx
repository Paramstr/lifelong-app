import React, { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EdgeBlurFade } from '@/components/shared/edge-blur-fade';

export const HomeTopFade: FC = () => {
  const insets = useSafeAreaInsets();
  const height = insets.top + 100;

  return <EdgeBlurFade position="top" height={height} fadeColor="#FFFFFF" />;
};

export const HomeBottomFade: FC = () => {
  const insets = useSafeAreaInsets();
  const height = insets.bottom + 120;

  return <EdgeBlurFade position="bottom" height={height} fadeColor="#FFFFFF" />;
};
