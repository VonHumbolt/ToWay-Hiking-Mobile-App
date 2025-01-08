import { View, Modal, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

const CommentImageCarousel = ({ isOpen, closeModal, children, ...rest }) => {
  const content = (
    <View className="relative justify-center flex-1 px-6 bg-zinc-900/90">
      {/* Close Button */}
      <TouchableOpacity
        className="absolute top-20 right-8 rounded-full p-3 bg-primary z-10"
        onPress={closeModal}
      >
        <FontAwesomeIcon icon={faClose} color="white" size={20} />
      </TouchableOpacity>

      {/* Before and After Arrows */}
      <TouchableOpacity className="absolute left-4 rounded-full p-3 bg-primary z-10">
        <FontAwesomeIcon icon={faChevronLeft} color="white" size={20} />
      </TouchableOpacity>
      <TouchableOpacity className="absolute right-4 rounded-full p-3 bg-primary z-10">
        <FontAwesomeIcon icon={faChevronRight} color="white" size={20} />
      </TouchableOpacity>
      {children}
    </View>
  );
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      {...rest}
    >
      {content}
    </Modal>
  );
};

export default CommentImageCarousel;
