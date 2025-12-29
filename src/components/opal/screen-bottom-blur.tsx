import React, { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EdgeBlurFade } from '@/components/shared/edge-blur-fade';

export const ScreenBottomBlur: FC = () => {
  const insets = useSafeAreaInsets();
  const height = insets.bottom + 110;

  return (
    <EdgeBlurFade
      position="bottom"
      height={height}
      fadeColor="#000000"
      fadeFromOpacity={0.5}
      fadeToOpacity={0}
    />
  );
};
