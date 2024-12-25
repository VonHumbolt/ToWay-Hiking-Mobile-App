import { Text, View, Button,SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTrackingStore } from '../store';
import MiniTrackingBar from '../components/MiniTrackingBar';

const ProfileScreen = () => {
      const { tracking } = useTrackingStore();
  
  return (
    <SafeAreaView className="flex-1 relative bg-background mb-28 justify-center items-center">
      {tracking && <MiniTrackingBar />}
    </SafeAreaView>
  )
}

export default ProfileScreen