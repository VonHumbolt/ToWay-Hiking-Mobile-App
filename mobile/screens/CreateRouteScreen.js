import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import MapView, { Marker, Polyline } from "react-native-maps";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import convertMinuteToHour from "../utils/convertMinuteToHour";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as SecureStore from "expo-secure-store";
import {
  faCirclePlus,
  faBicycle,
  faCheck,
  faChevronDown,
  faPersonBiking,
  faPersonHiking,
  faPersonRunning,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import SelectDropdown from "react-native-select-dropdown";
import RouteService from "../services/RouteService";
import GeoNameService from "../services/GeoNameService";

const CreateRouteScreen = ({ route, navigation }) => {
  const { routeCoordinates, distance } = route.params;
  const [userId, setUserId] = useState("");
  const [startingPointCoordinate, setStartingPointCoordinate] = useState({});
  const [endPointCoordinate, setEndPointCoordinate] = useState({});
  const [routeImages, setRouteImages] = useState([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [categories, setCategories] = useState(["Hiking"]);
  const [imageFilesForUpload, setImageFilesForUpload] = useState([]);
  const [counrtyName, setCounrtyName] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("Beginner");
  const mapRef = useRef();

  const routeService = new RouteService();
  const geoNameService = new GeoNameService();

  useEffect(() => {
    setStartingPointCoordinate(routeCoordinates[0]);
    setEndPointCoordinate(routeCoordinates[routeCoordinates.length - 1]);

    getCountry(routeCoordinates[0].latitude, routeCoordinates[0].longitude);
    getItemFromSecureStore();
  }, []);

  const getItemFromSecureStore = () => {
    SecureStore.getItemAsync("userId").then((userId) => setUserId(userId));
  };

  const getCountry = (latitude, longitude) => {
    geoNameService
      .getCountryFromCoordinate(latitude, longitude)
      .then((res) => {
        if (res.status == 200) setCounrtyName(res.data.countryName);
      })
      .catch((err) => console.log(err));
  };

  const calculateAverageSpeed = () => {
    const km = distance / 1000;
    const hour = distance / 5000;

    return Math.round(km / hour);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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
    const imageArray = [];
    const fileArray = [];
    for (let i = 0; i < imageResult.assets.length; i++) {
      const element = imageResult.assets[i];
      const image = await resizeImage(element);
      const filename = image.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      imageArray.push(image.uri);
      fileArray.push({ uri: image.uri, name: filename, type });
    }
    setRouteImages([...routeImages, ...imageArray]);
    setImageFilesForUpload([...imageFilesForUpload, ...fileArray]);
    setIsImagesLoading(false);
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
    const newList = routeImages.filter((i) => i != image);
    setRouteImages([...newList]);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("ownerId", userId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("duration", Math.round((distance * 60) / 5000));
    formData.append("distance", distance);
    formData.append("country", counrtyName);
    formData.append("city", data.city);
    formData.append("level", difficultyLevel);
    formData.append("categories", JSON.stringify(categories));
    formData.append("coordinates", JSON.stringify(routeCoordinates));
    formData.append("isPublic", isPublic);
    // formData.append("importantPoints", JSON.stringify()) düzelt!

    for (let i = 0; i < imageFilesForUpload.length; i++) {
      formData.append("images[]", imageFilesForUpload[i]);
    }
    
    SecureStore.getItemAsync("token").then(token => {
      routeService
        .createRoute(formData, token)
        .then((res) => {
          if(res.status == 200)
            navigation.navigate("RouteDetail", { routeDetail: res.data })
        })
        .catch((err) => console.log(err.message));
    })
  };

  const isElementInCategories = (element) => {
    if (categories.includes(element)) return true;
    return false;
  };

  const addOrRemoveCategory = (category) => {
    if (isElementInCategories(category)) {
      const newArr = categories.filter((c) => c != category);
      setCategories([...newArr]);
    } else setCategories([...categories, category]);
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
              <Text className="font-regular text-lg text-body">Velocity </Text>
              <Text className="font-semibold text-primary text-xl">
                {calculateAverageSpeed()} km/h
              </Text>
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

        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Add name
        </Text>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Add name"
              autoCapitalize="words"
              clearButtonMode="always"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              className="px-4 py-4 border border-secondary rounded-3xl font-regular focus:border-primary focus:border-4"
            />
          )}
        />
        {errors.title && (
          <Text className="font-regular px-2 pt-2 text-secondaryDark">
            This field is required.
          </Text>
        )}
        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Add tag
        </Text>
        <View className="flex-wrap flex-row items-center gap-2">
          <TouchableOpacity
            className={`${
              isElementInCategories("Hiking")
                ? "bg-primary text-white"
                : "bg-[#E7E7E7]"
            }
            px-5 py-3 flex-row items-center gap-2 rounded-full`}
            onPress={() => addOrRemoveCategory("Hiking")}
          >
            <FontAwesomeIcon
              icon={faPersonHiking}
              size={20}
              color={isElementInCategories("Hiking") ? "white" : "#919191"}
            />
            <Text
              className={`${
                isElementInCategories("Hiking")
                  ? "text-white"
                  : "text-[#919191]"
              }
              font-regular`}
            >
              Hiking
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${
              isElementInCategories("Cycling")
                ? "bg-primary text-white"
                : "bg-[#E7E7E7]"
            }
            px-5 py-3 flex-row items-center gap-2 rounded-full`}
            onPress={() => addOrRemoveCategory("Cycling")}
          >
            <FontAwesomeIcon
              icon={faBicycle}
              size={20}
              color={isElementInCategories("Cycling") ? "white" : "#919191"}
            />
            <Text
              className={`${
                isElementInCategories("Cycling")
                  ? "text-white"
                  : "text-[#919191]"
              }
              font-regular`}
            >
              Cycling
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${
              isElementInCategories("Running")
                ? "bg-primary text-white"
                : "bg-[#E7E7E7]"
            }
            px-5 py-3 flex-row items-center gap-2 rounded-full`}
            onPress={() => addOrRemoveCategory("Running")}
          >
            <FontAwesomeIcon
              icon={faPersonRunning}
              size={20}
              color={isElementInCategories("Running") ? "white" : "#919191"}
            />
            <Text
              className={`${
                isElementInCategories("Running")
                  ? "text-white"
                  : "text-[#919191]"
              }
              font-regular`}
            >
              Running
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${
              isElementInCategories("Mountain Biking")
                ? "bg-primary text-white"
                : "bg-[#E7E7E7]"
            }
            px-5 py-3 flex-row items-center gap-2 rounded-full`}
            onPress={() => addOrRemoveCategory("Mountain Biking")}
          >
            <FontAwesomeIcon
              icon={faPersonBiking}
              size={20}
              color={
                isElementInCategories("Mountain Biking") ? "white" : "#919191"
              }
            />
            <Text
              className={`${
                isElementInCategories("Mountain Biking")
                  ? "text-white"
                  : "text-[#919191]"
              }
              font-regular`}
            >
              Mountain Biking
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Difficulty level
        </Text>
        <SelectDropdown
          data={["Beginner", "Intermediate", "Hard", "Extreme"]}
          onSelect={(selectedItem, index) => {
            setDifficultyLevel(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <TouchableOpacity className="flex-row items-center gap-2 mt-3 px-5 py-3 bg-[#E7E7E7] rounded-full">
                <Text className="flex-grow font-regular text-[#919191]">
                  {(selectedItem && selectedItem) || "Beginner"}
                </Text>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  size={12}
                  color="#B5B5B5"
                />
              </TouchableOpacity>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View className="px-5 py-2">
                <Text className="font-regular text-lg">
                  {isSelected ? (
                    <Text>
                      {" "}
                      {item} <FontAwesomeIcon icon={faCheck} size={12} />{" "}
                    </Text>
                  ) : (
                    item
                  )}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={{
            borderRadius: 6,
            width: "90%",
            paddingVertical: 8,
            paddingHorizontal: 2,
          }}
        />

        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Description
        </Text>
        <Controller
          name="description"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Please something write about your route"
              autoCapitalize="sentences"
              clearButtonMode="always"
              multiline={true}
              numberOfLines={5}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              className="px-4 py-4 h-40 border border-secondary rounded-3xl font-regular focus:border-primary focus:border-4"
            />
          )}
        />
        {errors.description && (
          <Text className="font-regular px-2 pt-2 text-secondaryDark">
            This field is required.
          </Text>
        )}

        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Add city
        </Text>
        <Controller
          name="city"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="In which city is this route located?"
              autoCapitalize="words"
              clearButtonMode="always"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              className="px-4 py-4 border border-secondary rounded-3xl font-regular focus:border-primary focus:border-4"
            />
          )}
        />
        {errors.city && (
          <Text className="font-regular px-2 pt-2 text-secondaryDark">
            This field is required.
          </Text>
        )}

        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Add highlights
        </Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            placeholder="Highlight - 1"
            autoCapitalize="words"
            clearButtonMode="always"
            className="flex-grow px-4 py-4 border border-secondary rounded-3xl font-regular focus:border-primary focus:border-4"
          />
          <FontAwesomeIcon icon={faTrashCan} size={22} color="#919191" />
        </View>

        <View className="flex-row items-center gap-2 mt-2">
          <Text className="text-xl font-semibold text-body mt-6 mb-3">
            Visibility
          </Text>
          <SelectDropdown
            data={["Public", "Private"]}
            onSelect={(selectedItem, index) => {
              if (selectedItem == "Public") setIsPublic(true);
              else setIsPublic(false);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <TouchableOpacity className="flex-row items-center gap-2 mt-3 px-5 py-3 bg-[#E7E7E7] rounded-full">
                  <Text className="font-regular text-[#919191]">
                    {(selectedItem && selectedItem) || "Public"}
                  </Text>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    size={12}
                    color="#B5B5B5"
                  />
                </TouchableOpacity>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View className="px-5 py-2">
                  <Text className="font-regular text-lg">
                    {isSelected ? (
                      <Text>
                        {" "}
                        {item} <FontAwesomeIcon icon={faCheck} size={12} />{" "}
                      </Text>
                    ) : (
                      item
                    )}
                  </Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={{
              borderRadius: 6,
              width: 130,
              paddingVertical: 8,
              paddingHorizontal: 2,
            }}
          />
        </View>
        <Text className="font-regular text-[#919191] text-sm mt-1">
          You can change this setting anytime from route settings.
        </Text>

        <TouchableOpacity
          className="py-3 px-8 rounded-full bg-primary mt-6"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-semibold text-lg text-center">
            Complete
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRouteScreen;
