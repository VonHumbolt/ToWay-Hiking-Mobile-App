import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useTrackingStore } from "../store";

const MiniTrackingBar = () => {
  const { tracking } = useTrackingStore();

  const formatTime = () => {
    let hours = Math.floor(tracking?.time / (1000 * 60 * 60));
    let minutes = Math.floor((tracking?.time / (1000 * 60)) % 60);
    let seconds = Math.floor((tracking?.time / 1000) % 60);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <View className="absolute bottom-1 w-full max-w-[372px] mx-6 px-6 py-4 shadow-sm bg-white rounded-2xl">
      <Text className="font-semibold text-2xl text-body">{tracking.title}</Text>

      <View className="flex-row items-center justify-between py-2 mt-2">
        <View className="flex-row items-center gap-1">
          <Image
            source={require("../assets/icons/distance_icon.png")}
            className="w-7 h-7"
          />
          <Text className="font-regular text-xl">
            {tracking.distance}{" "}
            <Text className="text-base font-regular text-gray-500">m</Text>
          </Text>
        </View>
        <View className="flex-row items-center">
          <Image
            source={require("../assets/icons/time_icon.png")}
            className="w-7 h-7"
          />
          <Text className="font-regular text-xl">{formatTime()}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Image
            source={require("../assets/icons/speed_icon.png")}
            className="w-7 h-7"
          />
          <Text className="font-regular text-xl">
          {tracking.speed}{" "}<Text className="text-base font-regular text-gray-500">km/h</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity className="bg-primary rounded-3xl py-2 mt-2">
        <Text className="font-regular text-white text-lg text-center">
          Open Map
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MiniTrackingBar;
