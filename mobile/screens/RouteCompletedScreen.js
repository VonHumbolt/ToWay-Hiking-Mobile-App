import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import React from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import convertMinuteToHour from "../utils/convertMinuteToHour";

const RouteCompletedScreen = ({ route, navigation }) => {
  const { routeDetail, completedRoute } = route.params;

  const calculateAverageSpeed = () => {
    // const km = completedRoute?.distance / 1000;
    // const hour = distance / 5000;

    // return Math.round(km / hour);
  };
  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <ScrollView
        className="px-6 mt-4 h-full"
        automaticallyAdjustKeyboardInsets
      >
        {/* Route Preview */}
        <Text className="text-xl font-semibold text-body mb-3">
          Route Preview
        </Text>
        <View className="flex-row bg-white rounded-2xl">
          <View className="w-1/2 h-44">
            <MapView
              style={{ flex: 1, borderRadius: 20 }}
              mapType="satellite"
              initialRegion={{
                latitude:
                  routeDetail?.coordinates[
                    Math.round(routeDetail?.coordinates.length / 2)
                  ]?.latitude,
                longitude:
                  routeDetail?.coordinates[
                    Math.round(routeDetail?.coordinates.length / 2)
                  ]?.longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
              }}
            >
              <Marker coordinate={routeDetail?.coordinates[0]}>
                <Image
                  source={require("../assets/icons/start_icon.png")}
                  className="w-8 h-8"
                />
              </Marker>
              <Marker
                coordinate={
                  routeDetail?.coordinates[routeDetail?.coordinates.length - 1]
                }
              >
                <Image
                  source={require("../assets/icons/finish_icon.png")}
                  className="w-8 h-8"
                />
              </Marker>
              <Polyline
                coordinates={completedRoute?.userCoordinates}
                strokeColor="#0396FF"
                strokeWidth={10}
                lineJoin="bevel"
              />
              <Polyline
                coordinates={routeDetail?.coordinates}
                strokeColor="#E16308"
                strokeWidth={8}
                lineJoin="bevel"
              />
            </MapView>
          </View>

          <View className="flex-grow gap-y-4 w-1/2">
            <View className="flex-row items-center justify-between mt-4 px-4 pb-3 border-b border-b-gray-200">
              <Text className="font-regular text-lg text-body">Distance </Text>
              <Text className="font-semibold text-primary text-xl">
                {completedRoute?.distance} m
              </Text>
            </View>
            <View className="flex-row items-center justify-between px-4 pb-3 border-b border-b-gray-200">
              <Text className="font-regular text-lg text-body">Time </Text>
              <Text className="font-semibold text-primary text-xl">
                {" "}
                {convertMinuteToHour(Math.floor((completedRoute?.duration / (1000 * 60)) % 60))}
              </Text>
            </View>
            <View className="flex-row items-center justify-between px-4 pb-3">
              <Text className="font-regular text-lg text-body">Velocity </Text>
              <Text className="font-semibold text-primary text-xl">
                {12} km/h
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RouteCompletedScreen;
