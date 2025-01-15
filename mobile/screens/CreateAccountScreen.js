import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AuthService from "../services/AuthService";
import { StackActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SelectDropdown from "react-native-select-dropdown";
import CountryService from "../services/CountryService";

const CreateAccountScreen = ({ navigation }) => {
  const authService = new AuthService();
  const countryService = new CountryService()

  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [countryName, setCountryName] = useState("")
  const [cityName, setCityName] = useState("")

  useEffect(() => {
    getAllCountries()
  }, [])
  
  const getAllCountries = () => {
    countryService.getallCountries().then(res => setCountries(res.data))
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    data.country = countryName
    data.city = cityName
    authService
      .register(data)
      .then((res) => {
        console.log(res.data);
        console.log(res.status);
        if (res.status == 200) setUserCredentials(res.data);
        navigation.dispatch(StackActions.replace("TabNavigation"));
      })
      .catch((error) => console.log(error));
  };

  const setUserCredentials = (data) => {
    SecureStore.setItemAsync("token", data.token);
    SecureStore.setItemAsync("userId", data.userId);
    SecureStore.setItemAsync("email", data.email);
    SecureStore.setItemAsync("city", data.city);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView automaticallyAdjustKeyboardInsets>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={60}>
          <View className="pt-10 px-6">
            <Text className="font-semibold text-3xl text-body">
              Create Account
            </Text>
            <Text className="mt-1 font-regular text-lg text-body">
              Already have an account?{" "}
              <Text className="font-semibold text-primary" onPress={() => navigation.navigate("SignIn")}>Sign in</Text>
            </Text>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Full Name"
                  autoCapitalize="words"
                  clearButtonMode="always"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="mt-12 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
                />
              )}
            />
            {errors.fullName && (
              <Text className="font-regular px-2 pt-2 text-secondary">
                This field is required.
              </Text>
            )}
            <SelectDropdown
              data={countries}
              onSelect={(selectedItem, index) => {
                setCountryName(selectedItem.name)
                setCities(selectedItem.cities)
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <TouchableOpacity className="flex-row items-center justify-between rounded-2xl mt-5 px-3 py-4 border border-secondary font-regular focus:border-primary focus:border-4">
                    <Text className="font-regular text-[#919191]">
                      {(selectedItem && <Text className="font-regular text-body">{selectedItem.name}</Text>) || "Country"}
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
                          {item.name} <FontAwesomeIcon icon={faCheck} size={12} />{" "}
                        </Text>
                      ) : (
                        item.name
                      )}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                borderRadius: 6,
                height: 250,
                paddingVertical: 8,
                paddingHorizontal: 2,
              }}
            />
            
            <SelectDropdown
              data={cities}
              onSelect={(selectedItem, index) => {
                setCityName(selectedItem)
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <TouchableOpacity className="flex-row items-center justify-between rounded-2xl mt-5 px-3 py-4 border border-secondary font-regular focus:border-primary focus:border-4">
                    <Text className="font-regular text-[#919191]">
                      {(selectedItem && <Text className="font-regular text-body">{selectedItem}</Text>) || "City"}
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
                height: 250,
                paddingVertical: 8,
                paddingHorizontal: 2,
              }}
            />
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  clearButtonMode="always"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
                />
              )}
            />
            {errors.email && (
              <Text className="font-regular px-2 pt-2 text-secondary">
                This field is required.
              </Text>
            )}

            <View className="mt-5 flex flex-row group">
              <TextInput
                defaultValue="+90 |"
                editable={false}
                className=" px-3 py-4 border border-r-0 border-secondary rounded-2xl rounded-r-none font-regular"
              />
              <Controller
                name="phoneNumber"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="5** "
                    keyboardType="number-pad"
                    clearButtonMode="always"
                    maxLength={10}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    className="flex-grow px-3 py-4 border border-l-0 border-secondary rounded-2xl rounded-l-none font-regular"
                  />
                )}
              />
            </View>
            {errors.phoneNumber && (
              <Text className="font-regular px-2 pt-2 text-secondary">
                This field is required.
              </Text>
            )}

            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Password"
                  secureTextEntry={true}
                  clearButtonMode="always"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
                />
              )}
            />
            {errors.password && (
              <Text className="font-regular px-2 pt-2 text-secondary">
                This field is required.
              </Text>
            )}

            <TouchableOpacity
              className="mt-12 p-4 rounded-3xl bg-primary"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-center text-xl text-white font-bold">
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;
