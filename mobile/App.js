import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OpeningScreen from "./screens/OpeningScreen";
import InformationScreen from "./screens/InformationScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import HomeScreen from "./screens/HomeScreen";
import TabNavigationMainScreen from "./screens/TabNavigationMainScreen";
import TrackingScreen from "./screens/TrackingScreen";
import CreateRouteScreen from "./screens/CreateRouteScreen";
import RouteDetailScreen from "./screens/RouteDetailScreen";
import SignInScreen from "./screens/SignInScreen";
import * as Location from "expo-location";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
   const getLocation = async () => {
      const location = await Location.getCurrentPositionAsync({
        // enableHighAccurancy: true
      });
      
      // console.log(location.coords.latitude, location.coords.longitude)
    };

    useEffect(() => {
      const interval = setInterval(() => {
        getLocation()
      }, 10000);
    
      return () => clearInterval(interval);
    }, [])
    

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Opening"
          component={OpeningScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Information"
          component={InformationScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="CreateAccount"
          component={CreateAccountScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SignIn"
          component={SignInScreen}
        />
        <Stack.Screen 
          options={{
            headerShown: false
          }}
          name="TabNavigation"
          component={TabNavigationMainScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Tracking"
          component={TrackingScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="CreateRoute"
          component={CreateRouteScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="RouteDetail"
          component={RouteDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
