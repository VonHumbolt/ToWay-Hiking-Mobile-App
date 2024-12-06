import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import WelcomeComponent from '../components/WelcomeComponent';

const InformationScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background">
       <ProgressSteps>
        <ProgressStep >
           <WelcomeComponent />
        </ProgressStep>
        <ProgressStep>
            <View style={{ alignItems: 'center' }}>
                <Text>This is the content within step 2!</Text>
            </View>
        </ProgressStep>
        <ProgressStep>
            <View style={{ alignItems: 'center' }}>
                <Text>This is the content within step 3!</Text>
            </View>
        </ProgressStep>
        <ProgressStep>
            <View style={{ alignItems: 'center' }}>
                <Text>This is the content within step 3!</Text>
            </View>
        </ProgressStep>
    </ProgressSteps>
    </SafeAreaView>
  )
}

export default InformationScreen