import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.page}>
            <View style={styles.title_container}>
                <Text style={styles.page_title}>
                    Welcome to STEMM Lab!
                </Text>           
            </View>

            <View style={styles.button_parent}>
                <Pressable onPress={() => {router.push('/settings')}}
                style={styles.pressable}>
                    <Text style={styles.button_text}>Settings</Text>
                </Pressable>
            </View>

            <View style={styles.button_parent}>
                <Pressable onPress={() => {router.push('/history')}}
                style={styles.pressable}>
                    <Text style={styles.button_text}>History</Text>
                </Pressable>
            </View>

            <View style={styles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/profile')}}
                style={styles.pressable}>
                    <Text style={styles.button_text}>Profile</Text>
                </Pressable>
            </View>

            <View style={styles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/inbox')}}
                style={(styles.pressable)}>
                    <Text style={styles.button_text}>Inbox</Text>
                </Pressable>
            </View>
        </View>
    );    
}

const styles = StyleSheet.create({
    page: {
        padding: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },

    title_container: {
        width: '70%',
    },

    page_title: {
        fontSize: 30,
        textAlign: 'center',
        paddingBottom: '5%',
        fontWeight: 'bold',
        fontFamily: 'Trebuchet MS, Roboto, sans-serif'
    },

    button_parent: {
        width: '70%',
        height: '7%',
        display: 'flex',
        backgroundColor: '#afdaff',
        marginTop: '10%',
        borderRadius: 15,
    },

    pressable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    button_text: {
        fontSize: 20,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        width: '100%',
        textAlign: 'center',
    },
});