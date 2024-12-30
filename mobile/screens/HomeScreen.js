import { View, Text, SafeAreaView, TextInput, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as SecureStore from "expo-secure-store";
import PersonalizedRoutes from "../components/PersonalizedRoutes";
import PopularRoutes from "../components/PopularRoutes";
import MiniTrackingBar from "../components/MiniTrackingBar";
import { useTrackingStore } from "../store";

const HomeScreen = () => {
  const { tracking } = useTrackingStore();
  useEffect(() => {
    // SecureStore.deleteItemAsync("userId")
    // SecureStore.deleteItemAsync("email")
    // SecureStore.deleteItemAsync("token")
    // SecureStore.deleteItemAsync("city")
  }, []);

  return (
    <SafeAreaView className="flex-1 relative bg-background mb-28">
      <ScrollView className="px-6 mt-4">
        <View className="flex flex-row items-center gap-2 relative">
          <View className="absolute top-4 left-3 z-10">
            <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="gray" />
          </View>
          <TextInput
            clearButtonMode="always"
            className="flex-grow px-12 py-4 bg-white rounded-3xl font-semibold focus:border-primary focus:border-2"
            placeholder="Find routes or users"
          />
          <FontAwesomeIcon icon={faFilter} color="#527324" size={28} />
        </View>

        <PopularRoutes />

        <PersonalizedRoutes />
      </ScrollView>
      {tracking && <MiniTrackingBar />}
    </SafeAreaView>
  );
};

export default HomeScreen;
