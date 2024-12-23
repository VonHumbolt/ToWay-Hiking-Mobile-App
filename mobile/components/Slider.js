import { View, Text, FlatList, Animated } from "react-native";
import React, { useRef, useState } from "react";
import SliderItem from "./SliderItem";
import SliderPagination from "./SliderPagination";

const Slider = ({ data }) => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = (event) => {
    const totalWidth = event.nativeEvent.layoutMeasurement.width;
    const xPos = event.nativeEvent.contentOffset.x;
    const current = Math.floor(xPos / totalWidth);
    setPaginationIndex(current);

    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem key={index} item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(_, index) => {
          return (
            index
          )
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        onScroll={handleOnScroll}
      />
      <SliderPagination
        items={data}
        scrollX={scrollX}
        paginationIndex={paginationIndex}
      />
    </View>
  );
};

export default Slider;
