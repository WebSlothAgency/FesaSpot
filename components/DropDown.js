import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Path, Svg } from 'react-native-svg'

const DropDown = ({ options, selectedOption, setSelectedOption }) => {
    const [open, setOpen] = useState(false)

    return (
        <View className="w-full flex flex-col h-fit border-0.5 border-[#EAECF0] rounded-md mt-2">
            <TouchableOpacity onPress={() => setOpen(!open)} className="p-4 flex flex-row items-center justify-between">
                <Text className="text-gray-900 font-medium">{selectedOption}</Text>
                {!open && <Svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M1 1.5L6 6.5L11 1.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>}

                {open && <Svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M11 6L6 1L1 6" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>}
            </TouchableOpacity>
            {open && <View className="relative w-full h-fit border-0.5 border-[#EAECF0] rounded-md">
                {options.map(option => {
                    if (option != selectedOption) {
                        return <TouchableOpacity className="p-4" onPress={() => { setSelectedOption(option); setOpen(false) }}>
                            <Text className="text-gray-900 font-medium">{option}</Text>
                        </TouchableOpacity>
                    }
                })}
            </View>}
        </View>
    )
}

export default DropDown