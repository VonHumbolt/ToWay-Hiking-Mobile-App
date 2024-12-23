import { View, Text, Animated, Dimensions } from "react-native";
import React from "react";

const { width } = Dimensions.get("screen");

const SliderPagination = ({ items, scrollX, paginationIndex }) => {
  return (
    <View className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <View className="flex-row justify-center items-center gap-2">
        {items.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 35, 8],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={{ width: dotWidth }}
              className={`${
                paginationIndex === index
                  ? "bg-primary"
                  : "bg-[#FFFFFF]"
              } p-1 rounded-full`}
            />
          );
        })}
      </View>
    </View>
  );
};

export default SliderPagination;
