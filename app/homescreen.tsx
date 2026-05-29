import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { getUserID } from '../src/firebase/auth.js';
import { globalStyles } from "./styles";

export default function StudentHome() {
    const [username, setUsername] = useState('');

    useEffect(() => {
            const initUser = async () => {
                const userDocument = await firestore().collection('users').doc(getUserID()).get();
                setUsername(userDocument.get('username'));
            }
        }, []);

    return (
        <View style={globalStyles.page}>
            <View style={globalStyles.title_container}>
                <Text style={globalStyles.page_title}>
                    Welcome to STEMM Lab!
                </Text>           
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('/student/activityselection')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Learn</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('/settings')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Settings</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('/history')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>History</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/profile')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Profile</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/inbox')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Inbox</Text>
                </Pressable>
            </View>
        </View>
    );    
}

const localStyles = StyleSheet.create({
    button_parent: {
        width: '70%',
        height: '7%',
        display: 'flex',
        marginTop: '10%',
    },
})