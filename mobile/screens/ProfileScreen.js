import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTrackingStore } from "../store";
import MiniTrackingBar from "../components/MiniTrackingBar";
import UserService from "../services/UserService";
import * as SecureStore from "expo-secure-store";
import { StackActions, useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRightFromBracket, faShareNodes } from "@fortawesome/free-solid-svg-icons";

const ProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const isScreenFocused = useIsFocused();
  const { tracking } = useTrackingStore();
  const userService = new UserService();

  const [user, setUser] = useState();
  const [isUserOwnProfile, setIsUserOwnProfile] = useState(false);
  const [completedRoutes, setCompletedRoutes] = useState([]);
  const [createdRoutes, setCreatedRoutes] = useState([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [profileImage, setProfileImage] = useState();

  useEffect(() => {
    if (isScreenFocused) {
      SecureStore.getItemAsync("userId").then((ownId) => {
        setIsUserOwnProfile(userId == ownId);
      });
      getUserById();
      getUserCompletedRoutes();
      getUserCreatedRoutes();
    }
  }, [isScreenFocused]);

  const getUserById = () => {
    userService.getUserById(userId).then((res) => setUser(res.data));
  };

  const getUserCompletedRoutes = () => {
    SecureStore.getItemAsync("token").then((token) => {
      userService
        .getUserCompletedRoutes(userId, token)
        .then((res) => setCompletedRoutes(res.data.completedRoutes));
    });
  };

  const getUserCreatedRoutes = () => {
    SecureStore.getItemAsync("userId").then((ownerId) => {
      SecureStore.getItemAsync("token").then((token) => {
        userService
          .getUserCreatedRoutes(ownerId, userId, token)
          .then((res) => setCreatedRoutes(res.data.createdRoutes));
      });
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result);
    }
  };

  const uploadImage = async (imageResult) => {
    setIsImagesLoading(true);

    const element = imageResult.assets[0];
    const image = await resizeImage(element);
    const filename = image.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    setProfileImage(image.uri);

    // update user profile picture
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("images", { uri: image.uri, name: filename, type });
    SecureStore.getItemAsync("token").then((token) => {
      userService.updateProfileImage(formData, token).then((res) => {
        if (res.status == 200) setIsImagesLoading(false);
      });
    });
  };

  const resizeImage = async (image) => {
    const width = image.width;
    const height = image.height;
    const ratio = width / height;
    const resizedImage = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 640, height: 640 / ratio } }],
      { compress: 0.5 }
    );
    return resizedImage;
  };

  const logout = () => {
    SecureStore.deleteItemAsync("userId")
    SecureStore.deleteItemAsync("email")
    SecureStore.deleteItemAsync("token")
    SecureStore.deleteItemAsync("city")

    navigation.dispatch(StackActions.replace("SignIn"));
  }

  return (
    <SafeAreaView className="flex-1 relative bg-background mb-28">
      <ScrollView>
        <View className="flex-row gap-6 px-6 mt-4">
          <TouchableOpacity disabled={!isUserOwnProfile} onPress={pickImage}>
            {isImagesLoading && (
              <ActivityIndicator
                size="large"
                color="#A5D936"
                className="absolute top-20 left-16 z-10"
              />
            )}
            <Image
              source={{
                uri: profileImage ? profileImage : user?.profilePicture,
              }}
              className="rounded-3xl w-44 h-52"
            />
          </TouchableOpacity>
          <View>
            <Text className="font-semibold text-2xl">{user?.fullName}</Text>
            {/* Follow and followers */}
            <View className="flex-row items-center gap-2 mt-5">
              <View className="p-4 bg-white rounded-3xl items-center shadow-sm">
                <Text className="font-semibold text-lg">375</Text>
                <Text className="font-regular text-base text-[#5F5F5F]">
                  Followers
                </Text>
              </View>
              <View className="p-4 bg-white rounded-3xl items-center shadow-sm">
                <Text className="font-semibold text-lg">102</Text>
                <Text className="font-regular text-base text-[#5F5F5F]">
                  Following
                </Text>
              </View>
            </View>

            {/* Edit profile or follow button */}
            {isUserOwnProfile ? (
              <TouchableOpacity className="px-6 py-3 bg-primary rounded-full items-center mt-4">
                <Text className="text-lg text-white font-semibold">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="px-6 py-3 bg-primary rounded-full items-center mt-4">
                <Text className="text-lg text-white font-semibold">Follow</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Divider */}
        <View className="border-[0.6px] border-[#E7E7E7] my-6" />

        {/* Stats of all time */}
        <View className="mx-6 px-10 py-4 bg-white rounded-3xl flex-row items-center justify-between">
          <View className="items-center">
            <Text className="font-semibold text-lg text-primary">Routes</Text>
            <Text className="font-regular text-2xl text-body mt-3">
              {user?.totalNumberOfCompletedRoutes}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-semibold text-lg text-primary">Distance</Text>
            <Text className="font-regular text-2xl text-body mt-3">
              {user?.totalDistance} <Text className="text-sm text-body">m</Text>
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-semibold text-lg text-primary">Time</Text>
            <Text className="font-regular text-2xl text-body mt-3">
              {Math.floor((user?.totalElapsedTime / (1000 * 60)) % 60)} <Text className="text-sm text-body">min</Text>
            </Text>
          </View>
        </View>

        {/* Completed Routes */}
        <View className="mx-6 mt-5 px-6 py-4 bg-white rounded-full flex-row items-center justify-between">
          <Text className="text-body text-lg font-regular">
            Completed Routes
          </Text>
          <Text className="text-[#919191] text-base font-regular underline">
            See all
          </Text>
        </View>

        {/* Completed Routes Card Only 5 unit */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mx-6 mt-4"
        >
          {completedRoutes?.map((route, index) => (
            <TouchableOpacity
              key={index}
              className="rounded-3xl bg-primary items-center mr-5"
              onPress={() =>
                navigation.navigate("RouteDetail", { routeDetail: route })
              }
            >
              <Image
                source={{ uri: route.images[0] }}
                className="w-80 h-40 rounded-t-3xl"
              />
              <Text className="font-semibold text-white text-base p-3 text-center w-80 line-clamp-1">
                {route.city} - {route.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Created Routes */}
        <View className="mx-6 mt-5 px-6 py-4 bg-white rounded-full flex-row items-center justify-between">
          <Text className="text-body text-lg font-regular">Created Routes</Text>
          <Text className="text-[#919191] text-base font-regular underline">
            See all
          </Text>
        </View>

        {/* Created Routes Card Only 5 unit */}
        {/* Sadece 5 tane getirmesi için düzelt buraları */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mx-6 mt-4"
        >
          {createdRoutes?.map((route) => (
            <TouchableOpacity
              key={route._id}
              className="rounded-3xl bg-primary items-center mr-5"
              onPress={() =>
                navigation.navigate("RouteDetail", { routeDetail: route })
              }
            >
              <Image
                source={{ uri: route.images[0] }}
                className="w-80 h-40 rounded-t-3xl"
              />
              <Text className="font-semibold text-white text-base p-3 text-center w-80 line-clamp-1">
                {route.city} - {route.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Divider */}
        <View className="border-[0.6px] border-[#E7E7E7] my-6" />

        {/* Profile Settings */}
          {isUserOwnProfile && (
            <TouchableOpacity className="mx-6 px-6 py-4 bg-white rounded-full flex-row items-center gap-2">
              <FontAwesomeIcon icon={faShareNodes} color="#101010" size={20} />
              <Text className="text-body text-lg font-regular">Share Profile</Text>
            </TouchableOpacity>
          )}

          {/* Logout Settings */}
          {isUserOwnProfile && (
            <TouchableOpacity className="mx-6 mt-3 mb-4 px-6 py-4 bg-white rounded-full flex-row items-center gap-2"
              onPress={logout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} color="#101010" size={20} />
              <Text className="text-body text-lg font-regular">Logout</Text>
            </TouchableOpacity>
          )}


      </ScrollView>

      {tracking && <MiniTrackingBar />}
    </SafeAreaView>
  );
};

export default ProfileScreen;
