import React, { useState, useRef, useEffect } from "react";
import { View, Text } from "react-native";

const StopWatch = ({isStopWatchRunning}) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isStopWatchRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Math.floor(Date.now() - startTimeRef.current));
      }, 10);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isStopWatchRunning]);

  const formatTime = () => {
    let hours = Math.floor(time / (1000 * 60 * 60));
    let minutes = Math.floor((time / (1000 * 60)) % 60);
    let seconds = Math.floor((time / 1000) % 60);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <View className="w-28 items-center">
      <Text className="font-semibold text-2xl">
        {formatTime()}
      </Text>
    </View>
  );
};

export default StopWatch;
