import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import RouteCard from "./RouteCard.";
import RouteService from "../services/RouteService";
import * as SecureStore from "expo-secure-store";

const PersonalizedRoutes = () => {
  const routeService = new RouteService();

  const [personalizedRoutes, setPersonalizedRoutes] = useState([]);

  useEffect(() => {
      SecureStore.getItemAsync("city").then(city => getPersonalizedRoutes(city))
  }, []);

  const getPersonalizedRoutes = (city) => {
    routeService
      .getFiveRoutesWithCityName(city)  
      .then((res) => {
        if (res.status == 200) setPersonalizedRoutes(res.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <View>
      <Text className="mt-6 font-semibold text-lg text-body mb-5">Personalized Routes</Text>
      {personalizedRoutes?.map((route) => (
        <RouteCard key={route?._id} route={route} />
      ))}
    </View>
  );
};

export default PersonalizedRoutes;
