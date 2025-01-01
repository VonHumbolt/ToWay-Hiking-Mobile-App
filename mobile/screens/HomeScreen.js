import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as SecureStore from "expo-secure-store";
import PersonalizedRoutes from "../components/PersonalizedRoutes";
import PopularRoutes from "../components/PopularRoutes";
import MiniTrackingBar from "../components/MiniTrackingBar";
import { useTrackingStore } from "../store";
import RouteService from "../services/RouteService";
import UserService from "../services/UserService";
import { useDebouncedCallback } from "use-debounce";

const HomeScreen = ({navigation}) => {
  const { tracking } = useTrackingStore();
  const routeService = new RouteService();
  const userService = new UserService();

  const [searchedRoutes, setSearchedRoutes] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);

  useEffect(() => {
    // SecureStore.deleteItemAsync("userId")
    // SecureStore.deleteItemAsync("email")
    // SecureStore.deleteItemAsync("token")
    // SecureStore.deleteItemAsync("city")
  }, []);

  const searchRoutesByCityName = async (searchInput) => {
    routeService.searchRoutesByCityName(searchInput).then((res) => {
      console.log(res.data);
      if (res.status == 200) setSearchedRoutes(res.data);
    });
  };

  const searchedUsersByName = async (searchInput) => {
    userService.searchUsersByName(searchInput).then((res) => {
      console.log(res.data);
      if (res.status == 200) setSearchedUsers(res.data);
    });
  };

  const handleSearchInput = useDebouncedCallback(async (value) => {
    if (value.trim().length > 0) {
      await searchRoutesByCityName(value);
      await searchedUsersByName(value);
    } else {
      setSearchedRoutes([]);
      setSearchedUsers([]);
    }
  }, 1500);

  return (
    <SafeAreaView className="flex-1 relative bg-background mb-28">
      <ScrollView className="px-6 mt-4">
        <View>
          <View className="flex flex-row items-center gap-2 relative                                                                ">
            <View className="absolute top-4 left-3 z-10">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size={20}
                color="gray"
              />
            </View>
            <TextInput
              clearButtonMode="always"
              className="flex-grow px-12 py-4 bg-white rounded-3xl font-semibold focus:border-primary focus:border-2"
              placeholder="Find routes or users"
              onChangeText={(e) => handleSearchInput(e)}
            />
            <FontAwesomeIcon icon={faFilter} color="#527324" size={28} />
          </View>

          {/* Search Results */}
          {(searchedRoutes.length > 0 || searchedUsers.length > 0) && (
            <View className="w-full rounded-3xl bg-white px-4 py-2 shadow-sm">
              <Text className="text-lg font-semibold text-black mt-1">
                Routes
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {/* Routes Loop */}
                {searchedRoutes.map((route) => (
                  <TouchableOpacity
                    key={route._id}
                    className="mr-2 my-2 justify-center items-center"
                    onPress={() => navigation.navigate("RouteDetail", { routeDetail: route })}
                  >
                    <Image
                      source={{ uri: route?.images[0] }}
                      className="w-52 h-36 rounded-3xl"
                    />
                    <Text className="text-base font-regular text-body mt-2">
                      {route?.city}
                    </Text>
                    <Text className="text-base font-regular text-body">
                      {route?.title}
                    </Text>
                  </TouchableOpacity>
                ))}

                {searchedRoutes.length == 0 && (
                  <View className="w-96 my-2">
                    <Text className="text-base font-regular text-[#919191] mt-1 text-center">
                      Not find!
                    </Text>
                  </View>
                )}
              </ScrollView>

                <View className="border-[0.6px] my-2 border-[#E7E7E7] rounded-full" />

              <Text className="text-lg font-semibold text-black ">
                Users
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {/* Users Loop */}
                {searchedUsers.map((user) => (
                  <View
                    key={user._id}
                    className="mr-2 mt-3 mb-2 justify-center items-center"
                  >
                    <Image
                      source={{ uri: user?.profilePicture }}
                      className="w-20 h-20 rounded-full"
                    />
                    <Text className="text-sm font-regular text-body mt-1 w-20 text-center">
                      {user?.fullName}
                    </Text>
                  </View>
                ))}
                {searchedUsers.length == 0 && (
                  <View className="w-96 my-2">
                    <Text className="text-base font-regular text-[#919191] mt-1 text-center">
                      Not find!
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Popular Routes */}
        <PopularRoutes />

        {/* Personalized Routes */}
        <PersonalizedRoutes />

      </ScrollView>
      {tracking && <MiniTrackingBar />}
    </SafeAreaView>
  );
};

export default HomeScreen;
