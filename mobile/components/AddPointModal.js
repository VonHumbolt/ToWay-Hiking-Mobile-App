import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronDown,
  faCirclePlus,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import SelectDropdown from "react-native-select-dropdown";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import RouteService from "../services/RouteService";

const pointTypes = [
  {
    icon: require("../assets/icons/panorama_icon.png"),
    name: "Panorama",
  },
  {
    icon: require("../assets/icons/camp_icon.png"),
    name: "Campground",
  },
  {
    icon: require("../assets/icons/park_icon.png"),
    name: "Park",
  },
  {
    icon: require("../assets/icons/cave_icon.png"),
    name: "Cave",
  },
];

const AddPointModal = ({ routeId, isOpen, closeModal, returnPoint }) => {
  const [routeImages, setRouteImages] = useState([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [imageFilesForUpload, setImageFilesForUpload] = useState([]);
  const [selectedPointType, setSelectedPointType] = useState("");
  const [description, setDescription] = useState("");

  const routeService = new RouteService();

  const removeImageFromList = (image) => {
    const newList = routeImages.filter((i) => i != image);
    setRouteImages([...newList]);
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

  const addPoint = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    if (selectedPointType.trim().length > 0) {
      const formData = new FormData();
      formData.append("routeId", routeId);
      formData.append("coordinate", JSON.stringify(coords));
      formData.append("description", description);
      formData.append("pointType", selectedPointType);
      for (let i = 0; i < imageFilesForUpload.length; i++) {
        formData.append("images[]", imageFilesForUpload[i]);
      }

      SecureStore.getItemAsync("token").then((token) => {
        routeService
          .addPointToRoute(formData, token)
          .then((res) => {
            if (res.status == 200) returnPoint(res.data);
          })
          .catch((err) => console.log(err.message));
      });
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpen}
      presentationStyle="pageSheet"
      onRequestClose={() => {
        closeModal();
      }}
    >
      <View className="px-6 pt-4 bg-background h-full">
        <View className="flex-row justify-end items-center">
          {/* <Text className="font-semibold text-2xl text-body">Add Point</Text> */}
          <TouchableOpacity className="" onPress={() => closeModal()}>
            <FontAwesomeIcon icon={faClose} color="#5F5F5F" size={40} />
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-lg font-semibold text-body mb-3 mt-5">
            Add image <Text className="text-[#919191]"> (optional) </Text>
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

        <Text className="mt-10 text-lg font-semibold text-body mb-3">
          Point Type
        </Text>
        <SelectDropdown
          data={pointTypes}
          onSelect={(selectedItem, index) => {
            setSelectedPointType(selectedItem.name);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <TouchableOpacity className=" flex-row items-center gap-2 px-5 py-4 bg-[#E7E7E7] rounded-full">
                {(selectedItem && (
                  <View className="flex-grow flex-row items-center gap-3">
                    <Image source={selectedItem.icon} className="w-8 h-8" />
                    <Text className="font-regular text-[#5F5F5F]">
                      {selectedItem.name}
                    </Text>
                  </View>
                )) || (
                  <Text className="flex-grow font-regular text-[#919191]">
                    Select point type
                  </Text>
                )}

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
              <View
                className={`px-5 py-2 flex-row items-center gap-3 ${
                  index != 0 ? "border-t-2 border-[#E7E7E7]" : "border-none"
                }`}
              >
                <Image source={item.icon} className="w-12 h-12" />
                <Text className="font-regular text-lg text-[#5F5F5F]">
                  {item.name}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={{
            borderRadius: 16,
            width: "90%",
            paddingVertical: 8,
            paddingHorizontal: 2,
          }}
        />

        <Text className="text-lg font-semibold text-body mt-10 mb-3">
          Description <Text className="text-[#919191]"> (optional) </Text>
        </Text>
        <TextInput
          placeholder="Please something write about the point"
          autoCapitalize="sentences"
          clearButtonMode="always"
          multiline={true}
          numberOfLines={8}
          onChangeText={(e) => setDescription(e)}
          className="px-4 py-4 h-52 bg-[#E7E7E7]  rounded-3xl font-regular focus:border-primary focus:border-4"
        />

        <TouchableOpacity
          className="rounded-full px-6 py-4 bg-primary mt-12"
          onPress={addPoint}
        >
          <Text className="text-xl font-semibold text-white text-center">
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AddPointModal;
