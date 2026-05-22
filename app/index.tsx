import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.parent}>
            <Text style={styles.page_title}>
                home
            </Text>

            <Button
            title = "Settings"
            onPress={() => router.push('/settings')}
            />

            <Button
            title = "History"
            onPress={() => router.push('/history')}
            />

            <Button
            title = "Profile"
            onPress={() => router.push('/profile')}
            />

            <Button
            title = "Inbox"
            onPress={() => router.push('/inbox')}
            />
        </View>
    );    
}

const styles = StyleSheet.create({
    parent: {
        padding: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    page_title: {
        fontSize: 25,
        textAlign: 'center',
        padding: 30,
    },

    button: {
        width: 50,
        fontSize: 15,
    },
});