import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View, Image } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { StatusBar as SB } from 'react-native';

import Header from '../components/Header';
import NavBar from '../components/NavBar';
import EventDescriptionTag from '../components/EventDescriptionTag';

export default function EventPage() {

    const [navbarState, setNavbarState] = useState("event")

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            width: "100%",
            marginTop: Platform.OS === "android" ? SB.currentHeight : 0,
        },
    });

    return (
        <View className="w-full">
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <Header />

                {/* CONTENT VIEW */}
                <ScrollView className="bg-white h-full p-4">
                    <View className="w-full flex flex-col gap-6 pb-32 h-fit">
                        <View className="flex w-full flex-row">
                            <View className="h-[175px] aspect-[3/4] overflow-hidden flex justify-center items-center rounded-lg bg-white">
                                <Image className="w-full h-full" source={{ uri: "https://media.graphassets.com/feXV9zSfRvK41w8jMs9w" }}></Image>
                            </View>

                            <View className="h-fit w-full pl-4">
                                <View className="flex flex-row items-center gap-2 w-1/2">
                                    <Svg width="25" height="25" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M3.5 21V16M3.5 6V1M1 3.5H6M1 18.5H6M12 2L10.2658 6.50886C9.98381 7.24209 9.8428 7.60871 9.62353 7.91709C9.42919 8.1904 9.1904 8.42919 8.91709 8.62353C8.60871 8.84281 8.24209 8.98381 7.50886 9.26582L3 11L7.50886 12.7342C8.24209 13.0162 8.60871 13.1572 8.91709 13.3765C9.1904 13.5708 9.42919 13.8096 9.62353 14.0829C9.84281 14.3913 9.98381 14.7579 10.2658 15.4911L12 20L13.7342 15.4911C14.0162 14.7579 14.1572 14.3913 14.3765 14.0829C14.5708 13.8096 14.8096 13.5708 15.0829 13.3765C15.3913 13.1572 15.7579 13.0162 16.4911 12.7342L21 11L16.4911 9.26582C15.7579 8.98381 15.3913 8.8428 15.0829 8.62353C14.8096 8.42919 14.5708 8.1904 14.3765 7.91709C14.1572 7.60871 14.0162 7.24209 13.7342 6.50886L12 2Z" stroke="#FF7347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg>
                                    <Text className="font-bold text-promotionColor">Promoted</Text>
                                </View>

                                <View className="flex flex-col mt-1 w-7/12">
                                    <Text className="text-xl font-bold">Een hele lange naam voor een festival</Text>
                                    <Text className="mt-2">26 Mei 2023 (22h) · Sky Lounge & Bar</Text>
                                </View>
                            </View>
                        </View>

                        <View className="bg-white border-2 border-darkGray p-4 w-full h-fit rounded-lg">
                            <Text className="font-bold">Beschriiving</Text>
                            <Text className="mt-4">70's, 80's, 90's & Early 2000's Music. Free entrance until 23h30!Come well dressed 🤵</Text>
                            <ScrollView horizontal className="flex flex-row gap-2 mt-4">
                                <EventDescriptionTag text={"VIP Lounges"} />
                                <EventDescriptionTag text={"Snack bars"} />
                                <EventDescriptionTag text={"Dance Floors"} />
                                <EventDescriptionTag text={"Light Installations"} />
                            </ScrollView>
                        </View>

                        <View>
                            <Text className="text-gray-700">Date</Text>
                            <View className="flex flex-col mt-2">
                                <Text className="font-semibold text-gray-700">26 Mei 2023 (22:00 - 06:00)</Text>
                                <Text className="font-semibold text-gray-700">27 Mei 2023 (20:00 - 04:00)</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-700">Organizer</Text>
                            <View className="flex flex-col mt-2">
                                <Text className="font-semibold text-gray-700">Sky Lounge</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-700">Artists</Text>
                            <View className="flex flex-col mt-2">
                                <Text className="font-semibold text-gray-700">DJ MARIO · DJ CAT</Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-700">Location</Text>
                            <View className="flex flex-col mt-2">
                                
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <NavBar event={true} navbarState={navbarState} setNavbarState={setNavbarState} />
        </View>
    );
}