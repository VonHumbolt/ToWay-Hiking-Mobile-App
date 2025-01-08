import { View, Image } from 'react-native'
import React from 'react'

const CarouselItem = ({item}) => {
  return (
    <View className="w-96 mx-6">
        <Image source={{uri: item}} className="w-96 h-96 rounded-3xl" />
    </View>
  )
}

export default CarouselItem