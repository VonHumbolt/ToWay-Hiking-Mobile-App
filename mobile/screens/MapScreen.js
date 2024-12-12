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
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { getPathLength } from "geolib";

const MapScreen = ({navigation}) => {
  const mapRef = useRef();

  const [isStartingPointSelected, setIsStartingPointSelected] = useState(false);
  const [startingPointCoordinates, setStartingPointCoordinates] = useState({});
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeLength, setRouteLength] = useState("");
  
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

  return (
    <SafeAreaView className="flex-1">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType="hybridFlyover"
        showsUserLocation
        onLongPress={(e) => {
          drawRoute(e.nativeEvent.coordinate);
        }}
      >
        <View className="bg-background px-6 pt-16 py-5 z-10">
          <Text className="text-2xl font-bold">Create Route</Text>
          <TouchableOpacity className="flex flex-row justify-center items-center gap-2 mt-2 py-3 px-4 rounded-3xl bg-primary">
            <FontAwesomeIcon icon={faBookmark} size={18} color="white" />
            <Text className="text-white font-semibold text-lg">Save</Text>
          </TouchableOpacity>
        </View>

        {isStartingPointSelected && (
          <TouchableOpacity
            className="absolute top-1/4 right-4 p-4 bg-secondaryDark rounded-full"
            onPress={takeBackToDrawing}
          >
            <FontAwesomeIcon icon={faRotateLeft} size={20} color="white" />
          </TouchableOpacity>
        )}
        {isStartingPointSelected && (
          <Marker coordinate={startingPointCoordinates}>
            <Image
              source={require("../assets/icons/start_icon.png")}
              className="w-12 h-12"
            />
          </Marker>
        )}

        <Polyline
          strokeColor="white"
          strokeWidth={8}
          lineJoin="bevel"
          coordinates={routeCoordinates}
        />
      </MapView>
      {/* {isStartingPointSelected && (
        <Text className="absolute top-1/3 right-1/2 text-3xl font-bold text-secondaryDark">
          {routeLength}
        </Text>
      )} */}

      <TouchableOpacity className="absolute bottom-10 right-1/4 mt-2 py-3 px-4 rounded-3xl bg-secondaryDark"
        onPress={() => navigation.navigate("Tracking")}
      >
        <Text className="text-white font-semibold text-lg">
          Start Without Route
        </Text>
      </TouchableOpacity>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default MapScreen;
