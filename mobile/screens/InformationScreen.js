import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import StepWelcomeComponent from '../components/StepWelcomeComponent';
import StepDiscoverComponent from '../components/StepDiscoverComponent';
import StepCreateComponent from '../components/StepCreateComponent';
import StepShareComponent from '../components/StepShareComponent';

const InformationScreen = ({navigation}) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background">
       <ProgressSteps>
        <ProgressStep >
           <StepWelcomeComponent />
        </ProgressStep>
        <ProgressStep>
            <StepDiscoverComponent />
        </ProgressStep>
        <ProgressStep>
            <StepCreateComponent />
        </ProgressStep>
        <ProgressStep navigation={navigation}>
           <StepShareComponent />
        </ProgressStep>
    </ProgressSteps>
    </SafeAreaView>
  )
}

export default InformationScreen