import React from 'react'
import { View, Text } from 'react-native'

const EventDescriptionTag = ({text}) => {
    return (
        <View className="w-fit mx-1 px-2 py-0.5 bg-gray-50 border-2 border-gray-200 rounded-full">
            <Text className="text-gray-500 font-medium">{text}</Text>
        </View>
    )
}

export default EventDescriptionTag