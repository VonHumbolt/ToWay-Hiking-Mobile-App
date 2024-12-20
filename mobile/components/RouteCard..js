import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGaugeSimpleHigh, faBookmark as faBookmarkSolid, } from "@fortawesome/free-solid-svg-icons";
import convertMinuteToHour from "../utils/convertMinuteToHour";
import { faClock, faBookmark as faBookmarkRegular  } from "@fortawesome/free-regular-svg-icons";
import getPastTimeFromDate from "../utils/getPastTimeFromDate";
import { useNavigation } from "@react-navigation/native";
import changeButtonColorWithDifficultyLevel from "../utils/changeButtonColorWithDifficultyLevel";

const RouteCard = ({ route }) => {
  const navigation = useNavigation()

  const averageSpeed = () => {
    const km = route?.distance / 1000;
    const hour = route?.duration / 60;

    return Math.round((km / hour) * 10) / 10;
  };

  return (
    <TouchableOpacity className="relative rounded-3xl bg-white mb-5 shadow-sm" 
    onPress={() => navigation.navigate("RouteDetail", { routeDetail: route })}>
      
      {/* Save Icon */}
      <TouchableOpacity className="absolute right-0 top-0 p-4 bg-primary z-10 rounded-tr-3xl rounded-bl-3xl">
        <FontAwesomeIcon icon={faBookmarkRegular} size={20} color="white" />
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
        <View className={`${changeButtonColorWithDifficultyLevel(route?.level)} px-6 py-3 rounded-full`}>
          <Text className="font-regular text-white">{route?.level}</Text>
        </View>

        <View className="flex-row items-center gap-1">
          <FontAwesomeIcon icon={faClock} size={16} color="#919191" />
          <Text className="font-regular text-[#919191] text-sm">{getPastTimeFromDate(route?.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RouteCard;
