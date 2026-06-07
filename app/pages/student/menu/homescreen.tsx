import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { globalColors, globalStyles } from "../../../styles";

import { useAuth } from '@/src/context/AuthContext.js';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';

export default function StudentHome() {
    const { theme, changeTheme } = useTheme();

    const themed = globalColors[theme as ThemeKey];

    const { currentUser, userDoc } = useAuth();

    return (
        <View style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.title_container}>
                <Text style={[themed.text, globalStyles.page_title]}>
                    Welcome, {userDoc?.username}!
                </Text>           
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push("/pages/student/menu/activityselection")}}
                style={({ pressed }) => [
                    pressed ? [themed.pressable_onPress, globalStyles.pressable_onPress] : [themed.pressable_default, globalStyles.pressable_default]
                ]}>
                    <Text style={[themed.text, globalStyles.button_big_text]}>Learn</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('./settings')}}
                style={({ pressed }) => [
                    pressed ? [themed.pressable_onPress, globalStyles.pressable_onPress] : [themed.pressable_default, globalStyles.pressable_default]
                ]}>
                    <Text style={[themed.text, globalStyles.button_big_text]}>Settings</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('./history')}}
                style={({ pressed }) => [
                    pressed ? [themed.pressable_onPress, globalStyles.pressable_onPress] : [themed.pressable_default, globalStyles.pressable_default]
                ]}>
                    <Text style={[themed.text, globalStyles.button_big_text]}>History</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('./profile')}}
                style={({ pressed }) => [
                    pressed ? [themed.pressable_onPress, globalStyles.pressable_onPress] : [themed.pressable_default, globalStyles.pressable_default]
                ]}>
                    <Text style={[themed.text, globalStyles.button_big_text]}>Profile</Text>
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