import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, RefreshControl } from 'react-native'
import Event from '../../components/Event'

import { useQuery } from '@apollo/client';
import { gql } from "@apollo/client";

const currentDateTime = new Date().toISOString();

export const Events = () => {
    const [eventsCalendar, seteventsCalendar] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    //fetch events

    let { data, loading, refetch } = useQuery(gql`
    query MyQuery {
        events(
          first: 200
          orderBy: startDate_ASC
          where: {endDate_gt: "2023-01-21T00:00:00.000Z"}
        ) {
          id
          title
          tags(first: 100) {
            tag
          }
          startDate
          endDate
          banner {
            url
          }
          beschrijving {
            text
          }
          promoted
          organizer
        }
      }`);

    useEffect(() => {
        if (loading) return
        groupEventsByMonth(data)
    }, [loading])

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            let newData = await refetch();
            await groupEventsByMonth(newData.data)
        } finally {
            setRefreshing(false);
        }
    };

    async function groupEventsByMonth(eventsData) {
        let evData = [...eventsData.events]
        const months = [
            'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
            'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
        ];

        const groupedEvents = evData.reduce((acc, event) => {
            const startDate = new Date(event.startDate);
            const monthIndex = startDate.getMonth();
            const month = months[monthIndex];

            const existingMonth = acc.find(obj => obj.Month === month);
            if (existingMonth) {
                existingMonth.events.push(event);
            } else {
                acc.push({ Month: month, events: [event] });
            }

            return acc;
        }, []);

        seteventsCalendar(old => groupedEvents)
    }

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} className="bg-white h-full px-4">
            <View className="w-full flex flex-col gap-4 mt-0 pb-32 h-fit">
                {eventsCalendar.map(eventMonth => {
                    return (
                        <View key={`events-${eventMonth.Month}`} className="w-full flex flex-col">
                            <Text className="text-2xl font-bold">{eventMonth.Month}</Text>
                            {eventMonth.events.map((event, i) => {
                                return <Event key={`${eventMonth}-event-${i}`} data={event} />
                            })}
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    )
}
