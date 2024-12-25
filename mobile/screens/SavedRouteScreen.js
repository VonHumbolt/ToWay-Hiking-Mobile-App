import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useTrackingStore } from '../store';
import MiniTrackingBar from '../components/MiniTrackingBar';

const SavedRouteScreen = () => {
    const { tracking } = useTrackingStore();
  
  return (
    <SafeAreaView className="flex-1 relative bg-background mb-28">
      <Text>SavedRouteScreen</Text>
      {tracking && <MiniTrackingBar />}
    </SafeAreaView>
  )
}

export default SavedRouteScreen