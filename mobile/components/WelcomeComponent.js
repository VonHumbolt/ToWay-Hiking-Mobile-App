import { View, Text, Image } from "react-native";
import React from "react";

const WelcomeComponent = () => {
  return (
    <View className="px-6">
      <Image
        source={require("../assets/openingScreen/welcome.png")}
        className="w-full h-96 self-center"
      />
      <Text className="text-primary font-extrabold text-4xl uppercase mt-8">
        Welcome
      </Text>
      <Text className="text-heading font-bold text-2xl mt-1">
        Adventure is calling!
      </Text>
      <Text className="text-body font-regular mt-8 text-xl">
        Embark on a journey like never before. Whether you're walking through
        peaceful trails or cycling along scenic routes, we’re here to guide you.
        Let’s get started!
      </Text>
    </View>
  );
};

export default WelcomeComponent;
