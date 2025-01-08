import { View, Image } from "react-native";
import React, { useEffect } from "react";
import "../global.css";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";
import StartedRoutesService from "../services/StartedRoutesService";
import { useTrackingStore } from "../store";
import RouteService from "../services/RouteService";

SplashScreen.preventAutoHideAsync();

const OpeningScreen = ({ navigation }) => {
  const startedRoutesService = new StartedRoutesService();
  const routeService = new RouteService();

  const {
    startTracking,
    startOrUpdateTime,
    updateDistance,
    updateUserCoordinates,
  } = useTrackingStore();
  
  const [loaded, error] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
  });

  // If user has active tracking, the app will get it from database
  const getActiveTracking = () => {
    SecureStore.getItemAsync("userId").then((userId) => {
      SecureStore.getItemAsync("token").then((token) => {
        startedRoutesService.isUserHasActiveRoute(userId, token).then((res) => {
          console.log(res.data);
          routeService.getRouteById(res.data.routeId).then((result) => {
            console.log("Route", result.data);
            const tracking = {
              id: res.data._id,
              title: result.data.title,
              route: result.data,
              isTrackingActive: true,
            };
            startTracking(tracking);
            startOrUpdateTime(res.data.duration);
            updateDistance(res.data.distance);
            updateUserCoordinates(res.data.userCoordinates);
          });
        });
      });
    });
  };

  useEffect(() => {
    if (loaded || error) {
      getActiveTracking();
      SplashScreen.hideAsync();
      setTimeout(() => {
        SecureStore.getItemAsync("token").then((token) => {
          if (token != null) navigation.replace("TabNavigation");
          else navigation.replace("Information");
        });
      }, 1500);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Image source={require("../assets/logo.png")} className="w-96 h-36" />
    </View>
  );
};

export default OpeningScreen;
