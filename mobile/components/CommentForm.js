import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import CommentService from "../services/CommentService";
import * as SecureStore from "expo-secure-store";
import { StackActions, useNavigation } from "@react-navigation/native";

const CommentForm = ({ routeId }) => {
  const navigation = useNavigation();

  const [commentImages, setCommentImages] = useState([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [imageFilesForUpload, setImageFilesForUpload] = useState([]);
  const [comment, setComment] = useState("");

  const commentService = new CommentService();

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
    setCommentImages([...commentImages, ...imageArray]);
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

  const addComment = () => {
    if (comment.trim().length > 0) {
      // add comment
      const formData = new FormData();
      formData.append("routeId", routeId);
      formData.append("commentMessage", comment);
      for (let i = 0; i < imageFilesForUpload.length; i++) {
        formData.append("images[]", imageFilesForUpload[i]);
      }

      SecureStore.getItemAsync("userId").then((userId) => {
        SecureStore.getItemAsync("token").then((token) => {
          formData.append("userId", userId);

          commentService
            .addComment(formData, token)
            .then((res) => {
              if (res.status == 200) {
                navigation.dispatch(StackActions.replace("TabNavigation"));
              }
            })
            .catch((err) => console.log(err.message));
        });
      });
    } else {
      navigation.dispatch(StackActions.replace("TabNavigation"));
    }
  };

  return (
    <View>
      <Text className="text-xl font-semibold text-body">
        Do you write a comment?{" "}
        <Text className="text-[#919191]">(optional) </Text>
      </Text>
      <Text className="text-base font-regular text-[#919191] mt-1 mb-3">
        If you are write a comment about the route. Other users can read and
        they learn your ideas about the route.
      </Text>
      <View className="px-2">
        <Text className="font-semibold text-body text-lg pb-2">
          Attach images for comment
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="w-screen"
        >
          {isImagesLoading && (
            <ActivityIndicator size="large" color="#A5D936" />
          )}
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={pickImage}
          >
            {commentImages.length > 0 ? (
              commentImages.map((image, index) => (
                <Image
                  key={index}
                  source={{
                    uri: image,
                  }}
                  className="w-96 h-52 rounded-2xl"
                />
              ))
            ) : (
              <Image
                source={{
                  uri: "https://res.cloudinary.com/dspea8wm4/image/upload/v1735559681/default_add_image_xgjsqt.jpg",
                }}
                className="w-screen h-52 rounded-2xl"
              />
            )}
          </TouchableOpacity>
        </ScrollView>

        <Text className="font-semibold text-body text-lg pt-3 pb-1">
          Write your comment
        </Text>
        <TextInput
          placeholder="Please something write about your route"
          autoCapitalize="sentences"
          clearButtonMode="always"
          multiline={true}
          numberOfLines={5}
          onChangeText={(e) => setComment(e)}
          className="px-4 py-4 h-40 border border-[#919191]/70 rounded-2xl font-regular focus:border-primary focus:border-4"
        />
      </View>

      <TouchableOpacity className="rounded-full px-6 py-4 bg-primary mt-4" onPress={addComment}>
        <Text className="text-xl font-semibold text-white text-center">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommentForm;
