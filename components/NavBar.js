import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, Linking, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const NavBar = ({ navbarState, setNavbarState, event = false }) => {
    let navigation = useNavigation()

    let selected = "bg-lightGray border-0.5 border-darkGray flex items-center justify-center w-10 h-10 rounded-full"
    let unselected = "bg-white border-0.5 border-white flex items-center justify-center w-10 h-10 rounded-full"

    let buttonStyle = `w-1/3 h-[${Platform.OS === "android" ? "60px" : "500px"}] flex items-center justify-center`

    const styles = StyleSheet.create({
        button: {
            width: "33%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: Platform.OS === "android" ? 60 : 85
        },
        container: {
            width: "100%",
            backgroundColor: "white",
            borderTopWidth: 1,
            borderColor: "#EAECF0",
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: "auto",
            height: Platform.OS === "android" ? 60 : 85
        },
    });

    return (
        // <View className="h-[60px] bg-white border-t-2 border-gray-200 flex flex-row px-4 w-full mt-auto sticky">
        <View style={styles.container}>
            <View style={styles.button}>
                <TouchableOpacity onPress={() => { event ? navigation.navigate("Home", {tag: 'calendar'}) : setNavbarState("calendar") }} className={navbarState == "calendar" ? selected : unselected}>
                    <Svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M19.5 9H1.5M14.5 1V5M6.5 1V5M6.3 21H14.7C16.3802 21 17.2202 21 17.862 20.673C18.4265 20.3854 18.8854 19.9265 19.173 19.362C19.5 18.7202 19.5 17.8802 19.5 16.2V7.8C19.5 6.11984 19.5 5.27976 19.173 4.63803C18.8854 4.07354 18.4265 3.6146 17.862 3.32698C17.2202 3 16.3802 3 14.7 3H6.3C4.61984 3 3.77976 3 3.13803 3.32698C2.57354 3.6146 2.1146 4.07354 1.82698 4.63803C1.5 5.27976 1.5 6.11984 1.5 7.8V16.2C1.5 17.8802 1.5 18.7202 1.82698 19.362C2.1146 19.9265 2.57354 20.3854 3.13803 20.673C3.77976 21 4.61984 21 6.3 21Z" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
            </View>

            <View className={buttonStyle}>
                <TouchableOpacity onPress={() => { event ? navigation.navigate("Home", {tag: 'map'}) : setNavbarState("map") }} className={navbarState == "map" ? selected : unselected}>
                    <Svg width={19} height={22} viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M9.5 12C11.1569 12 12.5 10.6569 12.5 9C12.5 7.34315 11.1569 6 9.5 6C7.84315 6 6.5 7.34315 6.5 9C6.5 10.6569 7.84315 12 9.5 12Z" stroke="#121926" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        <Path d="M9.5 21C13.5 17 17.5 13.4183 17.5 9C17.5 4.58172 13.9183 1 9.5 1C5.08172 1 1.5 4.58172 1.5 9C1.5 13.4183 5.5 17 9.5 21Z" stroke="#121926" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
            </View>

            <View className={buttonStyle}>
                <TouchableOpacity onPress={() => { event ? navigation.navigate("Home", {tag: 'saved'}) : setNavbarState("saved") }} className={navbarState == "saved" ? selected : unselected}>
                    <Svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M1.5 5.8C1.5 4.11984 1.5 3.27976 1.82698 2.63803C2.1146 2.07354 2.57354 1.6146 3.13803 1.32698C3.77976 1 4.61984 1 6.3 1H10.7C12.3802 1 13.2202 1 13.862 1.32698C14.4265 1.6146 14.8854 2.07354 15.173 2.63803C15.5 3.27976 15.5 4.11984 15.5 5.8V19L8.5 15L1.5 19V5.8Z" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default NavBar