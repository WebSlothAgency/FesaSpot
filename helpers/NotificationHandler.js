import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';
import { Platform } from 'react-native';

export async function checkPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    let result = finalStatus == "granted"
    return result
}

export function calculateSecondsUntilDate(dateString, days) {
    const targetDate = new Date(dateString);
    const currentDate = new Date();

    // Subtract the specified number of days from the target date
    targetDate.setDate(targetDate.getDate() - days);

    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);

    return secondsDifference;
}

export async function openAppSettings() {
    Linking.openSettings();
}

export async function schedulePushNotification(startDate, days, title = "FesaSpot", body = "Event X is in Y days") {
    let permissions = await checkPermissions()

    if (!permissions) {
        console.log("No acces to send push notifications");
        openAppSettings()
        return
    }

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    let seconds = calculateSecondsUntilDate(startDate, days)

    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body
        },
        trigger: { seconds },
    });
}
