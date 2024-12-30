import { View, Text, Modal } from 'react-native'
import React from 'react'

const RouteCompletedModal = ({isOpen, children, ...rest }) => {
    const content = (
        <View className="items-center justify-center flex-1 px-6 bg-zinc-900/40">
            {children}
        </View>
    )
  return (
    <Modal 
        visible={isOpen}
        transparent
        animationType='fade'
        statusBarTranslucent
        {...rest}
    >
        {content}
    </Modal>
  )
}

export default RouteCompletedModal