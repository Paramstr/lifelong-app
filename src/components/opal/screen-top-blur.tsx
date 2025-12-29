import React, { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EdgeBlurFade } from '@/components/shared/edge-blur-fade';

export const ScreenTopBlur: FC = () => {
  const insets = useSafeAreaInsets();
  const height = insets.top + 40;

  return (
    <EdgeBlurFade
      position="top"
      height={height}
      fadeColor="#000000"
      fadeFromOpacity={0.5}
      fadeToOpacity={0}
    />
  );
};
