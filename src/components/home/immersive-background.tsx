import React from 'react';
import { Image, ImageSourcePropType, View, StyleSheet, Dimensions } from 'react-native';

interface ImmersiveBackgroundProps {
  source: ImageSourcePropType;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

const { width, height } = Dimensions.get('window');

export const ImmersiveBackground = ({ 
  source, 
  scale = 0.5, 
  translateX = 0, 
  translateY = 0 
}: ImmersiveBackgroundProps) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={source}
        style={[
          styles.image,
          {
            transform: [
              { scale },
              { translateX },
              { translateY },
            ],
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
