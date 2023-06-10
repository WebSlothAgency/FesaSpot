import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StatusBar as SB, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, Linking, ScrollView, Image, Platform } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import EventDescriptionTag from './EventDescriptionTag';

const Event = ({ data }) => {
    let navigation = useNavigation()

    function isCurrentDateOlderThan(targetDate) {
        const currentDate = new Date();
        const targetDateTime = new Date(targetDate);

        return currentDate > targetDateTime;
    }

    let opacity = "mt-3 " + (isCurrentDateOlderThan(data.endDate) ? "opacity-100" : "")

    function sortByTagLength(arr) {
        return arr.sort((a, b) => a.tag.length - b.tag.length);
    }

    let tags = sortByTagLength([...data.tags])

    function truncateText(text) {
        const maxLength = Platform.OS == "android" ? 100 : 150;

        // Split the text into sentences
        let sentences = text.split(/[.!?]/);

        // Remove any empty sentences
        sentences = sentences.filter(sentence => sentence.trim() !== '');

        let truncatedText = '';
        let currentLength = 0;

        // Iterate through the sentences until the maximum length is reached
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            const sentenceLength = sentence.length;

            // Check if adding the current sentence exceeds the maximum length
            if (currentLength + sentenceLength <= maxLength) {
                truncatedText += sentence.trim() + '. ';
                currentLength += sentenceLength;

                // Check if adding the current sentence exceeds the maximum length with ".."
                if (currentLength + 2 > maxLength) {
                    truncatedText += '..';
                    break;
                }
            } else {
                // If adding the current sentence exceeds the maximum length, truncate it and add ".."
                const remainingLength = maxLength - currentLength;
                truncatedText += sentence.substring(0, remainingLength).trim() + '..';
                break;
            }
        }

        return truncatedText.trim();
    }

    return (
        <TouchableOpacity onPress={() => navigation.navigate('Event', { eventID: data.id })} className={opacity}>
            <View className="w-full border-0.5 p-4 border-gray-300 rounded-2xl h-fit">
                <View className="flex w-full flex-row">
                    <View className="h-[96px] aspect-[3/4] overflow-hidden flex justify-center items-center rounded-lg bg-white">
                        <Image className="w-full h-full" source={{ uri: data.banner.url }}></Image>
                    </View>

                    <View className="h-fit w-full ml-2">
                        <View className="flex flex-col w-9/12 px-2 gap-1">
                            <Text className="text-xl font-bold w-11/12">{data.title}</Text>
                            {tags.length > 0 && <View className="flex flex-row">
                                <EventDescriptionTag first={true} randomColor text={tags[0].tag} />
                                {tags.length >= 2 && <EventDescriptionTag randomColor text={`+${tags.length - 1}`} />}
                            </View>}
                            <Text>{new Date(data.startDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })} • {data.locationDisplayName}</Text>
                            <Text className="italic text-xs truncate">{truncateText(data.beschrijving.text.replace(/\\n/g, ""))}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {data.promoted && <View className="absolute top-5 right-4">
                <Svg width="25" height="25" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M3.5 21V16M3.5 6V1M1 3.5H6M1 18.5H6M12 2L10.2658 6.50886C9.98381 7.24209 9.8428 7.60871 9.62353 7.91709C9.42919 8.1904 9.1904 8.42919 8.91709 8.62353C8.60871 8.84281 8.24209 8.98381 7.50886 9.26582L3 11L7.50886 12.7342C8.24209 13.0162 8.60871 13.1572 8.91709 13.3765C9.1904 13.5708 9.42919 13.8096 9.62353 14.0829C9.84281 14.3913 9.98381 14.7579 10.2658 15.4911L12 20L13.7342 15.4911C14.0162 14.7579 14.1572 14.3913 14.3765 14.0829C14.5708 13.8096 14.8096 13.5708 15.0829 13.3765C15.3913 13.1572 15.7579 13.0162 16.4911 12.7342L21 11L16.4911 9.26582C15.7579 8.98381 15.3913 8.8428 15.0829 8.62353C14.8096 8.42919 14.5708 8.1904 14.3765 7.91709C14.1572 7.60871 14.0162 7.24209 13.7342 6.50886L12 2Z" stroke="#FF7347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            </View>}
        </TouchableOpacity>
    )
}

export default Event