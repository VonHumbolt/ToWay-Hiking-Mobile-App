import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OpeningScreen from "./screens/OpeningScreen";
import InformationScreen from "./screens/InformationScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Home"
          component={OpeningScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Information"
          component={InformationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
