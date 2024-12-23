import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import AuthService from "../services/AuthService";
import * as SecureStore from "expo-secure-store";
import { StackActions } from "@react-navigation/native";

const SignInScreen = ({ navigation }) => {
  const authService = new AuthService();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    authService
      .login(data)
      .then((res) => {
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
    <View className="flex-1 bg-background">
      <ScrollView automaticallyAdjustKeyboardInsets>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={40}>
          <Image
            source={require("../assets/openingScreen/login.png")}
            className="w-full h-[300px]"
          />

          <View className="pt-10 px-6">
            <Text className="font-semibold text-3xl text-primary text-center">
              Welcome Back!
            </Text>
            <Text className="mt-1 font-regular text-lg text-center text-body">
              Sign in to continue your adventure.
            </Text>
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
                  className="mt-8 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
                />
              )}
            />
            {errors.email && (
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
                  className="mt-4 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
                />
              )}
            />
            <View className="flex-row justify-end items-center">
              {errors.password && (
                <Text className="flex-grow font-regular px-2 pt-2 text-secondary">
                  This field is required.
                </Text>
              )}
              <Text className="font-regular text-sm px-2 pt-2 self-end text-[#919191]">
                Forgot password?
              </Text>
            </View>

            <TouchableOpacity
              className="mx-auto w-72 py-4 mt-6  rounded-3xl bg-primary"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-center text-xl text-white font-bold">
                Sign in
              </Text>
            </TouchableOpacity>

            {/* Seperator */}
            <View className="mt-8 mb-6 flex-row items-center gap-4">
              <View className="flex-grow rounded-full border-[0.7px] border-[#B5B5B5]" />
              <Text className="font-regular text-sm text-[#B5B5B5]">
                Or sign in with
              </Text>
              <View className="flex-grow rounded-full border-[0.7px] border-[#B5B5B5]" />
            </View>

            {/* Social */}
            <View className="flex-row justify-center items-center gap-3">
              <TouchableOpacity className="p-2 bg-white rounded-full">
                <Image
                  source={require("../assets/icons/google_icon.png")}
                  className="w-10 h-10"
                />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-white rounded-full">
                <Image
                  source={require("../assets/icons/facebook_icon.png")}
                  className="w-10 h-10"
                />
              </TouchableOpacity>
            </View>

            <Text className="mt-4 font-regular text-lg text-body text-center">
              Don't have an account?{" "}
              <Text
                className="font-semibold text-primary"
                onPress={() => navigation.navigate("CreateAccount")}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default SignInScreen;
