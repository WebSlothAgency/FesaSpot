import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Platform, TouchableOpacity } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

import { useQuery } from '@apollo/client';
import { gql } from "@apollo/client";
import CustomDatePicker from '../../components/CustomDatePicker';

const Map = ({ selectedDate, setSelectedDate, setShowCalendar, showCalendar }) => {
    const navigation = useNavigation();
    const [selectedEvent, setselectedEvent] = useState();
    const [eventsCalendar, seteventsCalendar] = useState([]);
    const [thisDate, setThisDate] = useState(new Date().toISOString())

    const fetchData = async () => {
        try {
            const { data } = await refetch();
            if (!data || !data.events || data.events.length <= 0) {
                seteventsCalendar([]);
                return;
            }
            const eventsArray = data.events.map(event => ({
                title: event.title,
                id: event.id,
                opened: isCurrentTimeBetween(event.startDate, event.endDate),
                openTime: parseDate(event.startDate),
                closeTime: parseDate(event.endDate),
                banner: event.banner.url,
                location: {
                    longitude: event.locatie.latitude,
                    latitude: event.locatie.longitude
                }
            }));
            seteventsCalendar(eventsArray);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (!selectedDate) return
        fetchData();
    }, [selectedDate]);

    let check = checkToday() ? `,{startDate_lte: "${thisDate}", endDate_gte: "${thisDate}"}` : ""

    const { loading, refetch } = useQuery(gql`
    query MyQuery{
      events(
        first: 200
        orderBy: startDate_ASC
        where: { OR: [
            {startDate_gte: "${selectedDate}", startDate_lte: "${new Date(new Date(selectedDate).setUTCHours(23, 59, 59, 0)).toISOString()}"}${check}
        ] }
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

    function checkToday() {
        let now = new Date().setHours(0, 0, 0, 0)
        let selected = new Date(selectedDate).setHours(0, 0, 0, 0)

        return now == selected
    }

    function isCurrentTimeBetween(startDateTime, endDateTime) {
        const currentDateTime = new Date();
        return currentDateTime.getTime() >= new Date(startDateTime).getTime() && currentDateTime.getTime() <= new Date(endDateTime).getTime();
    }

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

        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${day} ${month} (${hours}:${minutes})`;
    }

    function formatNumberWithRandomDecimal(number) {
        const fixedNumber = number.toFixed(6);
        const randomNumber = Math.floor(Math.random() * 11);
        const formattedNumber = fixedNumber.slice(0, -1) + randomNumber;
        return parseFloat(formattedNumber);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View>
            <View className="flex flex-col w-full h-full">
                <CustomDatePicker
                    setShowCalendar={setShowCalendar}
                    showCalendar={showCalendar}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
                <MapView onPress={() => setShowCalendar(false)} className="h-full w-full relative"
                    initialRegion={{
                        longitude: -55.1720815,
                        latitude: 5.8026814,
                        latitudeDelta: 0.075,
                        longitudeDelta: 0.075
                    }}
                >
                    {!loading && eventsCalendar.map((marker, i) => (
                        <Marker key={`marker-${i}`} coordinate={{ latitude: formatNumberWithRandomDecimal(marker.location.longitude), longitude: formatNumberWithRandomDecimal(marker.location.latitude) }}
                            pinColor={marker.opened ? "limegreen" : "red"}>
                            <Callout onPress={() => navigation.navigate("Event", { eventID: marker.id })}>
                                <View className="flex flex-row gap-2">
                                    {Platform.OS !== "android" && <Image className="w-10 aspect-[3/4] rounded-md" source={{ uri: marker.banner }}></Image>}
                                    <View>
                                        <Text className="font-bold text-left">{marker.title}</Text>
                                        <Text>Open: {marker.openTime}</Text>
                                        <Text>Sluit: {marker.closeTime}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate("Event", { eventID: marker.id })} className={"mt-2 w-full bg-black rounded-md"}>
                                    <Text className="text-center py-1 font-bold text-white">MEER INFO</Text>
                                </TouchableOpacity>
                            </Callout>
                        </Marker>
                    ))}

                </MapView>
            </View>
            {!showCalendar && <View className="absolute w-full flex items-center mt-4">
                <View className="bg-gray-100 px-3 py-1 rounded-full flex flex-col items-center justify-center">
                    {!loading ? <Text className="font-semibold">{eventsCalendar.length > 0 ? eventsCalendar.length : "geen"} gevonden</Text> : <Text className="font-semibold">zoeken</Text>}
                </View>
            </View>}
        </View>
    );
};

export default Map;
