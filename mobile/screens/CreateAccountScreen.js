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
import { useForm, Controller } from "react-hook-form";
import AuthService from "../services/AuthService";
import { StackActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const CreateAccountScreen = ({ navigation }) => {
  const authService = new AuthService();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
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
    SecureStore.setItemAsync("userId", data._id);
    SecureStore.setItemAsync("email", data.email);
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
              <Text className="font-semibold text-primary">Sign in</Text>
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
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Country"
                  clearButtonMode="always"
                  autoCapitalize="words"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
                />
              )}
            />
            {errors.country && (
              <Text className="font-regular px-2 pt-2 text-secondary">
                This field is required.
              </Text>
            )}
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="City"
                  clearButtonMode="always"
                  autoCapitalize="words"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  className="mt-5 px-3 py-4 border border-secondary rounded-2xl font-regular focus:border-primary focus:border-4"
                />
              )}
            />
            {errors.city && (
              <Text className="font-regular px-2 pt-2 text-secondary">
                This field is required.
              </Text>
            )}
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
                className=" px-3 py-4 border border-r-0 border-secondary rounded-2xl rounded-r-none font-regular
                group-focus-within:border-primary group-focus-within:border-4"
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
                    className="flex-grow px-3 py-4 border border-l-0 border-secondary rounded-2xl rounded-l-none font-regular
                group-focus-within:border-primary group-focus-within:border-4"
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
