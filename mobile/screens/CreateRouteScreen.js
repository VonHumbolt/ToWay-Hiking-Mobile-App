import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import RouteCreateForm from "../components/RouteCreateForm";

const CreateRouteScreen = ({ route, navigation }) => {
  const { routeCoordinates, distance } = route.params;
  const [startingPointCoordinate, setStartingPointCoordinate] = useState({});
  const [endPointCoordinate, setEndPointCoordinate] = useState({});
  const mapRef = useRef();

  useEffect(() => {
    mapRef.current?.animateToRegion({
      latitude:
        routeCoordinates[Math.round(routeCoordinates.length / 2)]?.latitude,
      longitude:
        routeCoordinates[Math.round(routeCoordinates.length / 2)]?.longitude,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    });
    setStartingPointCoordinate(routeCoordinates[0]);
    setEndPointCoordinate(routeCoordinates[routeCoordinates.length - 1]);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="px-6 mt-4 h-full" automaticallyAdjustKeyboardInsets>
        {/* Route Preview */}
        <Text className="text-xl font-semibold text-body mb-3">
          Route Preview
        </Text>
        <View className="flex-row bg-white rounded-2xl">
          <View className="w-1/2 h-44">
            <MapView
              ref={mapRef}
              style={{ flex: 1, borderRadius: 20 }}
              mapType="satellite"
            >
              <Marker coordinate={startingPointCoordinate}>
                <Image
                  source={require("../assets/icons/start_icon.png")}
                  className="w-10 h-10"
                />
              </Marker>
              <Marker coordinate={endPointCoordinate}>
                <Image
                  source={require("../assets/icons/finish_icon.png")}
                  className="w-10 h-10"
                />
              </Marker>
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="blue"
                strokeWidth={8}
                lineJoin="bevel"
              />
            </MapView>
          </View>

          <View className="flex-grow gap-y-4">
            <View className="flex-row items-center justify-between mt-4 gap-x-7 pl-6 pr-8 pb-3 border-b border-b-gray-200">
              <Text className="font-regular text-lg text-body">Distance </Text>
              <Text className="font-semibold text-primary text-xl">
                {distance} m
              </Text>
            </View>
            <View className="flex-row items-center justify-between gap-x-7 pl-6 pr-8 pb-3 border-b border-b-gray-200">
              <Text className="font-regular text-lg text-body">Time </Text>
              <Text className="font-semibold text-primary text-xl">1,2 h</Text>
            </View>
            <View className="flex-row items-center justify-between gap-x-7 pl-6 pr-8 pb-3">
              <Text className="font-regular text-lg text-body">Uphill </Text>
              <Text className="font-semibold text-primary text-xl">229 m</Text>
            </View>
          </View>
        </View>

        {/* Add Image */}
        <View>
          <Text className="text-xl font-semibold text-body mt-5 mb-3">
            Add image
          </Text>
          <TouchableOpacity className="w-24 h-24 flex items-center justify-center bg-[#E7E7E7] rounded-2xl">
            <FontAwesomeIcon icon={faCirclePlus} color="#919191" size={36}/>
          </TouchableOpacity>

          {/* Added Images Loop */}
        </View>


        {/* Form */}
        <RouteCreateForm />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRouteScreen;
