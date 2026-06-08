import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { signIn } from '../../../../backend/firebase/auth.js';
import { globalColors, globalStyles } from "../../../styles";

import { ThemeKey } from '@/src/context/ThemeContext.d.js';
import { useTheme } from '@/src/context/ThemeContext.js';

export default function Login() {
    const { theme, changeTheme } = useTheme();

    const themed = globalColors[theme as ThemeKey];
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            await signIn(email, password);
        } catch (e) {
            setError("Incorrect email or password.");
        }
    }

    return (
        <View style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={[themed.back, globalStyles.back_button]}
                onPress={() => router.push("/")}>
                    <Text style={[themed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[themed.text, globalStyles.page_title]}>
                    Login
                </Text>       
            </View>

            <View style={[themed.container, localStyles.form_container]}>
                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={[themed.text, localStyles.input_label]}>Email</Text>
                    </View>

                    <TextInput 
                    style={[themed.picker, localStyles.text_input, {color: '#000000'}]}
                    placeholder='Email'
                    placeholderTextColor='#808080'
                    onChangeText={userInput => setEmail(userInput)}
                    defaultValue=''
                    />
                </View>

                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={[themed.text, localStyles.input_label]}>Password</Text>
                    </View>
                    
                    <TextInput 
                    style={[themed.picker, localStyles.text_input, {color: '#000000'}]}
                    placeholder='Password'
                    placeholderTextColor='#808080'
                    onChangeText={passInput => setPassword(passInput)}
                    defaultValue=''
                    secureTextEntry
                    />
                </View>

                <View style={[themed.container, localStyles.error_container]}>
                    <Text style={[themed.error_text, localStyles.error_text]}>{error}</Text>
                </View>

                <View style={localStyles.button_parent}>
                    <Pressable 
                    onPress={handleLogin}
                    style={({ pressed }) => [
                        pressed ? [themed.button_extra_light, localStyles.pressable_onPress] : [themed.button_light,localStyles.pressable_default]
                    ]}>
                        <Text style={[themed.text, globalStyles.button_normal_text]}>Submit</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );    
}

const localStyles = StyleSheet.create({
    label_container: {
        width: '30%',
    },

    input_label: {
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
    },

    input_container: {
        flexDirection: 'row',
        gap: '10%',
        width: '100%',
        height: '28%',
        paddingTop: '5%',
        paddingBottom: '5%',
        alignItems: 'center',
        marginBottom: '4%',
    },

    form_container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5%',
        height: '30%',
        width: '90%',
    },

    text_input: {
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        width: '100%',
        flex: 1,
        height: '100%',
        padding: '2%',
    },
    
    button_parent: {
        width: '65%',
        height: '20%',
        display: 'flex',
    },

    pressable_default: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    pressable_onPress: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    error_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    error_text: {
        textAlign: 'center',
        color: 'red',
    },
});