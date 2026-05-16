import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View>
            <Text>
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
    
});