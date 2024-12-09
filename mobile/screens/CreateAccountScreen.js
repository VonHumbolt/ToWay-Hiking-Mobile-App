import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";

const CreateAccountScreen = ({navigation}) => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView automaticallyAdjustKeyboardInsets>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
          <View className="pt-10 px-6">
            <Text className="font-semibold text-3xl text-body">
              Create Account
            </Text>
            <Text className="mt-1 font-regular text-lg text-body">
              Already have an account?{" "}
              <Text className="font-semibold text-primary">Sign in</Text>
            </Text>
            <TextInput
              placeholder="Full Name"
              autoCapitalize="words"
              clearButtonMode="always"
              className="mt-12 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
            />
            <TextInput
              placeholder="Country"
              clearButtonMode="always"
              className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
            />
            <TextInput
              placeholder="City"
              clearButtonMode="always"
              className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
            />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              clearButtonMode="always"
              className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
            />
            <View className="mt-5 flex flex-row group">
              <TextInput
                defaultValue="+90 |"
                editable={false}
                className=" px-3 py-4 border border-r-0 border-secondary rounded-2xl rounded-r-none font-regular
                group-focus-within:border-primary group-focus-within:border-4"
              />
              <TextInput
                placeholder="5** "
                keyboardType="number-pad"
                clearButtonMode="always"
                maxLength={10}
                className="flex-grow px-3 py-4 border border-l-0 border-secondary rounded-2xl rounded-l-none font-regular
                group-focus-within:border-primary group-focus-within:border-4"
              />
            </View>

            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              clearButtonMode="always"
              className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
            />

            <TouchableOpacity className="mt-12 p-4 rounded-3xl bg-primary"
            onPress={() => navigation.navigate("Home")}>
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
