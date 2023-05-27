import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StatusBar as SB } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, Linking, ScrollView, Image, Platform } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Event from '../components/Event';

const Home = ({ route }) => {
    const [navbarState, setNavbarState] = useState("calendar")

    useEffect(() => {
        if (route.params && route.params.tag) setNavbarState(route.params.tag)
    }, [route])


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
                <ScrollView className="bg-white h-full px-4">
                    <View className="w-full flex flex-col gap-4 mt-0 pb-32 h-fit">
                        <View className="w-full flex flex-col">
                            <Text className="text-2xl font-bold">Mei</Text>
                            <Event />
                            <Event />
                            <Event />
                        </View>

                        <View className="w-full flex flex-col">
                            <Text className="text-2xl font-bold">Juni</Text>
                            <Event />
                        </View>

                        <View className="w-full flex flex-col">
                            <Text className="text-2xl font-bold">Juli</Text>
                            <Event />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <NavBar navbarState={navbarState} setNavbarState={setNavbarState} />
        </View>
    )
}

export default Home