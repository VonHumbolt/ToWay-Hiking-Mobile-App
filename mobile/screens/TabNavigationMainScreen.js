import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import ProfileScreen from "./ProfileScreen";
import SavedRouteScreen from "./SavedRouteScreen";
import * as SecureStore from "expo-secure-store";


const Tab = createBottomTabNavigator();
const ownId = SecureStore.getItem("userId")

const TabNavigationMainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        animation: "fade",
        tabBarStyle: {
          backgroundColor: "#A5D936",
          height: 75,
          margin: 20,
          paddingTop: 16,
          borderRadius: 24,
          position: "absolute",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={require("../assets/icons/main_icon_active.png")}
                className="w-14 h-14"
              />
            ) : (
              <Image
                source={require("../assets/icons/main_icon.png")}
                className="w-14 h-14"
              />
            ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Image
                source={require("../assets/icons/map_icon_active.png")}
                className="w-14 h-14"
              />
            ) : (
              <Image
                source={require("../assets/icons/map_icon.png")}
                className="w-14 h-14"
              />
            )
          ),
        }}
      />
      <Tab.Screen
        name="SavedRoutes"
        component={SavedRouteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Image
                source={require("../assets/icons/saved_icon_active.png")}
                className="w-14 h-14"
              />
            ) : (
              <Image
                source={require("../assets/icons/saved_icon.png")}
                className="w-14 h-14"
              />
            )
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{userId: ownId}}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? (
              <Image
                source={require("../assets/icons/profile_icon_active.png")}
                className="w-14 h-14"
              />
            ) : (
              <Image
                source={require("../assets/icons/profile_icon.png")}
                className="w-14 h-14"
              />
            )
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigationMainScreen;
