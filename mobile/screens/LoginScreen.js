import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const LoginScreen = ({navigation}) => {
  return (
    <View className="flex-1 justify-center items-center bg-background pt-44">
      <Image source={require("../assets/logo.png")} className="w-96 h-36" />

      <View className="w-full px-6 mt-32">
        <TouchableOpacity className="p-4 rounded-3xl bg-primary" onPress={() => navigation.navigate("CreateAccount")}>
          <Text className="text-center text-xl text-white font-bold">
            Create Account
          </Text>
        </TouchableOpacity>

        <Text className="mt-6 text-center text-xl text-body font-semibold">or</Text>

        <TouchableOpacity className="mt-6 p-3 flex flex-row justify-center gap-2 items-center rounded-3xl border border-body">
          <Image
            source={require("../assets/icons/google_icon.png")}
            className="w-7 h-7"
          />
          <Text className="text-center text-lg text-body font-semibold">
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-4 p-3 flex flex-row justify-center gap-2 items-center rounded-3xl border border-body">
          <Image
            source={require("../assets/icons/facebook_icon.png")}
            className="w-7 h-7"
          />
          <Text className="text-center text-lg text-body font-semibold">
            Continue with Facebook
          </Text>
        </TouchableOpacity>

        <Text className="mt-8 text-xl text-secondary underline text-center font-semibold" onPress={() => navigation.navigate("SignIn")}>
          Sign in
        </Text>
        <Text className="mt-8 text-base text-gray-500 text-center font-regular">
          By continuing you agree to ToWay’s{" "}
          <Text className="underline">Terms of Service </Text>
            and{" "}
          <Text className="underline">Privacy Policy</Text>
          .
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
