import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { globalStyles } from "../../../styles";

import { useAuth } from '@/src/context/AuthContext.js';

export default function StudentHome() {
    const { currentUser, userDoc } = useAuth();

    return (
        <View style={globalStyles.page}>
            <View style={globalStyles.title_container}>
                <Text style={globalStyles.page_title}>
                    Welcome, {userDoc?.username}!
                </Text>           
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('./pages/student/menu/activityselection')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Learn</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('/pages/student/menu/settings')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Settings</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('/pages/student/menu/history')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>History</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/pages/student/menu/profile')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Profile</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/pages/student/menu/inbox')}}
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