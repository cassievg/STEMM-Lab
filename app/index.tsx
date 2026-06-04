import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { globalStyles } from './styles';

export default function Landing() {
    return (
        <View style={globalStyles.page}>
            <View style={globalStyles.title_container}>
                <Text style={globalStyles.page_title}>
                    Welcome to STEMM Lab!
                </Text>           
            </View>

            <Image
            source={require("../assets/images/Logo.png")}
            style={globalStyles.image}/>

            <View style={globalStyles.title_container}>
                <Text style={globalStyles.text}>
                    Please register or login to continue.
                </Text>           
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('./pages/student/menu/login')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Login</Text>
                </Pressable>
            </View>

            <View style={globalStyles.button_parent}>
                <Pressable onPress={() => {router.push('./pages/student/menu/register')}}
                style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                ]}>
                    <Text style={globalStyles.button_big_text}>Register</Text>
                </Pressable>
            </View>
        </View>
    );    
}