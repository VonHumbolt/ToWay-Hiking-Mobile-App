import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import RouteService from "../services/RouteService";
import { useNavigation } from "@react-navigation/native";

const PopularRoutes = () => {
  const navigation = useNavigation()
  const routeService = new RouteService();

  const [popularRoutes, setPopularRoutes] = useState([]);

  useEffect(() => {
    getPopularRoutes();
  }, []);

  const getPopularRoutes = () => {
    routeService
      .getPopularRoutes()
      .then((res) => {
        if (res.status == 200) setPopularRoutes(res.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <View>
      <Text className="mt-6 font-semibold text-xl text-body mb-5">
        Popular Routes
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {popularRoutes?.map((route) => (
          <TouchableOpacity
            key={route._id}
            className="rounded-3xl bg-primary items-center mr-5"
            onPress={() => navigation.navigate("RouteDetail", { routeDetail: route })}
          >
            <Image
              source={{ uri: route.images[0] }}
              className="w-80 h-40 rounded-t-3xl"
            />
            <Text className="font-semibold text-white text-base p-3 text-center w-80 line-clamp-1">
              {route.city} - {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PopularRoutes;
