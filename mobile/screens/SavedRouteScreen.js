import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useTrackingStore } from "../store";
import MiniTrackingBar from "../components/MiniTrackingBar";
import RouteCard from "../components/RouteCard.";
import UserService from "../services/UserService";
import * as SecureStore from "expo-secure-store";
import { useIsFocused } from "@react-navigation/native";

const SavedRouteScreen = () => {
  const { tracking } = useTrackingStore();
  const isScreenFocused = useIsFocused()
  const [savedRoutes, setSavedRoutes] = useState([])

  const userService = new UserService()

  useEffect(() => {
    if(isScreenFocused) {
      getUserSavedRoutes()
    }
  }, [isScreenFocused])
  
  const getUserSavedRoutes = () => {
    SecureStore.getItemAsync("userId").then(userId => {
      SecureStore.getItemAsync("token").then(token => {
        userService.getUserSavedRoutes(userId, token).then(res => {
          if(res.status == 200)
            setSavedRoutes(res.data.savedRoutes)
        })
      })
    })
  }

  return (
    <SafeAreaView className="flex-1 relative bg-background mb-28">
      <ScrollView className="px-6 mt-4">
      <Text className="font-semibold text-xl text-body mb-5">Saved Routes</Text>
        {savedRoutes?.map((route) => (
          <RouteCard key={route?._id} route={route} />
        ))}
      </ScrollView>
      {tracking && <MiniTrackingBar />}
    </SafeAreaView>
  );
};

export default SavedRouteScreen;
