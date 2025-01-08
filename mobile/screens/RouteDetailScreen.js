import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Slider from "../components/Slider";
import CommentComponent from "../components/CommentComponent";
import RouteDetailComponent from "../components/RouteDetailComponent";

const RouteDetailScreen = ({ route, navigation }) => {
  const { routeDetail } = route.params;
  const [isCommentComponent, setIsCommentComponent] = useState(false);

  const goToComments = () => {
    setIsCommentComponent(true);
  };

  const goToRouteDetail = () => {
    setIsCommentComponent(false);
  };

  return (
    <View className="flex-1 relative">
      {/* Image Slider */}
      <Slider data={routeDetail?.images} />

      <ScrollView className="rounded-t-[30px] z-20 bg-background absolute top-80 bottom-0 w-full pt-6">
        {isCommentComponent ? (
          <CommentComponent routeId={routeDetail?._id} numberOfCompletions={routeDetail?.numberOfCompletions} goToRouteDetail={goToRouteDetail} />
        ) : (
          <RouteDetailComponent
            routeDetail={routeDetail}
            goToComments={goToComments}
          />
        )}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
};

export default RouteDetailScreen;
