import React, { useEffect, useState, useCallback } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

const Header = ({ tag, selectedDate, setShowCalendar, showCalendar }) => {

    const parseDateString = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dec',
        ];

        const month = months[monthIndex];

        return `${day} ${month}, ${year}`;
    };

    return (
        <>
            <View className="h-[60px] flex flex-row justify-between items-center px-4 bg-white border-b-0.5 border-gray-200 w-full top-0 sticky">
                <Text className="text-xl font-black">Events.SR</Text>
                {/* <View className="flex flex-row gap-4">
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M6 12H18M3 6H21M9 18H15" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>

                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M15.0505 9H5.5C4.11929 9 3 7.88071 3 6.5C3 5.11929 4.11929 4 5.5 4H15.0505M8.94949 20H18.5C19.8807 20 21 18.8807 21 17.5C21 16.1193 19.8807 15 18.5 15H8.94949M3 17.5C3 19.433 4.567 21 6.5 21C8.433 21 10 19.433 10 17.5C10 15.567 8.433 14 6.5 14C4.567 14 3 15.567 3 17.5ZM21 6.5C21 8.433 19.433 10 17.5 10C15.567 10 14 8.433 14 6.5C14 4.567 15.567 3 17.5 3C19.433 3 21 4.567 21 6.5Z" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            </View> */}

                {tag == "map" && <View>
                    <TouchableOpacity className="px-4 py-1 bg-gray-100 rounded-md" onPress={() => { setShowCalendar(!showCalendar) }}><Text className="text-xl">{parseDateString(selectedDate)}</Text></TouchableOpacity>
                </View>}
            </View >
        </>
    )
}

export default Header