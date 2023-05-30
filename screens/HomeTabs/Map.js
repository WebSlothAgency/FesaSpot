import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { View, Text, Image, Platform, TouchableOpacity } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'

import { useQuery } from '@apollo/client';
import { gql } from "@apollo/client";

const Map = () => {
    let navigation = useNavigation()
    const [selectedEvent, setselectedEvent] = useState()

    const [eventsCalendar, seteventsCalendar] = useState([])

    let { data, loading } = useQuery(gql`
    query MyQuery {
        events(
                  first: 200
                  orderBy: startDate_ASC
                  where: {endDate_gt: "2023-01-21T00:00:00.000Z"}
                ) {
            banner {
              url
            }
            locatie {
              latitude
              longitude
            }
            title
            id
            endDate
            startDate
          }
        }`);

    useEffect(() => {
        if (loading) return
        let eventsArray = []

        data.events.map(event => {
            eventsArray.push({
                title: event.title,
                id: event.id,
                openTime: parseDate(event.startDate),
                closeTime: parseDate(event.endDate),
                banner: event.banner.url,
                location:{
                    longitude: event.locatie.latitude,
                    latitude: event.locatie.longitude
                }
            })
        })


        seteventsCalendar(old => eventsArray)
    }, [loading])

    function parseDate(dateString) {
        const date = new Date(dateString);

        const options = {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        };

        const formattedDate = date.toLocaleDateString('nl-NL', options);
        const [day, month, om, time] = formattedDate.split(' ');

        return `${day} ${month} (${time})`;
    }


    function formatNumberWithRandomDecimal(number) {
        const fixedNumber = number.toFixed(6); // Fix the number to 6 decimal places
        const randomNumber = Math.floor(Math.random() * 11); // Generate a random number between 0 and 10
        const formattedNumber = fixedNumber.slice(0, -1) + randomNumber; // Replace the last decimal place with the random number
        return parseFloat(formattedNumber); // Convert the formatted number back to a float
    }

    return (
        <View>
            <View className="flex flex-col w-full">
                <MapView className="h-full w-full"
                    initialRegion={{
                        longitude: -55.1720815,
                        latitude: 5.8026814,
                        latitudeDelta: 0.075,
                        longitudeDelta: 0.075
                    }}
                >

                    {!loading && eventsCalendar.map(marker => {
                        return <Marker key={Math.random()} coordinate={{ latitude: formatNumberWithRandomDecimal(marker.location.longitude), longitude: formatNumberWithRandomDecimal(marker.location.latitude) }}
                            pinColor={"red"}>
                            <Callout onPress={() => navigation.navigate("Event", {eventID: marker.id})}>
                                <View className="flex flex-row gap-2">
                                    {Platform.OS != "android" && <Image className="w-10 aspect-[3/4] rounded-md" source={{ uri: marker.banner }}></Image>}
                                    <View>
                                        <Text className="font-bold text-left">{marker.title}</Text>
                                        <Text>Open: {marker.openTime}</Text>
                                        <Text>Sluit: {marker.closeTime}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate("Event", {eventID: marker.id})} className={"mt-2 w-full bg-black rounded-md"}>
                                    <Text className="text-center py-1 font-bold text-white">MEER INFO</Text>
                                </TouchableOpacity>
                            </Callout>
                        </Marker>
                    })}

                </MapView>
            </View>
        </View>
    )
}

export default Map