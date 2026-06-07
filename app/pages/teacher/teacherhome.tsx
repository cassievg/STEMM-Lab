import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/context/AuthContext';
import { globalStyles } from "../../styles";

import { useTheme } from '@/src/context/ThemeContext';

export default function TeacherHome() {
    const { getThemedStyle } = useTheme();

    const globalThemedStyles = useMemo(() => {
        return getThemedStyle(globalStyles);
    }, [getThemedStyle]);

    const { currentUser, userDoc } = useAuth();
    
    return (
        <View style={globalThemedStyles.page}>
            <View style={globalThemedStyles.title_container}>
                <Text style={globalThemedStyles.page_title}>
                    Welcome, {userDoc?.username}!
                </Text>           
            </View>

            <View style={globalThemedStyles.button_parent}>
                <Pressable onPress={() => {router.push('/pages/student/menu/activityselection')}}
                style={({ pressed }) => [
                    pressed ? globalThemedStyles.pressable_onPress : globalThemedStyles.pressable_default
                ]}>
                    <Text style={globalThemedStyles.button_big_text}>Play</Text>
                </Pressable>
            </View>

            <View style={globalThemedStyles.button_parent}>
                <Pressable onPress={() => {router.push('/pages/student/menu/settings')}}
                style={({ pressed }) => [
                    pressed ? globalThemedStyles.pressable_onPress : globalThemedStyles.pressable_default
                ]}>
                    <Text style={globalThemedStyles.button_big_text}>Settings</Text>
                </Pressable>
            </View>

            <View style={globalThemedStyles.button_parent}>
                <Pressable onPress={() => {router.push('/pages/student/menu/history')}}
                style={({ pressed }) => [
                    pressed ? globalThemedStyles.pressable_onPress : globalThemedStyles.pressable_default
                ]}>
                    <Text style={globalThemedStyles.button_big_text}>History</Text>
                </Pressable>
            </View>

            <View style={globalThemedStyles.button_parent}>
                <Pressable 
                onPress={() => {router.push('/pages/student/menu/profile')}}
                style={({ pressed }) => [
                    pressed ? globalThemedStyles.pressable_onPress : globalThemedStyles.pressable_default
                ]}>
                    <Text style={globalThemedStyles.button_big_text}>Profile</Text>
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