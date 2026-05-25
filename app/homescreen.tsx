import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { globalStyles } from "./styles";

export default function HomeScreen() {
    return (
        <View style={globalStyles.page}>
            <View style={globalStyles.title_container}>
                <Text style={globalStyles.page_title}>
                    Welcome to STEMM Lab!
                </Text>           
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('/settings')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_text}>Settings</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('/history')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_text}>History</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/profile')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_text}>Profile</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/inbox')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_text}>Inbox</Text>
                </Pressable>
            </View>
        </View>
    );    
}