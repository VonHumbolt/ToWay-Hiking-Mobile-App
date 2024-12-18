import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import RouteCreateForm from "../components/RouteCreateForm";
import convertMinuteToHour from "../utils/convertMinuteToHour";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const CreateRouteScreen = ({ route, navigation }) => {
  const { routeCoordinates, distance } = route.params;
  const [startingPointCoordinate, setStartingPointCoordinate] = useState({});
  const [endPointCoordinate, setEndPointCoordinate] = useState({});
  const [routeImages, setRouteImages] = useState([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    setStartingPointCoordinate(routeCoordinates[0]);
    setEndPointCoordinate(routeCoordinates[routeCoordinates.length - 1]);
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      uploadImage(result);
    }
  };

  const uploadImage = async (imageResult) => {
    setIsImagesLoading(true);
    const formData = new FormData();
    const imageArray = [];
    for (let i = 0; i < imageResult.assets.length; i++) {
      const element = imageResult.assets[i];
      const image = await resizeImage(element);
      const filename = image.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      imageArray.push(image.uri);
    }
    setRouteImages([...routeImages, ...imageArray]);
    setIsImagesLoading(false);
    // formData.append("image", { uri: image.uri, name: filename, type });
  };

  const resizeImage = async (image) => {
    const width = image.width;
    const height = image.height;
    const ratio = width / height;
    const resizedImage = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 640, height: 640 / ratio } }],
      { compress: 0.5 }
    );
    return resizedImage;
  };

  const removeImageFromList = (image) => {
    const newList = routeImages.filter(i => i != image) 
    setRouteImages([...newList]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="px-6 mt-4 h-full"
        automaticallyAdjustKeyboardInsets
      >
        {/* Route Preview */}
        <Text className="text-xl font-semibold text-body mb-3">
          Route Preview
        </Text>
        <View className="flex-row bg-white rounded-2xl">
          <View className="w-1/2 h-44">
            <MapView
              ref={mapRef}
              style={{ flex: 1, borderRadius: 20 }}
              mapType="satellite"
              initialRegion={{
                latitude:
                  routeCoordinates[Math.round(routeCoordinates.length / 2)]
                    ?.latitude,
                longitude:
                  routeCoordinates[Math.round(routeCoordinates.length / 2)]
                    ?.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              }}
            >
              <Marker coordinate={startingPointCoordinate}>
                <Image
                  source={require("../assets/icons/start_icon.png")}
                  className="w-10 h-10"
                />
              </Marker>
              <Marker coordinate={endPointCoordinate}>
                <Image
                  source={require("../assets/icons/finish_icon.png")}
                  className="w-10 h-10"
                />
              </Marker>
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#103B5F"
                strokeWidth={8}
                lineJoin="bevel"
              />
            </MapView>
          </View>

          <View className="flex-grow gap-y-4 w-1/2">
            <View className="flex-row items-center justify-between mt-4 px-4 pb-3 border-b border-b-gray-200">
              <Text className="font-regular text-lg text-body">Distance </Text>
              <Text className="font-semibold text-primary text-xl">
                {distance} m
              </Text>
            </View>
            <View className="flex-row items-center justify-between px-4 pb-3 border-b border-b-gray-200">
              <Text className="font-regular text-lg text-body">Time </Text>
              <Text className="font-semibold text-primary text-xl">
                {" "}
                {convertMinuteToHour((distance * 60) / 5000)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between px-4 pb-3">
              <Text className="font-regular text-lg text-body">Uphill </Text>
              <Text className="font-semibold text-primary text-xl">229 m</Text>
            </View>
          </View>
        </View>

        {/* Add Image */}
        <View>
          <Text className="text-xl font-semibold text-body mt-5 mb-3">
            Add image
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                className="w-24 h-24 flex items-center justify-center bg-[#E7E7E7] rounded-2xl"
                onPress={pickImage}
              >
                <FontAwesomeIcon
                  icon={faCirclePlus}
                  color="#919191"
                  size={36}
                />
              </TouchableOpacity>

              {/* Added Images Loop */}
              {isImagesLoading && (
                <ActivityIndicator size="large" color="#A5D936" />
              )}
              {routeImages?.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeImageFromList(image)}
                >
                  <Image
                    source={{ uri: image }}
                    className="w-24 h-24 rounded-2xl"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Form */}
        <RouteCreateForm />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRouteScreen;
