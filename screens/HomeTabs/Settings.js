import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, Button, Switch, TouchableOpacity, Share } from 'react-native'
import { AppState, Linking, Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';
import Constants from 'expo-constants';

import { checkPermissions, openAppSettings } from '../../helpers/NotificationHandler'
import DropDown from '../../components/DropDown';
import { Svg, Path } from 'react-native-svg';
import * as Location from 'expo-location';

const itunesItemId = "id6449878405"
const androidPackageName = "com.websloth.eventssr"

const Settings = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const [locationEnabled, setLocationEnabled] = useState(false)
    const [language, setLanguage] = useState("Nederlands")

    const [pageState, setPageState] = useState("main")


    useEffect(() => {
        checkNotificationState()
        checkLocationState()
    }, [])

    async function checkNotificationState() {
        let checkNotificationPermissions = await checkPermissions()
        setNotificationsEnabled(checkNotificationPermissions)
    }

    async function checkLocationState() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setLocationEnabled(false)
        }else{
            setLocationEnabled(true)
        }
    }



    async function leaveReview() {
        if (Platform.OS === 'ios') {
            Linking.openURL(`itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`);
        } else {
            Linking.openURL(`market://details?id=${androidPackageName}&showAllReviews=true`);
        }
    }

    const handleAppStateChange = async (nextAppState) => {
        if (nextAppState === 'active') {
            await checkNotificationState()
            await checkLocationState()
        }
    };

    const goToSettingsAndMonitorAppState = () => {
        AppState.addEventListener('change', handleAppStateChange);
        openAppSettings();
    };

    function openWebsite(url){
        Linking.openURL(url)
    }

    async function share() {
        try {
            await Share.share({
                message:
                    `FesaSpot is de ultieme party guide gemaakt voor Suriname!\nMet deze app ben je altijd op de hoogte van de leukste feestjes. \n\nDownload de app nu en mis geen enkel feest meer! 🎉📲\nhttps://www.fesaspot.sr/download`
            });
        } catch { }
    }

    return (
        <View className="w-full h-full">
            {pageState == "main" && <View className="bg-white h-auto px-4 flex flex-col justify-between">
                <View>
                    <View className="w-full flex flex-col gap-4 mt-0 h-fit">
                        <Text className="text-xl font-semibold text-gray-900">Instellingen</Text>
                    </View>

                    {/* <View className="mt-4">
                        <Text className="font-semibold text-base text-gray-700">Taal</Text>
                        <DropDown options={["Nederlands", "English"]} selectedOption={language} setSelectedOption={setLanguage} />
                    </View> */}

                    <View className="mt-6 w-full z-10">
                        <Text className="font-semibold text-base text-gray-700">Notificaties</Text>
                        <Text>Ontvang notificaties over opgeslagen evenementen (Gebruik de opslaan knop op evenement pagina's)</Text>
                        <View className="w-full flex flex-row items-center mt-2">
                            <Switch
                                style={{ transform: [{ scaleX: .8 }, { scaleY: .80 }] }}
                                trackColor={{ false: '#F2F4F7', true: '#344054' }}
                                thumbColor={notificationsEnabled ? '#F2F4F7' : '#F2F4F7'}
                                ios_backgroundColor="#F2F4F7"
                                onValueChange={goToSettingsAndMonitorAppState}
                                value={notificationsEnabled}
                            />
                            <Text className="ml-2">Notificaties zijn {notificationsEnabled ? "ingeschakeld" : "uitgeschakeld"}</Text>
                        </View>
                    </View>

                    <View className="mt-6 w-full z-10">
                        <Text className="font-semibold text-base text-gray-700">Locatie</Text>
                        <Text>Gebruik je live locatie om feestjes in de buurt te zien!</Text>
                        <View className="w-full flex flex-row items-center mt-2">
                            <Switch
                                style={{ transform: [{ scaleX: .8 }, { scaleY: .80 }] }}
                                trackColor={{ false: '#F2F4F7', true: '#344054' }}
                                thumbColor={locationEnabled ? '#F2F4F7' : '#F2F4F7'}
                                ios_backgroundColor="#F2F4F7"
                                onValueChange={goToSettingsAndMonitorAppState}
                                value={locationEnabled}
                            />
                            <Text className="ml-2">Locatie is {locationEnabled ? "ingeschakeld" : "uitgeschakeld"}</Text>
                        </View>
                    </View>
                </View>
                <View className="mt-16 w-full">
                    <View className="flex flex-row justify-between w-full">
                        <TouchableOpacity onPress={share} className="w-[48%] mr-1 flex flex-row items-center justify-center h-10 border-0.5 border-[#EAECF0] rounded-md">
                            <Text className="font-semibold text-gray-900 text-base">Deel de app</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={leaveReview} className="w-[48%] flex flex-row items-center justify-center h-10 border-0.5 border-[#EAECF0] rounded-md">
                            <Text className="font-semibold text-gray-900 text-base">Beoordeel de app</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="w-full mt-4">
                        <TouchableOpacity onPress={() => setPageState("about")} className="w-full flex flex-row items-center justify-center h-10 border-0.5 border-[#EAECF0] rounded-md">
                            <Svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M12.5 16V12M12.5 8H12.51M22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </Svg>
                            <Text className="font-semibold text-base text-gray-900 ml-2">Over FesaSpot</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            }

            {pageState == "about" && <View className="bg-white px-4 flex flex-col justify-between">
                <View className="mt-4 ">
                    <TouchableOpacity className="flex flex-row w-full items-center" onPress={() => setPageState("main")}>
                        <Svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M17 7H1M1 7L7 13M1 7L7 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <Text className="text-xl font-semibold text-gray-900 ml-2">Over FesaSpot</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-col mt-1">
                    <TouchableOpacity onPress={() => openWebsite("https://fesaspot.sr/policy/privacy-policy")} className="w-full h-12 flex flex-row items-center justify-between">
                        <Text className="text-gray-700 font-semibold text-base">Privacybeleid</Text>
                        <Svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M1 13L7 7L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openWebsite("https://fesaspot.sr/policy/terms-of-use")} className="w-full h-12 flex flex-row items-center justify-between">
                        <Text className="text-gray-700 font-semibold text-base">Gebruiksvoorwaarden</Text>
                        <Svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M1 13L7 7L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openWebsite("https://fesaspot.sr/policy/open-source-libraries")} className="w-full h-12 flex flex-row items-center justify-between">
                        <Text className="text-gray-700 font-semibold text-base">Open Source-bibliotheken</Text>
                        <Svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M1 13L7 7L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-col w-full items-center mt-16">
                    <Text className="text-gray-700 font-normal">v{Constants.manifest.version}</Text>
                    <TouchableOpacity onPress={() => openWebsite("https://www.websloth.agency")}><Text className="text-gray-700 font-normal mt-1">Ontwikkeld door WebSloth</Text></TouchableOpacity>
                    <Text className="text-gray-700 font-normal mt-1">FesaSpot © 2023. Alle rechten voorbehouden.</Text>
                </View>
            </View>}
        </View>
    )
}

export default Settings