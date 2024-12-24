import { View, Image } from 'react-native'
import React from 'react'

const SliderItem = ({item}) => {
  return (
    <View className="w-screen">
      <Image source={{uri: item}} className="w-full h-96" />
    </View>
  )
}

export default SliderItem