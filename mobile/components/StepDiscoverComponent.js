import { View, Text, Image } from "react-native";
import React from "react";

const StepDiscoverComponent = () => {
  return (
    <View className="px-6">
      <Image
        source={require("../assets/openingScreen/discover.png")}
        className="w-96 h-96 self-center mt-4"
      />
      <Text className="text-primary font-extrabold text-4xl uppercase mt-14">
        Discover
      </Text>
      <Text className="text-heading font-bold text-2xl mt-1">
        Explore top-rated paths
      </Text>
      <Text className="text-body font-regular mt-8 text-xl">
        Dive into a world of curated routes crafted by locals and adventurers.
        Discover scenic landscapes, quiet paths, and exciting trails waiting
        just around the corner.
      </Text>
    </View>
  );
};

export default StepDiscoverComponent;
