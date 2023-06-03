import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StatusBar as SB } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

// HOME TABS
import { Events } from './HomeTabs/Events';
import Map from './HomeTabs/Map';
import Saved from './HomeTabs/Saved';

import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType, RewardedInterstitialAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true
  });

const Home = ({ route }) => {
    const [navbarState, setNavbarState] = useState("calendar")
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCalendar, setShowCalendar] = useState(false)

    const [interstitialLoaded, setInterstitialLoaded] = useState(false);

    const loadInterstitial = () => {
        const unsubscribeLoaded = interstitial.addAdEventListener(
            AdEventType.LOADED,
            () => {
                setInterstitialLoaded(true);
            }
        );

        const unsubscribeClosed = interstitial.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                setInterstitialLoaded(false);
                interstitial.load();
            }
        );

        interstitial.load();

        return () => {
            unsubscribeClosed();
            unsubscribeLoaded();
        }
    }

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

    useEffect(() => {
        const unsubscribeInterstitialEvents = loadInterstitial();

        return () => {
            unsubscribeInterstitialEvents();
        };
    }, [])

    return (
        <View className="w-full">
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <Header selectedDate={selectedDate} setShowCalendar={setShowCalendar} showCalendar={showCalendar} tag={navbarState} />

                {interstitialLoaded ? <Button title="Show Interstitial" onPress={() => interstitial.show()} /> : <Text>Loading Interstitial...</Text>}
                {/* CONTENT VIEW */}
                {navbarState == "calendar" && <Events />}
                {navbarState == "map" && <Map showCalendar={showCalendar} setShowCalendar={setShowCalendar} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
                {navbarState == "saved" && <Saved />}
            </SafeAreaView>

            <NavBar navbarState={navbarState} setNavbarState={setNavbarState} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </View>
    )
}

export default Home