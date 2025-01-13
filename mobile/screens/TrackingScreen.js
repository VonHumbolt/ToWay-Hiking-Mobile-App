import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
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
import { useTrackingStore } from "../store";
import { useDebouncedCallback } from "use-debounce";
import AddPointModal from "../components/AddPointModal";
import { StackActions } from "@react-navigation/native";

const TrackingScreen = ({ route, navigation }) => {
  const { routeDetail, startedRouteId } = route.params;
  const mapRef = useRef();
  const startedRoutesService = new StartedRoutesService();
  const {
    averageSpeed,
    updateUserCoordinates,
    updateDistance,
    coordinatesFromUser,
    updateAverageSpeed,
    distance,
    time,
    endTracking,
  } = useTrackingStore();

  const [userCoordinates, setUserCoordinates] = useState([]);
  const [isStopWatchRunning, setIsStopWatchRunning] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [importantPoints, setImportantPoints] = useState(
    routeDetail?.importantPoints
  );
  const [isTrackingCompleted, setIsTrackingCompleted] = useState(false);

  useEffect(() => {
    setUserCoordinates(coordinatesFromUser);
    console.log(isTrackingCompleted);

    // If user walk without a route. Focus user location in opening
    if (!routeDetail) {
      zoomToUser();
    }

    // Update backend with new user coordinates, distance and time every 1 minute.
    const interval = setInterval(() => {
      updateTrackingRoute();
    }, 60000);

    const interval2 = setInterval(() => {
      drawAndUpdateUserCoordinates();
    }, 8000);

    return () => clearInterval(interval);
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

  const drawAndUpdateUserCoordinates = useDebouncedCallback(async () => {
    if (!isTrackingCompleted) {
      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      console.log("DeBounce 2 --> ", coords);
      const newCoordList = [...userCoordinates, coords];
      updateUserCoordinates(newCoordList);
      const distance = getPathLength(newCoordList);
      updateDistance(distance);
      console.log(newCoordList.length);
      setUserCoordinates([...userCoordinates, coords]);

      const seconds = Math.floor((time / 1000) % 60);
      const speed = Math.floor((distance / seconds) * 10) / 10;
      updateAverageSpeed(speed);
    }
  }, 6000);

  const updateTrackingRoute = useDebouncedCallback(async () => {
    if (!isTrackingCompleted) {
      console.log("Distance -> ", getPathLength(coordinatesFromUser));
      console.log("Koords Length -> ", coordinatesFromUser.length);
      SecureStore.getItemAsync("token").then((token) => {
        startedRoutesService
          .updateTracking(
            {
              id: startedRouteId,
              userCoordinates: coordinatesFromUser,
              distance: distance,
              duration: time,
            },
            token
          )
          .then((res) => {
            console.log(res.data);
          });
      });
    }
  }, 1000);

  const stopOrStartTracking = () => {
    setIsTrackingCompleted(!isTrackingCompleted);
    setIsStopWatchRunning(!isStopWatchRunning);
  };

  const completeTheRote = async () => {
    setIsTrackingCompleted(true);
    const location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    const lastUserCoordinates = [...userCoordinates, coords];
    const lastDistance = getPathLength(lastUserCoordinates);
    setIsStopWatchRunning(!isStopWatchRunning);
    endTracking();
    setUserCoordinates([])
    updateUserCoordinates([])

    SecureStore.getItemAsync("token").then((token) => {
      startedRoutesService
        .completeTracking(
          {
            id: startedRouteId,
            userCoordinates: lastUserCoordinates,
            distance: lastDistance,
            duration: time,
          },
          token
        )
        .then((res) => {
          console.log("Data ", res.data);
          console.log("Koords ", res.data.completedRoute.userCoordinates);
          if (res.status == 200 && routeDetail) {
             // Go to Route Completed Screen
            navigation.dispatch(
              StackActions.replace("CompletedRoute", {
                routeDetail: routeDetail,
                completedRoute: res.data.completedRoute,
              })
            );
          } if (res.status == 200 && !routeDetail) {
            // Eğer doğaçlama yürüyorsa kaydetme sayfasına yönlendir.
            navigation.dispatch(
              StackActions.replace("CreateRoute", {
                routeCoordinates: lastUserCoordinates,
                distance: lastDistance,
                time: time
              })
            );
          }
        });
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const returnAddedPointsFromModal = (point) => {
    console.log("Point ---> ", point);
    setImportantPoints([...importantPoints, point]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between px-6 mt-3 z-10">
        <View className="flex-row">
          <TouchableOpacity
            className="p-4 w-14 h-14 rounded-full bg-background"
            onPress={() => {
              navigation.navigate("TabNavigation");
            }}
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
        initialRegion={{
          latitude: routeDetail?.coordinates[0].latitude,
          longitude: routeDetail?.coordinates[0].longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        showsUserLocation
        followsUserLocation
        // onUserLocationChange={(e) => {
        //   sendUserCoordinates(e.nativeEvent.coordinate);
        // }}
      >
        <Polyline
          coordinates={userCoordinates}
          strokeColor="#0396FF"
          strokeWidth={10}
          lineJoin="bevel"
        />

        {importantPoints?.map((point, index) => (
          <Marker key={index} coordinate={point.coordinate}>
            <Image
              source={require("../assets/icons/point_icon.png")}
              className="w-12 h-12"
            />
            <Callout tooltip>
              <View className="w-72 bg-background rounded-2xl">
                <ScrollView horizontal className="">
                  {point?.images?.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      className="w-72 h-36 rounded-t-2xl"
                    />
                  ))}
                </ScrollView>
                <View className="px-4 py-1">
                  <Text className="font-semibold text-2xl text-body">
                    {point.title}
                    <Text className="font-semibold text-xl text-body">
                      {" "}
                      ({point.pointType})
                    </Text>
                  </Text>
                  <Text className="font-regular text-base text-body mb-1 line-clamp-2">
                    {point.description}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
        {routeDetail && (
          <View>
            <Marker coordinate={routeDetail?.coordinates[0]}>
              <Image
                source={require("../assets/icons/start_icon.png")}
                className="w-14 h-14"
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

      {routeDetail && (
        <TouchableOpacity
          className="absolute bottom-1/4 left-4 px-4 py-3 rounded-full bg-background z-10"
          onPress={() => setModalVisible(true)}
        >
          <View className="flex-row items-center gap-1">
            <Image
              source={require("../assets/icons/add_point_icon.png")}
              className="w-7 h-7"
            />
            <Text className="font-semibold text-lg">Add point</Text>
          </View>
        </TouchableOpacity>
      )}

      <View className="absolute bottom-0 w-full px-10 py-6 rounded-t-2xl bg-background z-10">
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center gap-1">
            <Image
              source={require("../assets/icons/distance_icon.png")}
              className="w-8 h-8"
            />
            <Text className="font-semibold text-2xl">
              {getPathLength(coordinatesFromUser)}{" "}
              <Text className="text-base font-regular text-gray-500">m</Text>
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
              {averageSpeed}{" "}
              <Text className="text-base font-regular text-gray-500">km/h</Text>
            </Text>
          </View>
        </View>

        <View className="border border-gray-200 my-6" />

        <View className="flex-row gap-6 pb-4">
          <TouchableOpacity
            className={`py-3 px-8 rounded-full ${
              isStopWatchRunning ? "bg-secondaryDark" : "bg-secondary"
            }`}
            onPress={stopOrStartTracking}
          >
            <Text className="text-white font-semibold text-lg">
              {isStopWatchRunning ? "Stop" : "Start"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-8 rounded-full bg-primary"
            onPress={completeTheRote}
          >
            <Text className="text-white font-semibold text-lg">
              Complete the route
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddPointModal
        routeId={routeDetail?._id}
        isOpen={modalVisible}
        closeModal={closeModal}
        returnPoint={returnAddedPointsFromModal}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default TrackingScreen;
