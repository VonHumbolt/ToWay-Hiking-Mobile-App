import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBicycle,
  faPersonBiking,
  faPersonHiking,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";

const RouteCreateForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {};

  return (
    <View>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={120}>
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

        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Add tag
        </Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="px-5 py-3 flex-row items-center gap-2 bg-primary rounded-full">
            <FontAwesomeIcon icon={faPersonHiking} size={20} color="white" />
            <Text className="font-regular text-white">Hiking</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-5 py-3 flex-row items-center gap-2 bg-[#E7E7E7] rounded-full">
            <FontAwesomeIcon icon={faBicycle} size={20} color="#919191" />
            <Text className="font-regular text-[#919191]">Cycling</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-5 py-3 flex-row items-center gap-2 bg-primary rounded-full">
            <FontAwesomeIcon icon={faPersonBiking} size={20} color="white" />
            <Text className="font-regular text-white">Mountain Biking</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-5 py-3 flex-row items-center gap-2 bg-primary rounded-full">
            <FontAwesomeIcon icon={faPersonRunning} size={20} color="white" />
            <Text className="font-regular text-white">Running</Text>
          </TouchableOpacity>
        </View>

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

        <Text className="text-xl font-semibold text-body mt-6 mb-3">
          Add highlights
        </Text>

        <View className="flex-row items-center gap-2">
          <Text className="text-xl font-semibold text-body mt-6 mb-3">
            Visibility
          </Text>
          <TouchableOpacity className="mt-3 px-5 py-3 bg-[#E7E7E7] rounded-full">
            <Text className="font-regular text-[#919191]">Public</Text>
          </TouchableOpacity>
        </View>
        <Text className="font-regular text-[#919191] text-sm mt-1">
          You can change this setting anytime from route settings.
        </Text>

        <TouchableOpacity className="py-3 px-8 rounded-full bg-primary mt-6">
          <Text className="text-white font-semibold text-lg text-center">Complete</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RouteCreateForm;
