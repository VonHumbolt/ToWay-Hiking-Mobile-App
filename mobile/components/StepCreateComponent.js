import { View, Text, Image } from "react-native";
import React from "react";

const StepCreateComponent = () => {
  return (
    <View className="px-6">
      <Image
        source={require("../assets/openingScreen/create.png")}
        className="w-96 h-96 self-center mt-6"
      />
      <Text className="text-primary font-extrabold text-4xl uppercase mt-12">
        Create
      </Text>
      <Text className="text-heading font-bold text-2xl mt-1">
        Plan and save your path
      </Text>
      <Text className="text-body font-regular mt-8 text-xl">
        Have a destination in mind? Use our easy route planner to draw your
        journey, customize every turn, and save it for your next adventure.
      </Text>
    </View>
  );
};

export default StepCreateComponent;
