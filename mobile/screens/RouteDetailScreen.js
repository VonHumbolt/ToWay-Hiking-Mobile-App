import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faBolt,
  faBookmark as faBookmarkSolid,
  faGaugeSimpleHigh,
} from "@fortawesome/free-solid-svg-icons";
import convertMinuteToHour from "../utils/convertMinuteToHour";
import UserService from "../services/UserService";
import MapView, { Marker, Polyline } from "react-native-maps";
import getPastTimeFromDate from "../utils/getPastTimeFromDate";
import changeButtonColorWithDifficultyLevel from "../utils/changeButtonColorWithDifficultyLevel";
import Carousel from "react-native-reanimated-carousel";

const width = Dimensions.get("window").width;

const RouteDetailScreen = ({ route, navigation }) => {
  const { routeDetail } = route.params;
  const [routeOwner, setRouteOwner] = useState();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const userService = new UserService();

  useEffect(() => {
    getOwnerOfRoute();
  }, []);

  const getOwnerOfRoute = () => {
    userService
      .getUserById(routeDetail?.ownerId)
      .then((res) => {
        if (res.status == 200) setRouteOwner(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View className="flex-1 relative">


      {/* Slider */}
      <Carousel
        width={width}
        height={288}
        loop={false}
        data={routeDetail?.images}
        onSnapToItem={(index) => setActiveImageIndex(index)}
        renderItem={({ index, item }) => (
          <View>
            <Image source={{ uri: item }} className="w-full h-72" />
          </View>
        )}
      />
      {/* Dot */}
      <View className="flex-row items-center gap-2 absolute top-56 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        {routeDetail?.images.map((image, i) =>
          activeImageIndex == i ? (
            <View key={i} className="bg-primary px-3 py-1 rounded-full" />
          ) : (
            <View key={i} className="bg-white p-1 rounded-full" />
          )
        )}
      </View>

      <ScrollView className="rounded-t-[30px] z-20 bg-background absolute top-64 bottom-0 w-full pt-6">
        <View className="flex-row items-center justify-between px-6">
          <View>
            <Text className="font-semibold text-2xl text-wrap w-80">
              {routeDetail?.title}
            </Text>
            <Text className="font-regular text-base mt-1">
              {routeDetail?.city}, {routeDetail?.country}
            </Text>
          </View>
          <TouchableOpacity className="p-4 bg-primary rounded-full">
            <FontAwesomeIcon icon={faBookmarkRegular} size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="flex-wrap flex-row items-center gap-2 my-5 px-6">
          {routeDetail?.categories.map((category, index) => (
            <View key={index} className="px-5 py-2 bg-[#E7E7E7] rounded-full">
              <Text className="font-regular text-body text-sm">{category}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View className="flex-row items-center justify-between p-6 border-y border-[#E7E7E7]">
          <View className="flex-row items-center gap-1">
            <Image
              source={require("../assets/icons/detail_distance_icon.png")}
              className="w-6 h-6"
            />
            <Text className="font-regular text-base">
              {routeDetail?.distance} m
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={require("../assets/icons/detail_time_icon.png")}
              className="w-6 h-6"
            />
            <Text className="font-regular text-base">
              {convertMinuteToHour(routeDetail?.duration)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <FontAwesomeIcon
              icon={faGaugeSimpleHigh}
              size={18}
              color="#101010"
            />
            <Text className="font-regular text-base">5 km/h</Text>
          </View>
        </View>

        {/* Difficulty Level */}
        <View className="px-6 py-4 flex-wrap border-b border-[#E7E7E7]">
          <View
            className={`${changeButtonColorWithDifficultyLevel(
              routeDetail?.level
            )} px-6 py-3 rounded-full`}
          >
            <Text className="font-regular text-white">
              {routeDetail?.level}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className="p-6 border-b border-[#E7E7E7]">
          <Text className="font-regular">{routeDetail?.description}</Text>
        </View>

        {/* Highlights */}
        {!routeDetail?.importantPoints && (
          <View className="p-6 flex-row items-center gap-2 border-b border-[#E7E7E7]">
            {/* Loop */}
            <FontAwesomeIcon icon={faBolt} size={24} color="#A5D936" />
            <Text className="font-regular">
              {/* {routeDetail?.description} */} Highlight - 1
            </Text>
          </View>
        )}

        {/* Author */}
        <View className="p-6 border-b border-[#E7E7E7]">
          <Text className="font-semibold text-lg">Author</Text>
          <View className="flex-row items-center justify-between mt-3">
            <View className="flex-row items-center gap-3">
              <Image
                source={{
                  uri:
                    routeOwner?.profilePicture ||
                    "https://res.cloudinary.com/dspea8wm4/image/upload/v1701638455/default_profile_pic_szshsv.jpg",
                }}
                className="w-14 h-14 rounded-full"
              />
              <View>
                <Text className="font-regular text-base">
                  {routeOwner?.fullName}
                </Text>
                <Text className="font-regular text-[#919191] text-sm">
                  {getPastTimeFromDate(routeOwner?.createdAt)}
                </Text>
              </View>
            </View>

            <TouchableOpacity className="px-8 py-3 bg-primary rounded-full">
              <Text className="font-regular text-white text-base">Follow</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MapView */}
        <View className="p-6 w-full h-[400px]">
          <MapView
            style={{ flex: 1, borderRadius: 20 }}
            mapType="satellite"
            pointerEvents="none"
            initialRegion={{
              latitude:
                routeDetail?.coordinates[
                  Math.round(routeDetail?.coordinates.length / 2)
                ]?.latitude,
              longitude:
                routeDetail?.coordinates[
                  Math.round(routeDetail?.coordinates.length / 2)
                ]?.longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
          >
            <Marker coordinate={routeDetail?.coordinates[0]}>
              <Image
                source={require("../assets/icons/start_icon.png")}
                className="w-10 h-10"
              />
            </Marker>
            <Marker
              coordinate={
                routeDetail?.coordinates[routeDetail?.coordinates.length - 1]
              }
            >
              <Image
                source={require("../assets/icons/finish_icon.png")}
                className="w-10 h-10"
              />
            </Marker>
            <Polyline
              coordinates={routeDetail?.coordinates}
              strokeColor="#103B5F"
              strokeWidth={8}
              lineJoin="bevel"
            />
          </MapView>
        </View>

        {/* Buttons */}
        <View className="px-6 gap-y-4 pb-14">
          <TouchableOpacity className="px-8 py-4 bg-primary rounded-full">
            <Text className="font-regular text-white text-lg text-center">
              Navigate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-8 py-4 bg-background border border-primary rounded-full">
            <Text className="font-regular text-primary text-lg text-center">
              Edit Route
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


      <StatusBar style="auto" />
    </View>
  );
};

export default RouteDetailScreen;
