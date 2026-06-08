import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { globalColors, globalStyles } from './styles';

export default function Landing() {
    const { theme, changeTheme, themeList } = useTheme();

    const themed = globalColors[theme as ThemeKey];

    return (
        <View style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.title_container}>
                <Text style={[themed.text, globalStyles.page_title]}>
                    Welcome to STEMM Lab!
                </Text>           
            </View>

            <Image
            source={require("../assets/images/Logo.png")}
            style={globalStyles.image}/>

            <View style={globalStyles.title_container}>
                <Text style={[themed.text, globalStyles.text]}>
                    Please register or login to continue.
                </Text>           
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('./pages/student/menu/login')}}
                style={({ pressed }) => [
                    pressed ? [themed.pressable_onPress, globalStyles.pressable_onPress] : [themed.pressable_default, globalStyles.pressable_default]
                ]}>
                    <Text style={[themed.text, globalStyles.button_big_text]}>Login</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('./pages/student/menu/register')}}
                style={({ pressed }) => [
                    pressed ? [themed.pressable_onPress, globalStyles.pressable_onPress] : [themed.pressable_default, globalStyles.pressable_default]
                ]}>
                    <Text style={[themed.text, globalStyles.button_big_text]}>Register</Text>
                </Pressable>
            </View>
        </View>
    );    
}