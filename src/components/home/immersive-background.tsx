import React from 'react';
import { Image, ImageSourcePropType, View, StyleSheet, Dimensions } from 'react-native';

interface ImmersiveBackgroundProps {
  source: ImageSourcePropType;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ImmersiveBackground = ({ 
  source, 
  scale = 1, 
  translateX = 0, 
  translateY = 0 
}: ImmersiveBackgroundProps) => {
  const { width: imgWidth, height: imgHeight } = Image.resolveAssetSource(source);
  const aspectRatio = imgWidth / imgHeight;

  // Calculate dimensions to ensure the image covers the screen
  // while preserving its aspect ratio.
  let targetWidth = screenWidth;
  let targetHeight = screenWidth / aspectRatio;

  if (targetHeight < screenHeight) {
    targetHeight = screenHeight;
    targetWidth = screenHeight * aspectRatio;
  }

  // Center the image initially
  const initialLeft = (screenWidth - targetWidth) / 2;
  const initialTop = (screenHeight - targetHeight) / 2;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ flex: 1, backgroundColor: 'white', overflow: 'hidden' }}>
        <Image
          source={source}
          style={{
            width: targetWidth,
            height: targetHeight,
            position: 'absolute',
            left: initialLeft,
            top: initialTop,
            transform: [
              { scale },
              { translateX },
              { translateY },
            ],
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};
