import React, { Component, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const CustomDatePicker = ({ selectedDate, setSelectedDate, setShowCalendar, showCalendar }) => {
    function onDateChange(date) {
        const newDate = new Date(date);
        newDate.setUTCHours(0, 0, 0, 0);

        setSelectedDate(newDate.toISOString())
        setShowCalendar(false)
    }

    return (
        <>
            {showCalendar && <View className="bg-transparent absolute z-50">
                <View className="bg-white rounded-b-md pt-2">
                    <CalendarPicker
                        onDateChange={onDateChange}
                        selectedDayColor='#EAECF0'
                        todayBackgroundColor='#F2F4F7'
                        previousTitle="<"
                        selectedStartDate={selectedDate}
                        nextTitle='>'
                        minDate={new Date()}
                        startFromMonday={true}
                        weekdays={["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]}
                        months={["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]}
                    />
                </View>
            </View>}
        </>
    )
}

export default CustomDatePicker