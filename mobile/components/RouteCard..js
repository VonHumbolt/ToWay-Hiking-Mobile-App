import { View, Text, Image } from 'react-native'
import React from 'react'

const RouteCard = ({route}) => {
  return (
    <View className="rounded-3xl bg-white mb-5">
      <Image source={{uri: route?.images[0] }} className="w-full h-52 rounded-t-3xl" />
      <View className="px-3 py-3">
        <Text className="font-semibold text-lg text-body">{route?.title}</Text>
        <Text className="font-regular text-base text-body">{route?.title}</Text>
      </View>
    </View>
  )
}

export default RouteCard