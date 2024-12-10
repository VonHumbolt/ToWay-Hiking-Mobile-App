import { View, Text, Image } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigationMainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: '#A5D936', height:75, margin: 20, paddingTop:16, borderRadius: 32 },
        
    }}
    >
      <Tab.Screen 
        name="Home"
        component={HomeScreen}
        options={{
            tabBarIcon: ({ focused }) =>
              <Image source={require("../assets/icons/homescreen_logo.png")} className="w-9 h-9" />
          }}
      />
      <Tab.Screen 
        name="Map"
        component={MapScreen}
      />
      <Tab.Screen 
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigationMainScreen;
