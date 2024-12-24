import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import {
  faArrowLeft,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StartedRoutesService from "../services/StartedRoutesService";
import * as SecureStore from "expo-secure-store";
import { getPathLength } from "geolib";
import StopWatch from "../components/StopWatch";

const TrackingScreen = ({ route, navigation }) => {
  const { routeDetail, startedRouteId } = route.params;
  const mapRef = useRef();
  const startedRoutesService = new StartedRoutesService();

  const [userCoordinates, setUserCoordinates] = useState([]);
  const [isStopWatchRunning, setIsStopWatchRunning] = useState(true)
  
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

  const zoomToUser = async () => {
    const location = await Location.getCurrentPositionAsync({});

    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const drawUserLocation = (coords) => {
    setUserCoordinates([...userCoordinates, coords]);
  };

  const updateTrackingRoute = () => {
    const distance = getPathLength(userCoordinates);
    SecureStore.getItemAsync("token").then((token) => {
      startedRoutesService.updateTracking({
        id: startedRouteId, 
        userCoordinates: userCoordinates,
        distance: distance,
      }, token).then(res => {
        console.log(res.data)
      })
    });
  };

  const stopOrStartTracking = () => {
    setIsStopWatchRunning(!isStopWatchRunning)
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between px-6 mt-3 z-10">
        <View className="flex-row">
          <TouchableOpacity
            className="p-4 w-14 h-14 rounded-full bg-background"
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={22} color="#A5D936" />
          </TouchableOpacity>
          <View className="py-3 px-5 bg-background rounded-full ml-4 max-w-72 justify-center">
            <Text className="text-lg font-semibold text-body line-clamp-2">
              {routeDetail ? routeDetail?.title : "New Route"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="p-4 w-14 h-14 rounded-full bg-background"
          onPress={zoomToUser}
        >
          <FontAwesomeIcon icon={faLocationArrow} size={22} color="#A5D936" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType="satellite"
        showsUserLocation
        followsUserLocation
        userLocationUpdateInterval={3000}
        onUserLocationChange={(e) => drawUserLocation(e.nativeEvent.coordinate)}
      >
        <Polyline
          coordinates={userCoordinates}
          strokeColor="#0396FF"
          strokeWidth={10}
          lineJoin="bevel"
        />
        {routeDetail && (
          <View>
            <Marker coordinate={routeDetail?.coordinates[0]}>
              <Image
                source={require("../assets/icons/start_icon.png")}
                className="w-12 h-12"
              />
            </Marker>
            <Marker
              coordinate={
                routeDetail?.coordinates[routeDetail?.coordinates.length - 1]
              }
            >
              <Image
                source={require("../assets/icons/finish_icon.png")}
                className="w-12 h-12"
              />
            </Marker>
            <Polyline
              coordinates={routeDetail?.coordinates}
              strokeColor="#E16308"
              strokeWidth={12}
              lineJoin="bevel"
            />
          </View>
        )}
      </MapView>

      <TouchableOpacity className="absolute bottom-1/4 left-4 px-4 py-3 rounded-full bg-background z-10">
        <View className="flex-row items-center gap-1">
          <Image
            source={require("../assets/icons/add_point_icon.png")}
            className="w-7 h-7"
          />
          <Text className="font-semibold text-lg">Add point</Text>
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
          <View className="flex-row items-center">
            <Image
              source={require("../assets/icons/time_icon.png")}
              className="w-8 h-8"
            />
              <StopWatch isStopWatchRunning={isStopWatchRunning} />
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
          <TouchableOpacity
            className={`py-3 px-8 rounded-full ${isStopWatchRunning ? "bg-secondaryDark" : "bg-secondary"}`}
            onPress={stopOrStartTracking}
          >
            <Text className="text-white font-semibold text-lg">{isStopWatchRunning ? "Stop" : "Start"}</Text>
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
