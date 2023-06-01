import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StatusBar as SB } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

// HOME TABS
import { Events } from './HomeTabs/Events';
import Map from './HomeTabs/Map';
import Saved from './HomeTabs/Saved';

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
                <Header tag={navbarState} />

                {/* CONTENT VIEW */}
                {navbarState == "calendar" && <Events />}
                {navbarState == "map" && <Map />}
                {navbarState == "saved" && <Saved />}
            </SafeAreaView>

            <NavBar navbarState={navbarState} setNavbarState={setNavbarState} />
        </View>
    )
}

export default Home