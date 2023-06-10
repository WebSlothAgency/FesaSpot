import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventStorageContext = createContext();

const EventStorageProvider = ({ children }) => {
    const [savedEventIds, setSavedEventIds] = useState([]);

    useEffect(() => {
        // Load saved event IDs from AsyncStorage when the component mounts
        loadSavedEventIds();
    }, []);

    const loadSavedEventIds = async () => {
        try {
            const savedIds = await AsyncStorage.getItem('savedEventIds');
            if (savedIds !== null) {
                setSavedEventIds(JSON.parse(savedIds));
            }
        } catch { }
    };

    const saveEventId = async (eventId) => {
        if (savedEventIds.includes(eventId)) {
            return; // Event ID already saved, do nothing
        }

        try {
            const updatedIds = [...savedEventIds, eventId];
            setSavedEventIds(updatedIds);
            await AsyncStorage.setItem('savedEventIds', JSON.stringify(updatedIds));
        } catch { }
    };

    const removeEventId = async (eventId) => {
        try {
            const updatedIds = savedEventIds.filter((id) => id !== eventId);
            setSavedEventIds(updatedIds);
            await AsyncStorage.setItem('savedEventIds', JSON.stringify(updatedIds));
        } catch { }
    };

    return (
        <EventStorageContext.Provider
            value={{
                savedEventIds,
                saveEventId,
                removeEventId
            }}
        >
            {children}
        </EventStorageContext.Provider>
    );
};

export { EventStorageContext, EventStorageProvider };