import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "./global.css";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-3xl text-red-400 font-regular">
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
