import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import UserService from "../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faBolt,
  faBookmark as faBookmarkSolid,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import convertMinuteToHour from "../utils/convertMilisecondToMinute";
import getPastTimeFromDate from "../utils/getPastTimeFromDate";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import StartedRoutesService from "../services/StartedRoutesService";
import { useTrackingStore } from "../store";
import { useNavigation } from "@react-navigation/native";
import CommentService from "../services/CommentService";

const RouteDetailComponent = ({ routeDetail, goToComments }) => {
  const navigation = useNavigation();
  const [routeOwner, setRouteOwner] = useState();
  const [isRouteSaved, setIsRouteSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const userService = new UserService();
  const startedRoutesService = new StartedRoutesService();
  const commentService = new CommentService();
  const { startOrUpdateTime, startTracking } = useTrackingStore();

  useEffect(() => {
    getOwnerOfRoute();
    isRouteSavedInUserRoutes();
    getNumberOfComments();
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

  const isRouteSavedInUserRoutes = () => {
    SecureStore.getItemAsync("token").then((token) => {
      SecureStore.getItemAsync("userId").then((userId) => {
        userService
          .isRouteSaved(routeDetail?._id, userId, token)
          .then((res) => {
            if (res.status == 200) setIsRouteSaved(res.data.isSaved);
          });
      });
    });
  };

  const getNumberOfComments = () => {
    SecureStore.getItemAsync("token").then((token) => {
      commentService
        .numberOfComments(routeDetail?._id, token)
        .then((res) => setCommentCount(res.data.numberOfComments));
    });
  };

  function changeButtonColorWithDifficultyLevel() {
    switch (routeDetail?.level) {
      case "Beginner":
        return "bg-secondary";
      case "Intermediate":
        return "bg-[#73442A]";
      case "Hard":
        return "bg-[#852221]";
      case "Extreme":
        return "bg-[#4B0404]";
    }
  }

  const averageSpeed = () => {
    const km = routeDetail?.distance / 1000;
    const min = routeDetail?.duration * 0.00001666666666667
    const hour = min * 0.01666666666667

    return hour == 0 ? 0 : Math.round((km / hour) * 10) / 10;
  };

  const saveRoute = () => {
    SecureStore.getItemAsync("token").then((token) => {
      SecureStore.getItemAsync("userId").then((userId) => {
        userService
          .saveRouteForUser(routeDetail?._id, userId, token)
          .then((res) => {
            if (res.status == 200) setIsRouteSaved(true);
          });
      });
    });
  };

  const removeFromSavedRoutes = () => {
    SecureStore.getItemAsync("token").then((token) => {
      SecureStore.getItemAsync("userId").then((userId) => {
        userService
          .removeRouteFromUserSavedRoutes(routeDetail?._id, userId, token)
          .then((res) => {
            if (res.status == 200) setIsRouteSaved(false);
          });
      });
    });
  };
  const handleSaveRouteButton = () => {
    if (isRouteSaved) removeFromSavedRoutes();
    else saveRoute();
  };

  const startTrackingTheRoute = () => {
    SecureStore.getItemAsync("token").then((token) => {
      SecureStore.getItemAsync("userId").then((userId) => {
        startedRoutesService
          .startTracking(
            {
              userId,
              routeId: routeDetail._id,
              userCoordinates: [],
            },
            token
          )
          .then((res) => {
            console.log(res.data);
            if (res.status == 200) {
              const tracking = {
                id: res.data.id,
                title: routeDetail.title,
                route: routeDetail,
                isTrackingActive: true,
              };
              startTracking(tracking);
              startOrUpdateTime(0);
              navigation.navigate("Tracking", {
                routeDetail: routeDetail,
                startedRouteId: res.data.id,
              });
            }
          });
      });
    });
  };

  return (
    <View>
      <View className="flex-row items-center justify-between px-6">
        <View>
          <Text className="font-semibold text-2xl text-wrap w-80">
            {routeDetail?.title}
          </Text>
          <Text className="font-regular text-base mt-1">
            {routeDetail?.city}, {routeDetail?.country}
          </Text>
        </View>
        <TouchableOpacity
          className="p-4 bg-primary rounded-full"
          onPress={handleSaveRouteButton}
        >
          {isRouteSaved ? (
            <FontAwesomeIcon icon={faBookmarkSolid} size={22} color="white" />
          ) : (
            <FontAwesomeIcon icon={faBookmarkRegular} size={22} color="white" />
          )}
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
          <Image
            source={require("../assets/icons/detail_speed_icon.png")}
            className="w-6 h-6"
          />
          <Text className="font-regular text-base">{averageSpeed()} km/h</Text>
        </View>
      </View>

      {/* Difficulty Level */}
      <View className="flex-row justify-between items-center px-6 py-4 flex-wrap border-b border-[#E7E7E7]">
        <View
          className={`${changeButtonColorWithDifficultyLevel()} px-6 py-3 rounded-full`}
        >
          <Text className="font-regular text-white">{routeDetail?.level}</Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center gap-2"
          onPress={goToComments}
        >
          <FontAwesomeIcon icon={faUsers} color="#A5D936" size={20} />
          <Text className="font-semibold text-primary underline">
            {commentCount > 100 ? "100+" : commentCount} Reviews
          </Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View className="p-6 border-b border-[#E7E7E7]">
        <Text className="font-regular">{routeDetail?.description}</Text>
      </View>

      {/* Highlights */}
      {routeDetail?.importantPoints.length > 0 && (
        <View className="border-b border-[#E7E7E7] my-2">
          {/* Loop */}
          {routeDetail?.importantPoints.map((point, index) => (
            <View key={index} className="px-6 py-4 flex-row items-center gap-3">
              <FontAwesomeIcon icon={faBolt} size={24} color="#A5D936" />
              <Text className="font-regular text-lg">
                {point?.title}
                <Text className="font-regular text-base">
                  {" "}
                  ({point?.pointType})
                </Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Author */}
      <View className="p-6 border-b border-[#E7E7E7]">
        <Text className="font-semibold text-lg">Author</Text>
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center gap-3">
            <Image
              source={{
                uri: routeOwner?.profilePicture,
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
          // pointerEvents="none"
          initialRegion={{
            latitude:
              routeDetail?.coordinates[
                Math.round(routeDetail?.coordinates.length / 2)
              ]?.latitude,
            longitude:
              routeDetail?.coordinates[
                Math.round(routeDetail?.coordinates.length / 2)
              ]?.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          {/* Important Points */}
          {routeDetail?.importantPoints &&
            routeDetail?.importantPoints?.map((point, index) => (
              <Marker key={index} coordinate={point.coordinate}>
                <Image
                  source={require("../assets/icons/point_icon.png")}
                  className="w-8 h-8"
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
            coordinates={routeDetail?.coordinates}
            strokeColor="#E16308"
            strokeWidth={8}
            lineJoin="bevel"
          />
        </MapView>
      </View>

      {/* Buttons */}
      <View className="px-6 gap-y-4 pb-14">
        <TouchableOpacity
          className="px-8 py-4 bg-primary rounded-full"
          onPress={startTrackingTheRoute}
        >
          <Text className="font-regular text-white text-lg text-center">
            Navigate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-8 py-4 bg-background border border-primary rounded-full"
          onPress={goToComments}
        >
          <Text className="font-regular text-primary text-lg text-center">
            Edit Route
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RouteDetailComponent;
