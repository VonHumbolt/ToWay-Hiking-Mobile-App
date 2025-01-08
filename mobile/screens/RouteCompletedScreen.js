import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import convertMinuteToHour from "../utils/convertMinuteToHour";
import CommentForm from "../components/CommentForm";
import RouteCompletedModal from "../components/RouteCompletedModal";

const RouteCompletedScreen = ({ route, navigation }) => {
  const { routeDetail, completedRoute } = route.params;

  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(true);

  const calculateAverageSpeed = () => {
    console.log(completedRoute)
    const km = completedRoute?.distance / 1000;
    const hour = completedRoute?.duration / (1000 * 60 * 60);

    return km == 0 ? 0 : Math.round(km / hour);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <ScrollView
        className="px-6 mt-4 h-full"
        automaticallyAdjustKeyboardInsets
      >
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={60}>
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
                    routeDetail?.coordinates[
                      routeDetail?.coordinates.length - 1
                    ]
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
                {routeDetail?.importantPoints?.map((point, index) => (
                  <Marker key={index} coordinate={point.coordinate}>
                    <Image
                      source={require("../assets/icons/point_icon.png")}
                      className="w-8 h-8"
                    />
                  </Marker>
                ))}
              </MapView>
            </View>

            <View className="flex-grow gap-y-4 w-1/2">
              <View className="flex-row items-center justify-between mt-4 px-4 pb-3 border-b border-b-gray-200">
                <Text className="font-regular text-lg text-body">
                  Distance{" "}
                </Text>
                <Text className="font-semibold text-primary text-xl">
                  {completedRoute?.distance} m
                </Text>
              </View>
              <View className="flex-row items-center justify-between px-4 pb-3 border-b border-b-gray-200">
                <Text className="font-regular text-lg text-body">Time </Text>
                <Text className="font-semibold text-primary text-xl">
                  {" "}
                  {convertMinuteToHour(
                    Math.floor((completedRoute?.duration / (1000 * 60)) % 60)
                  )}
                </Text>
              </View>
              <View className="flex-row items-center justify-between px-4 pb-3">
                <Text className="font-regular text-lg text-body">
                  Velocity{" "}
                </Text>
                <Text className="font-semibold text-primary text-xl">
                  {calculateAverageSpeed()} km/h
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="w-full border border-[#E7E7E7] my-6" />

          {/* Comment Section */}
          <CommentForm routeId={routeDetail._id} />
        </KeyboardAvoidingView>
      </ScrollView>

      {/* Completed Route Modal */}
      <RouteCompletedModal isOpen={isCompletedModalOpen}>
        <View className="bg-[#F6F6F6] w-full py-8 px-2 rounded-2xl items-center">
          <Image
            source={require("../assets/openingScreen/route_completed.png")}
            className="w-80 h-64"
          />
          <Text className="font-bold text-primary text-center text-3xl mt-4">
            Route Completed!
          </Text>
          <Text className="font-regular text-black text-base text-center px-8 my-2">
            Great job! You’ve successfully created your route. Now, personalize
            it by adding a name, uploading photos, or making final adjustments
            before saving.
          </Text>
          <TouchableOpacity
            className="w-52 py-3 px-6 mt-4 rounded-full bg-primary items-center justify-center"
            onPress={() => setIsCompletedModalOpen(false)}
          >
            <Text className="text-lg text-white font-regular">Continue</Text>
          </TouchableOpacity>
        </View>
      </RouteCompletedModal>
    </SafeAreaView>
  );
};

export default RouteCompletedScreen;
