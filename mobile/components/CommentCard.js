import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import getPastTimeFromDate from "../utils/getPastTimeFromDate";
import CommentImageCarousel from "./CommentImageCarousel";
import Slider from "./Slider";
import Carousel from "./Carousel";

const CommentCard = ({ comment }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View className="px-6 py-4 border-t border-[#E7E7E7]">
      <View className="flex-row items-center gap-4">
        <Image
          source={{ uri: comment.profilePicture }}
          className="w-16 h-16 rounded-full"
        />
        <View>
          <Text className="font-semibold text-lg">{comment.owner}</Text>
          <Text className="font-regular text-base text-[#919191]">
            {getPastTimeFromDate(comment.createdAt)}
          </Text>
        </View>
      </View>

      <Text className="my-4 font-regular text-body">
        {comment.commentMessage}
      </Text>

      {/* Images If exists*/}
      <TouchableOpacity
        className="flex-row items-center gap-2"
        onPress={() => setIsModalVisible(true)}
      >
        {comment.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            className="w-20 h-20 rounded-2xl"
          />
        ))}
      </TouchableOpacity>

      <CommentImageCarousel isOpen={isModalVisible} closeModal={closeModal}>
          <Carousel data={comment.images} />
      </CommentImageCarousel>
    </View>
  );
};

export default CommentCard;
