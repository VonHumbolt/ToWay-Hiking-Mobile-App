import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBicycle,
  faCheck,
  faChevronDown,
  faPersonBiking,
  faPersonHiking,
  faPersonRunning,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import SelectDropdown from "react-native-select-dropdown";

const RouteCreateForm = () => {
  const [categories, setCategories] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {};

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
            <Text className={`${
                isElementInCategories("Cycling")
                  ? "text-white"
                  : "text-[#919191]"
              }
              font-regular`}>Cycling</Text>
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
            <Text className={`${
                isElementInCategories("Running")
                  ? "text-white"
                  : "text-[#919191]"
              }
              font-regular`}>Running</Text>
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
            <Text className={`${
                isElementInCategories("Mountain Biking")
                  ? "text-white"
                  : "text-[#919191]"
              }
              font-regular`}>Mountain Biking</Text>
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
            onSelect={(selectedItem, index) => {}}
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

        <TouchableOpacity className="py-3 px-8 rounded-full bg-primary mt-6">
          <Text className="text-white font-semibold text-lg text-center">
            Complete
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RouteCreateForm;
