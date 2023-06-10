import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View, Image, RefreshControl, TouchableOpacity, Linking, Share, Platform } from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { StatusBar as SB, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Header from '../components/Header';
import NavBar from '../components/NavBar';
import EventDescriptionTag from '../components/EventDescriptionTag';
import { gql, useQuery } from '@apollo/client';

// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

//contexts
import { EventStorageContext } from '../contexts/EventStorageContext';
import { useContext } from 'react';

// const adUnitId = Platform.select({
//     ios: 'ca-app-pub-6142479111003129/8992961562',
//     android: 'ca-app-pub-6142479111003129/9184533255',
// });

export default function EventDetailPage({ route }) {
    const { savedEventIds, saveEventId, removeEventId } = useContext(EventStorageContext);

    const [navbarState, setNavbarState] = useState("event")
    let { eventID } = route.params

    const [eventsCalendar, seteventsCalendar] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [eventData, setEventData] = useState();

    const [showQA, setShowQA] = useState(false)

    let { data, loading, refetch } = useQuery(gql`
    query MyQuery {
        events(where: {id: "${eventID}"}) {
          id
          banner {
            url
          }
          beschrijving {
            html
            text
          }
          endDate
          locatie {
            latitude
            longitude
          }
          organizer
          promoted
          sponsors
          startDate
          adres
          tickets
          website
          pricing
          title
          locationDisplayName
          artists
          qa(first: 100) {
            ... on QaComponent {
              question
              answer
            }
          }
          tags(first: 100) {
            tag
          }
        }
      }`);

    useEffect(() => {
        if (loading) return
        setEventData(data.events[0])
    }, [loading, data])

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            width: "100%",
            marginTop: Platform.OS === "android" ? SB.currentHeight : 0,
        },
    });

    function getHourFromDate(dateString) {
        const date = new Date(dateString);
        const hour = date.getUTCHours();
        return `${hour}h`;
    }

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            refetch()
        } finally {
            setRefreshing(false);
        }
    };

    function openWebsite(url) {
        Linking.openURL(url)
    }

    function parseDate(dateString) {
        const date = new Date(dateString);

        const day = date.getDate();
        const monthIndex = date.getMonth();
        const month = [
            'Jan',
            'Feb',
            'Mrt',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dec',
        ][monthIndex];
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const formattedDate = `${day} ${month} (${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')})`;

        return formattedDate;
    }

    function parseTitleDate(dateString) {
        const date = new Date(dateString);

        const day = date.getDate();
        const monthIndex = date.getMonth();
        const month = [
            'Jan',
            'Feb',
            'Mrt',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dec',
        ][monthIndex];

        const formattedDate = `${day} ${month} ${date.getFullYear()}`;

        return formattedDate;
    }

    function replaceNewlinesWithEnters(text) {
        return text.replace(/\\n/g, '\n');
    }

    function saveEvent(evID) {
        if (savedEventIds.includes(evID)) {
            removeEventId(evID)
        } else {
            saveEventId(evID)
        }
    }

    async function share() {
        try {
            await Share.share({
                url: `https://eventssr.netlify.app/event/${eventData.id}`,
                message:
                    `${eventData.title}\n${parseDate(eventData.startDate)} - ${parseDate(eventData.endDate)}\n${replaceNewlinesWithEnters(eventData.beschrijving.text)}`
            });
        } catch { }
    }


    if (loading || !eventData) {
        return (<View className="w-full h-full flex items-center justify-center">
            <ActivityIndicator size="small" color="#000000" />
        </View>)
    }

    return (
        <View className="w-full">
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <Header />

                {/* CONTENT VIEW */}
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} className="bg-white h-full p-4">
                    <View className="w-full flex flex-col pb-32 h-fit">
                        <View className="flex w-full flex-row">
                            <View className="h-[175px] aspect-[3/4] overflow-hidden flex justify-center items-center rounded-lg bg-white border-0.5 border-gray-300">
                                <Image className="w-full h-full" source={{ uri: eventData.banner.url }}></Image>
                            </View>

                            <View className="h-fit w-full pl-4">
                                {eventData.promoted && <View className="flex flex-row items-center gap-2 w-1/2">
                                    <Svg width="25" height="25" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M3.5 21V16M3.5 6V1M1 3.5H6M1 18.5H6M12 2L10.2658 6.50886C9.98381 7.24209 9.8428 7.60871 9.62353 7.91709C9.42919 8.1904 9.1904 8.42919 8.91709 8.62353C8.60871 8.84281 8.24209 8.98381 7.50886 9.26582L3 11L7.50886 12.7342C8.24209 13.0162 8.60871 13.1572 8.91709 13.3765C9.1904 13.5708 9.42919 13.8096 9.62353 14.0829C9.84281 14.3913 9.98381 14.7579 10.2658 15.4911L12 20L13.7342 15.4911C14.0162 14.7579 14.1572 14.3913 14.3765 14.0829C14.5708 13.8096 14.8096 13.5708 15.0829 13.3765C15.3913 13.1572 15.7579 13.0162 16.4911 12.7342L21 11L16.4911 9.26582C15.7579 8.98381 15.3913 8.8428 15.0829 8.62353C14.8096 8.42919 14.5708 8.1904 14.3765 7.91709C14.1572 7.60871 14.0162 7.24209 13.7342 6.50886L12 2Z" stroke="#FF7347" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg>
                                    <Text className="font-bold text-promotionColor">Promoted</Text>
                                </View>}

                                <View className="flex flex-col mt-1 w-7/12">
                                    <Text className="text-xl font-bold">{eventData?.title}</Text>
                                    <Text className="mt-2">{parseTitleDate(eventData?.startDate)} ({getHourFromDate(eventData?.startDate)}) · {eventData?.locationDisplayName}</Text>
                                </View>
                            </View>
                        </View>

                        <View className="w-full mt-6 flex flex-row justify-end items-center">
                            {(eventData.tickets) && <TouchableOpacity onPress={() => openWebsite(eventData.tickets)} className="flex-1 h-10 rounded-full flex-row justify-center items-center bg-white border-0.5 border-gray-300 py-2">
                                <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path d="M1 11H21M1 11C1 16.5228 5.47715 21 11 21M1 11C1 5.47715 5.47715 1 11 1M21 11C21 16.5228 16.5228 21 11 21M21 11C21 5.47715 16.5228 1 11 1M11 1C13.5013 3.73835 14.9228 7.29203 15 11C14.9228 14.708 13.5013 18.2616 11 21M11 1C8.49872 3.73835 7.07725 7.29203 7 11C7.07725 14.708 8.49872 18.2616 11 21" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                                <Text className="ml-2 font-semibold">Koop je Tickets</Text>
                            </TouchableOpacity>}
                            {(!eventData.tickets && eventData.website) && <TouchableOpacity onPress={() => openWebsite(eventData.website)} className="flex-1 h-10 rounded-full flex-row justify-center items-center bg-white border-0.5 border-gray-300 py-2">
                                <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path d="M1 11H21M1 11C1 16.5228 5.47715 21 11 21M1 11C1 5.47715 5.47715 1 11 1M21 11C21 16.5228 16.5228 21 11 21M21 11C21 5.47715 16.5228 1 11 1M11 1C13.5013 3.73835 14.9228 7.29203 15 11C14.9228 14.708 13.5013 18.2616 11 21M11 1C8.49872 3.73835 7.07725 7.29203 7 11C7.07725 14.708 8.49872 18.2616 11 21" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                                <Text className="ml-2 font-semibold">Website van Organisator</Text>
                            </TouchableOpacity>}
                            {(!eventData.tickets && !eventData.website) && <TouchableOpacity onPress={() => openWebsite(`https://www.fesaspot.sr/event/${eventData.id}`)} className="flex-1 h-10 rounded-full flex-row justify-center items-center bg-white border-0.5 border-gray-300 py-2">
                                <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path d="M1 11H21M1 11C1 16.5228 5.47715 21 11 21M1 11C1 5.47715 5.47715 1 11 1M21 11C21 16.5228 16.5228 21 11 21M21 11C21 5.47715 16.5228 1 11 1M11 1C13.5013 3.73835 14.9228 7.29203 15 11C14.9228 14.708 13.5013 18.2616 11 21M11 1C8.49872 3.73835 7.07725 7.29203 7 11C7.07725 14.708 8.49872 18.2616 11 21" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                                <Text className="ml-2 font-semibold">Website Bezoeken</Text>
                            </TouchableOpacity>}
                            <View className="flex flex-row gap-2 w-fit ml-0.5">
                                <TouchableOpacity onPress={() => share()} className="h-10 w-10 flex items-center justify-center rounded-full bg-white border-0.5 border-gray-300">
                                    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M19 10V14.2C19 15.8802 19 16.7202 18.673 17.362C18.3854 17.9265 17.9265 18.3854 17.362 18.673C16.7202 19 15.8802 19 14.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V10M14 5L10 1M10 1L6 5M10 1V13" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => saveEvent(eventData.id)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white border-0.5 border-gray-300">
                                    {savedEventIds.includes(eventData.id) ? <Svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H10.2C11.8802 1 12.7202 1 13.362 1.32698C13.9265 1.6146 14.3854 2.07354 14.673 2.63803C15 3.27976 15 4.11984 15 5.8V19L8 15L1 19V5.8Z" fill="#121926" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg> : <Svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H10.2C11.8802 1 12.7202 1 13.362 1.32698C13.9265 1.6146 14.3854 2.07354 14.673 2.63803C15 3.27976 15 4.11984 15 5.8V19L8 15L1 19V5.8Z" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg>}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* <View className="bg-white w-full flex flex-row justify-center mt-6">
                            <BannerAd className="bg-white"
                                unitId={adUnitId}
                                size={BannerAdSize.LARGE_BANNER}
                                requestOptions={{
                                    requestNonPersonalizedAdsOnly: true,
                                }}
                            />
                        </View> */}

                        <View className="bg-white border-0.5 border-gray-300 w-full h-fit rounded-lg mt-6 flex flex-col divide-y-0.5 divide-gray-300">
                            <View className="p-4">
                                <Text className="font-semibold">Beschrijving</Text>
                                <Text className="mt-2">{replaceNewlinesWithEnters(eventData.beschrijving.text)}</Text>
                                {eventData.tags.length > 0 && <ScrollView horizontal className="flex flex-row gap-2 mt-3">
                                    {eventData.tags.map((tag, i) => {
                                        return <EventDescriptionTag key={`tag-${i}`} text={tag.tag} />
                                    })}
                                </ScrollView>}
                            </View>

                            <View className="p-4">
                                <Text className="font-semibold">Datum</Text>
                                <View className="flex flex-col mt-2">
                                    <Text className="text-gray-700">{parseDate(eventData.startDate)} - {parseDate(eventData.endDate)}</Text>
                                </View>
                            </View>

                            {eventData.artists && <View className="p-4">
                                <Text className="font-semibold">Artiesten</Text>
                                <View className="flex flex-col mt-2">
                                    <Text className="text-gray-700">{replaceNewlinesWithEnters(eventData.artists)}</Text>
                                </View>
                            </View>}

                            {eventData.pricing && <View className="p-4">
                                <Text className="font-semibold">Prijs</Text>
                                <View className="flex flex-col mt-2">
                                    <Text className="text-gray-700">{replaceNewlinesWithEnters(eventData.pricing)}</Text>
                                </View>
                            </View>}

                            {(eventData.sponsors || eventData.organizer) && <View className="p-4">
                                {eventData.organizer && <View>
                                    <Text className="font-semibold">Organisator</Text>
                                    <View className="flex flex-col mt-2">
                                        <Text className="text-gray-700">{replaceNewlinesWithEnters(eventData.organizer)}</Text>
                                    </View>
                                </View>}

                                {eventData.sponsors && <View className="mt-4">
                                    <Text className="font-semibold">Sponsoren</Text>
                                    <View className="flex flex-col mt-2">
                                        <Text className="text-gray-700">{replaceNewlinesWithEnters(eventData.sponsors)}</Text>
                                    </View>
                                </View>}
                            </View>}

                            {eventData.qa.length > 0 && <View className="p-4">
                                <TouchableOpacity onPress={() => setShowQA(!showQA)} className="flex flex-row items-center gap-2">
                                    {showQA ? <Svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M13 7L7 1L1 7" stroke="#344054" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg> : <Svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M1 1L7 7L13 1" stroke="#344054" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </Svg>}
                                    <Text className="font-semibold">Q&A</Text>
                                </TouchableOpacity>
                                <View className={"mt-2 " + (showQA ? "h-fit" : "h-0")}>
                                    {eventData.qa.map((sub, i) => {
                                        return (
                                            <View key={`sub-${i}`} className="mt-4">
                                                <Text className="italic text-gray-500">{sub.question}</Text>
                                                <Text className="mt-1">{sub.answer}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>}
                        </View>

                        <View className="mt-6">
                            <Text className="font-semibold">Locatie</Text>
                            {eventData.adres && <View className="pt-2">
                                <View>
                                    <Text className="font-semibold">Adres</Text>
                                    <View className="flex flex-col mt-1">
                                        <Text className="text-gray-700">{eventData.adres}</Text>
                                    </View>
                                </View>
                            </View>}

                            <View className="flex flex-col mt-4 w-full border-0.5 border-gray-300 rounded-xl overflow-hidden">
                                <MapView className="aspect-video w-full"
                                    initialRegion={{
                                        longitude: eventData.locatie.longitude,
                                        latitude: eventData.locatie.latitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01
                                    }}>
                                    <Marker coordinate={{ latitude: eventData.locatie.latitude, longitude: eventData.locatie.longitude }}
                                        pinColor={"red"}></Marker>
                                </MapView>
                            </View>
                        </View>

                        {/* <View className="bg-white w-full flex flex-row justify-center mt-6">
                            <BannerAd className="bg-white"
                                unitId={adUnitId}
                                size={BannerAdSize.BANNER}
                                requestOptions={{
                                    requestNonPersonalizedAdsOnly: true,
                                }}
                            />
                        </View> */}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <NavBar event={true} navbarState={navbarState} setNavbarState={setNavbarState} />
        </View>
    );
}