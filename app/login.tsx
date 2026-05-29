import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { getUserID, signIn } from '../src/firebase/auth.js';
import { globalStyles } from "./styles";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            await signIn(email, password);
            const userDocument = await firestore().collection('users').doc(getUserID()).get();
            if (userDocument.get('role') == 'teacher') {
                router.push('/teacher/teacherhome');
            } else if (userDocument.get('role') == 'student') {
                router.push('/homescreen');
            }

            console.log(userDocument.get('username'));
        } catch (e) {
            console.log("Error fetching user: " + e);
        }
    }

    return (
        <View style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Login
                </Text>       
            </View>

            <View style={localStyles.form_container}>
                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={localStyles.input_label}>Email</Text>
                    </View>

                    <TextInput 
                    style={localStyles.text_input}
                    placeholder='Email'
                    placeholderTextColor='#969696'
                    onChangeText={userInput => setEmail(userInput)}
                    defaultValue=''
                    />
                </View>

                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={localStyles.input_label}>Password</Text>
                    </View>
                    
                    <TextInput 
                    style={localStyles.text_input}
                    placeholder='Password'
                    placeholderTextColor='#969696'
                    onChangeText={passInput => setPassword(passInput)}
                    defaultValue=''
                    secureTextEntry
                    />
                </View>

                <View style={localStyles.error_container}>
                    <Text style={localStyles.error_text}>{error}</Text>
                </View>

                <View style={localStyles.button_parent}>
                    <Pressable 
                    onPress={handleLogin}
                    style={({ pressed }) => [
                        pressed ? localStyles.pressable_onPress : localStyles.pressable_default
                    ]}>
                        <Text style={globalStyles.button_normal_text}>Submit</Text>
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
        backgroundColor: '#afdaff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5%',
        borderColor: '#97b9d6',
        borderWidth: 2,
        height: '30%',
        width: '90%',
    },

    text_input: {
        backgroundColor: '#ffffff',
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
        marginTop: '8%',
        marginBottom: '5%',
    },

    pressable_default: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },

    pressable_onPress: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4d4d4',
        borderRadius: 10,
    },

    error_container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -25,
    },

    error_text: {
        textAlign: 'center',
        color: 'red',
    },
});