import { View, Text, Image } from "react-native";
import React from "react";

const StepShareComponent = () => {
  return (
    <View className="px-6">
      <Image
        source={require("../assets/openingScreen/share.png")}
        className="w-full h-80 self-center mt-12"
      />
      <Text className="text-primary font-extrabold text-4xl uppercase mt-16">
        Share
      </Text>
      <Text className="text-heading font-bold text-2xl mt-1">
        Share your routes
      </Text>
      <Text className="text-body font-regular mt-8 text-xl">
        Turn your journey into a story worth sharing. Inspire your friends with
        your favorite paths or explore new routes designed by the community.
      </Text>
    </View>
  );
};

export default StepShareComponent;
