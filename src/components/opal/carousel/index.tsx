import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import CarouselItem from './carousel-item';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 12;
const AVAILABLE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const TARGET_ITEMS_CENTERED = 2;
const PARTIAL_ITEM_VISIBLE_RATIO = 0.15;
const TOTAL_VISIBLE_RATIO = TARGET_ITEMS_CENTERED + PARTIAL_ITEM_VISIBLE_RATIO * 2;
const ITEM_WIDTH = AVAILABLE_WIDTH / TOTAL_VISIBLE_RATIO;
const INNER_PADDING = 6;

type Props = {
  data: string[];
};

const Carousel = ({ data }: Props) => {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.set(event.contentOffset.x);
    },
  });

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      {data.map((item, index) => (
        <CarouselItem
          key={index}
          item={item}
          index={index}
          scrollX={scrollX}
          itemWidth={ITEM_WIDTH}
          screenWidth={SCREEN_WIDTH}
          horizontalPadding={HORIZONTAL_PADDING}
          innerPadding={INNER_PADDING}
        />
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});

export default Carousel;
