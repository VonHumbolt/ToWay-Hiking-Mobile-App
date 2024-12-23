import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faGaugeSimpleHigh,
  faBookmark as faBookmarkSolid,
} from "@fortawesome/free-solid-svg-icons";
import convertMinuteToHour from "../utils/convertMinuteToHour";
import {
  faClock,
  faBookmark as faBookmarkRegular,
} from "@fortawesome/free-regular-svg-icons";
import getPastTimeFromDate from "../utils/getPastTimeFromDate";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import UserService from "../services/UserService";

const RouteCard = ({ route }) => {
  const navigation = useNavigation();

  const [isRouteSaved, setIsRouteSaved] = useState(false);
  const userService = new UserService();

  useEffect(() => {
    isRouteSavedInUserRoutes();
  }, []);

  const isRouteSavedInUserRoutes = () => {
    SecureStore.getItemAsync("token").then((token) => {
      SecureStore.getItemAsync("userId").then((userId) => {
        userService.isRouteSaved(route?._id, userId, token).then((res) => {
          if (res.status == 200) setIsRouteSaved(res.data.isSaved);
        });
      });
    });
  };

  const averageSpeed = () => {
    const km = route?.distance / 1000;
    const hour = route?.duration / 60;

    return Math.round((km / hour) * 10) / 10;
  };

  function changeButtonColorWithDifficultyLevel() {
    switch (route?.level) {
      case "Beginner":
        return "bg-secondary";
      case "Intermediate":
        return "bg-[#73442A]";
      case "Hard":
        return "bg-[#852221]";
      case "Extreme":
        return "bg-[#4B0404]";
    }
  }

  return (
    <TouchableOpacity
      className="relative rounded-3xl bg-white mb-5 shadow-sm"
      onPress={() => navigation.navigate("RouteDetail", { routeDetail: route })}
    >
      {/* Save Icon */}
      <TouchableOpacity className="absolute right-0 top-0 p-4 bg-primary z-10 rounded-tr-3xl rounded-bl-3xl">
        {isRouteSaved ? (
          <FontAwesomeIcon icon={faBookmarkSolid} size={20} color="white" />
        ) : (
          <FontAwesomeIcon icon={faBookmarkRegular} size={20} color="white" />
        )}
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={{ uri: route?.images[0] }}
        className="w-full h-52 rounded-t-3xl"
      />

      {/* Route Title, City */}
      <View className="px-4 py-3 ">
        <Text className="font-semibold text-xl text-body">{route?.title}</Text>
        <Text className="font-regular text-base text-body mt-1">
          {route?.city}, {route?.country}
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row items-center justify-between px-4 py-5 border-y border-[#E7E7E7]">
        <View className="flex-row items-center gap-1">
          <Image
            source={require("../assets/icons/detail_distance_icon.png")}
            className="w-7 h-7"
          />
          <Text className="font-regular text-base">{route?.distance} m</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Image
            source={require("../assets/icons/detail_time_icon.png")}
            className="w-7 h-7"
          />
          <Text className="font-regular text-base">
            {convertMinuteToHour(route?.duration)}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <FontAwesomeIcon icon={faGaugeSimpleHigh} size={20} color="#101010" />
          <Text className="font-regular text-base">{averageSpeed()} km/h</Text>
        </View>
      </View>

      {/* Difficulty Level */}
      <View className="p-4 flex-row items-center justify-between">
        <View
          className={`${changeButtonColorWithDifficultyLevel()} px-6 py-3 rounded-full`}
        >
          <Text className="font-regular text-white">{route?.level}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <FontAwesomeIcon icon={faClock} size={16} color="#919191" />
          <Text className="font-regular text-[#919191] text-sm">
            {getPastTimeFromDate(route?.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteCard;
