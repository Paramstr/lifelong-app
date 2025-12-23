import React from 'react';
import { Dimensions, View } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SoftRadialGradient = () => {
  return (
    <View 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: SCREEN_HEIGHT * 0.25,
      }} 
      pointerEvents="none"
    >
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="grad"
            cx="90%"
            cy="3%"
            r="80%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="rgba(255, 209, 220, 0.5)" stopOpacity="1" />
            <Stop offset="50%" stopColor="rgba(255, 228, 216, 0.2)" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
};

export default SoftRadialGradient;
