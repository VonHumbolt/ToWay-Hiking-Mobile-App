import { View, Text, SafeAreaView, TextInput } from "react-native";
import React from "react";
import SavedRoutes from "../components/SavedRoutes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 mt-4">
        <View className="flex flex-row items-center gap-2 relative">
          <View className="absolute top-4 left-3 z-10">
            <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="gray" />
          </View>
          <TextInput
            clearButtonMode="always"
            className="flex-grow px-12 py-4 bg-white rounded-3xl font-semibold"
            placeholder="Find a route!"
          />
          <FontAwesomeIcon icon={faFilter} color="#527324" size={28} />
        </View>

        <SavedRoutes />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
