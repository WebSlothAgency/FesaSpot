import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { EventStorageContext } from '../../contexts/EventStorageContext';
import Event from '../../components/Event';
import { gql, useQuery, InMemoryCache } from '@apollo/client';

const Saved = () => {
    const { savedEventIds } = useContext(EventStorageContext);
    const [refreshing, setRefreshing] = useState(false);
    const [eventsCalendar, seteventsCalendar] = useState([]);

    const { data, loading, refetch } = useQuery(
        gql`
    query MyQuery {
            events(
              where: {OR: [${savedEventIds.map(id => `{id: "${id}"}`).join(', ')}]}
              orderBy: startDate_ASC
            ) {
              id
              banner {
                url
              }
              title
              tags(first: 100) {
                tag
              }
              startDate
              endDate
              locationDisplayName
              beschrijving {
                text
              }
              promoted
            }
          }
        `,
        {
            variables: { eventIds: savedEventIds },
            // Define custom merge function for the beschrijving field
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            merge(existing, incoming) {
                return incoming;
            },
        }
    );

    useEffect(() => {
        if (loading) return;
        if (savedEventIds.length > 0 && data) {
            groupEventsByMonth(data);
        }
    }, [loading, data]);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await refetch();
        } finally {
            setRefreshing(false);
        }
    };

    function groupEventsByMonth(eventsData) {
        const months = [
            'Januari',
            'Februari',
            'Maart',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Augustus',
            'September',
            'Oktober',
            'November',
            'December',
        ];

        const groupedEvents = eventsData.events.reduce((acc, event) => {
            const startDate = new Date(event.startDate);
            const monthIndex = startDate.getMonth();
            const month = months[monthIndex];

            const existingMonth = acc.find((obj) => obj.Month === month);
            if (existingMonth) {
                existingMonth.events.push(event);
            } else {
                acc.push({ Month: month, events: [event] });
            }

            return acc;
        }, []);

        seteventsCalendar(groupedEvents);
    }

    if (loading || !eventsCalendar) {
        return (
            <View className="w-full h-full flex items-center justify-center">
                <ActivityIndicator size="small" color="#000000" />
            </View>
        );
    }

    return (
        <>
            {savedEventIds.length > 0 ? (
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    className="bg-white h-full px-4"
                >
                    <View className="w-full flex flex-col gap-4 mt-0 pb-32 h-fit">
                        {eventsCalendar.map((eventMonth) => {
                            return (
                                <View key={`saved-events-${eventMonth.Month}`} className="w-full flex flex-col">
                                    <Text className="text-2xl font-bold">{eventMonth.Month}</Text>
                                    {eventMonth.events.map((event, i) => {
                                        return <Event key={`saved-${eventMonth}-event-${i}`} data={event} />;
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            ) : (
                <View className="h-full w-full flex justify-start items-center">
                    <Text className="font-semibold mt-6">U heeft nog niks opgeslagen</Text>
                </View>
            )}
        </>
    );
};

export default Saved;
