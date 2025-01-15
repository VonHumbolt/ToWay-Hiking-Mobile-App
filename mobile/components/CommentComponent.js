import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CommentService from "../services/CommentService";
import * as SecureStore from "expo-secure-store";
import CommentCard from "./CommentCard";

const CommentComponent = ({
  routeId,
  numberOfCompletions,
  goToRouteDetail,
}) => {
  const commentService = new CommentService();

  const [comments, setComments] = useState([]);
  const [illustratedCommentsCount, setIllustratedCommentsCount] = useState(0);
  const [isAllCommentsTabActive, setIsAllCommentsTabActive] = useState(true);

  useEffect(() => {
    getCommentsByRouteId();
    numberOfIllustratedComments();
  }, []);

  const getCommentsByRouteId = () => {
    SecureStore.getItemAsync("token").then((token) => {
      commentService
        .getCommentsByRouteId(routeId, token)
        .then((res) => {
          if (res.status == 200) setComments(res.data.comments);
        })
        .catch((error) => console.log(error));
    });
  };

  const getCommentsThatIncludesImage = () => {
    SecureStore.getItemAsync("token").then((token) => {
      commentService
        .getCommentsThatIncludesImage(routeId, token)
        .then((res) => {
          if (res.status == 200) setComments(res.data.comments);
        })
        .catch((error) => console.log(error));
    });
  };

  const numberOfIllustratedComments = () => {
    SecureStore.getItemAsync("token").then((token) => {
      commentService
        .numberOfIllustratedComments(routeId, token)
        .then((res) => {
          if (res.status == 200)
            setIllustratedCommentsCount(res.data.numberOfComments);
        })
        .catch((error) => console.log(error));
    });
  };

  const openIllustratedCommentTab = () => {
    setIsAllCommentsTabActive(false);
    getCommentsThatIncludesImage();
  };
  const openAllCommentsTab = () => {
    setIsAllCommentsTabActive(true);
    getCommentsByRouteId();
  };

  return (
    <View className="mb-6">
      <View className="px-6 flex-row items-center gap-4">
        <TouchableOpacity
          className="p-2 rounded-full bg-[#E7E7E7]"
          onPress={goToRouteDetail}
        >
          <FontAwesomeIcon icon={faArrowLeft} color="#B5B5B5" size={18} />
        </TouchableOpacity>
        <Text className="font-semibold text-2xl text-body">Comments</Text>
      </View>

      <Text className="px-6 mt-5 font-regular text-lg">
        <Text className="text-primary font-bold">{numberOfCompletions} </Text>
        ToWay users have experinced this trail!
      </Text>

      <View className="px-6 flex-row items-center gap-2 mt-4">
        <TouchableOpacity
          className={`${
            isAllCommentsTabActive ? "bg-primary" : "bg-[#E7E7E7]"
          } rounded-full px-6 py-3`}
          onPress={() => openAllCommentsTab()}
        >
          <Text
            className={`${
              isAllCommentsTabActive ? "text-white" : "text-body"
            } font-regular`}
          >
            All ({comments?.length}){" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            !isAllCommentsTabActive ? "bg-primary" : "bg-[#E7E7E7]"
          } rounded-full px-6 py-3`}
          disabled={illustratedCommentsCount?.length === 0}
          onPress={() => openIllustratedCommentTab()}
        >
          <Text
            className={`${
              !isAllCommentsTabActive ? "text-white" : "text-body"
            } font-regular`}
          >
            Photo Review ({illustratedCommentsCount}){" "}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments */}
      <View className="mt-6">
        {comments?.map((comment) => (
          <CommentCard key={(comment.commentId)} comment={comment} />
        ))}
      </View>
    </View>
  );
};

export default CommentComponent;
