import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { globalStyles } from './styles';

export default function Landing() {
    const { getThemedStyle } = useTheme();

    const globalThemedStyles = useMemo(() => {
        return getThemedStyle(globalStyles);
    }, [getThemedStyle]);

    return (
        <View style={globalThemedStyles.page}>
            <View style={globalThemedStyles.title_container}>
                <Text style={globalThemedStyles.page_title}>
                    Welcome to STEMM Lab!
                </Text>           
            </View>

            <Image
            source={require("../assets/images/Logo.png")}
            style={globalThemedStyles.image}/>

            <View style={globalThemedStyles.title_container}>
                <Text style={globalThemedStyles.text}>
                    Please register or login to continue.
                </Text>           
            </View>

            <View style={globalThemedStyles.button_parent}>
                <Pressable onPress={() => {router.push('./pages/student/menu/login')}}
                style={({ pressed }) => [
                    pressed ? globalThemedStyles.pressable_onPress : globalThemedStyles.pressable_default
                ]}>
                    <Text style={globalThemedStyles.button_big_text}>Login</Text>
                </Pressable>
            </View>

            <View style={globalThemedStyles.button_parent}>
                <Pressable onPress={() => {router.push('./pages/student/menu/register')}}
                style={({ pressed }) => [
                    pressed ? globalThemedStyles.pressable_onPress : globalThemedStyles.pressable_default
                ]}>
                    <Text style={globalThemedStyles.button_big_text}>Register</Text>
                </Pressable>
            </View>
        </View>
    );    
}