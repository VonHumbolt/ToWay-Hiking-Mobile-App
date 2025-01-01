import { Text, View, Button, SafeAreaView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useTrackingStore } from "../store";
import MiniTrackingBar from "../components/MiniTrackingBar";
import UserService from "../services/UserService";
import * as SecureStore from "expo-secure-store";

const ProfileScreen = ({ route, navigation }) => {
  // const { userId } = route.params;
  const { tracking } = useTrackingStore();
  const userService = new UserService();

  const [user, setUser] = useState();

  useEffect(() => {
    if (route.params == undefined) {
      getUserById();
    }
  }, []);

  const getUserById = () => {
    SecureStore.getItemAsync("userId").then((userId) => {
      userService.getUserById(userId).then((res) => setUser(res.data));
    });
  };

  return (
    <SafeAreaView className="flex-1 relative bg-background mb-28">
      <View className="flex-row gap-2 px-6 mt-4">
        <Image source={{uri: user?.profilePicture}} className="rounded-3xl w-44 h-56" />
        <Text>{user?.fullName}</Text>
      </View>
      {tracking && <MiniTrackingBar />}
    </SafeAreaView>
  );
};

export default ProfileScreen;
