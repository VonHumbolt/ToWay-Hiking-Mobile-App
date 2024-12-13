import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import {
  faArrowLeft,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const TrackingScreen = ({ navigation }) => {
  const mapRef = useRef();

  const getLocation = async () => {
    const location = await Location.getCurrentPositionAsync({
      // enableHighAccurancy: true
    });

    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between px-6 mt-6 z-10">
        <View className="flex-row">
          <TouchableOpacity
            className="p-4 w-14 h-14 rounded-full bg-background"
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={22} color="#A5D936" />
          </TouchableOpacity>
          <View className="py-3 px-5 bg-background rounded-full ml-4">
            <Text className="text-lg font-semibold text-body">New Route</Text>
          </View>
        </View>
        <TouchableOpacity className="p-4 w-14 h-14 rounded-full bg-background">
          <FontAwesomeIcon icon={faLocationArrow} size={22} color="#A5D936" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType="hybridFlyover"
        showsUserLocation
      ></MapView>

      <TouchableOpacity className="absolute bottom-1/4 left-4 px-4 py-3 rounded-full bg-background z-10">
        <View className="flex-row items-center gap-1">
          <Image
            source={require("../assets/icons/add_point_icon.png")}
            className="w-7 h-7"
          />
          <Text className="font-semibold text-lg">
            Add point
          </Text>
        </View>
      </TouchableOpacity>

      <View className="absolute bottom-0 w-full px-10 py-6 rounded-t-2xl bg-background z-10">
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center gap-1">
            <Image
              source={require("../assets/icons/distance_icon.png")}
              className="w-8 h-8"
            />
            <Text className="font-semibold text-2xl">
              1.2{" "}
              <Text className="text-base font-regular text-gray-500">km</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={require("../assets/icons/time_icon.png")}
              className="w-8 h-8"
            />
            <Text className="font-semibold text-2xl">
              15{" "}
              <Text className="text-base font-regular text-gray-500">min</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={require("../assets/icons/speed_icon.png")}
              className="w-8 h-8"
            />
            <Text className="font-semibold text-2xl">
              2{" "}
              <Text className="text-base font-regular text-gray-500">km/h</Text>
            </Text>
          </View>
        </View>

        <View className="border border-gray-200 my-6" />

        <View className="flex-row gap-6 pb-4">
          <TouchableOpacity className="py-3 px-8 rounded-full bg-secondaryDark">
            <Text className="text-white font-semibold text-lg">Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 px-8 rounded-full bg-primary">
            <Text className="text-white font-semibold text-lg">
              Complete the route
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default TrackingScreen;
