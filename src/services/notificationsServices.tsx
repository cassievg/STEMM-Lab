import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const requestPemissions = async () => {
    const {status} = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
        alert("Please allow permissions to receive notifications!");
        return false;
    }

    return true;
}

const notifyCompletion = async (activityName: string, score: number) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: `Activity ${activityName} completed!`,
            body: `Congratulations on scoring ${score} on Activity ${activityName}`
        },
        trigger: null,
    })
}

export { notifyCompletion, requestPemissions };

