import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import {
  faBookmark,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { getPathLength } from "geolib";
import StartedRoutesService from "../services/StartedRoutesService";
import * as SecureStore from "expo-secure-store";
import { useTrackingStore } from "../store";

const MapScreen = ({ navigation }) => {
  const mapRef = useRef();

  const [isStartingPointSelected, setIsStartingPointSelected] = useState(false);
  const [startingPointCoordinates, setStartingPointCoordinates] = useState({});
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeLength, setRouteLength] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {startOrUpdateTime, startTracking} = useTrackingStore()
  const startedRoutesService = new StartedRoutesService();

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status != "granted") {
      console.log("Permission required");
    }

    const location = await Location.getCurrentPositionAsync({
      // enableHighAccurancy: true
    });

    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  useEffect(() => {
    getLocationPermission();
  }, []);

  const drawRoute = (coordinate) => {
    setIsStartingPointSelected(true);

    if (!isStartingPointSelected) {
      setStartingPointCoordinates(coordinate);
    }
    setRouteCoordinates([...routeCoordinates, coordinate]);

    setRouteLength(getPathLength(routeCoordinates));
  };

  const takeBackToDrawing = () => {
    const newCoords = [...routeCoordinates];
    if (newCoords.length == 0) setIsStartingPointSelected(false);
    newCoords.pop();
    setRouteCoordinates(newCoords);
  };

   const startTrackingTheRoute = () => {
      SecureStore.getItemAsync("token").then((token) => {
        SecureStore.getItemAsync("userId").then((userId) => {
          startedRoutesService
            .startTracking(
              {
                userId,
                routeId: null,
                userCoordinates: [],
              },
              token
            )
            .then((res) => {
              console.log(res.data);
              if (res.status == 200) {
                const tracking = {
                  id: res.data.id,
                  title: "New Route",
                  route: null,
                  isTrackingActive: true,
                };
                startTracking(tracking);
                startOrUpdateTime(0);
                navigation.navigate("Tracking", {
                  routeDetail: null,
                  startedRouteId: res.data.id,
                });
              }
            });
        });
      });
    };

  return (
    <SafeAreaView className="flex-1">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType="hybrid"
        showsUserLocation
        onLongPress={(e) => {
          drawRoute(e.nativeEvent.coordinate);
        }}
      >
        <View className="bg-background px-6 pt-16 py-5 z-10">
          <Text className="text-2xl font-bold">Create Route</Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-lg font-regular">
              Total Distance:{" "}
              <Text className="font-semibold text-2xl">{routeLength}</Text> m
            </Text>

            <TouchableOpacity className="flex flex-row justify-center items-center gap-2 py-3 px-8 rounded-3xl bg-primary"
              onPress={() => navigation.navigate("CreateRoute", { routeCoordinates: routeCoordinates, distance: routeLength, time:0 })}>
              <FontAwesomeIcon icon={faBookmark} size={18} color="white" />
              <Text className="text-white font-semibold text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isStartingPointSelected && (
          <TouchableOpacity
            className="absolute top-64 right-4 p-4 bg-secondaryDark rounded-full"
            onPress={takeBackToDrawing}
          >
            <FontAwesomeIcon icon={faRotateLeft} size={20} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="absolute top-48 right-4 p-4 bg-background rounded-full"
          onPress={() => setIsModalOpen(!isModalOpen)}
        >
          <FontAwesomeIcon icon={faCircleQuestion} size={20} color="#A5D936" />
        </TouchableOpacity>

        {isStartingPointSelected && (
          <Marker coordinate={startingPointCoordinates}>
            <Image
              source={require("../assets/icons/start_icon.png")}
              className="w-12 h-12"
            />
          </Marker>
        )}

        <Polyline
          strokeColor="#E16308"
          strokeWidth={8}
          lineJoin="bevel"
          coordinates={routeCoordinates}
        />
      </MapView>

      <TouchableOpacity
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2 py-3 px-4 rounded-3xl bg-secondaryDark z-10"
        onPress={startTrackingTheRoute}
      >
        <Text className="text-white font-semibold text-lg">
          Start Without Route
        </Text>
      </TouchableOpacity>

      {/* Help Modal */}
      {isModalOpen && (
        <View className="absolute top-52 right-20 w-80 p-4 bg-background rounded-xl">
          <Text className="font-semibold">
            Press on the Map:{" "}
            <Text className="font-regular">
              Select points on the map along the roads or trails where you want
              your route to pass.
            </Text>
          </Text>

          <Text className="mt-2 font-semibold">
            Connect the Points:{" "}
            <Text className="font-regular">
              The app will automatically create a route connecting your selected
              points.
            </Text>
          </Text>

          <Text className="mt-2 font-semibold">
            Edit if Needed:{" "}
            <Text className="font-regular">
              To undo the drawing, press the undo button on the right of the
              screen.
            </Text>
          </Text>
        </View>
      )}

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default MapScreen;
