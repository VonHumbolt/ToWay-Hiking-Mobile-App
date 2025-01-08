import { View, Text, FlatList } from 'react-native'
import React from 'react'
import CarouselItem from './CarouselItem'

const Carousel = ({data}) => {
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <CarouselItem key={index} item={item} index={index} />
        )}
        keyExtractor={(_, index) => {
          return (
            index
          )
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
      />
      
    </View>
  )
}

export default Carousel