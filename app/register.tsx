import { Picker } from "@react-native-picker/picker";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { signUp } from '../src/firebase/auth.js';

import { globalStyles } from "./styles";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [role, setRole] = useState("");

    const [error, setError] = useState("");

    const handleSingup = async () => {
        if (confirmPass !== password) {
            setError("Your passwords do not match!");
            return;
        }
        else if (email === "") {
            setError("Please enter a valid email address.");
            return;
        }
        else if (role === "") {
            setError("Please select a role.");
            return;
        }
        
        try {
            const { user } = await signUp(email, password);

            await firestore().collection('users').doc(user.uid).set(
                {
                    username: username,
                    role: role,
                }
            )

            router.push('/login');
        } catch (e: any) {
            setError(e.message);
        }
    }

    return (
        <View style={globalStyles.page}>
            <View style={localStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Register
                </Text>       
            </View>

            <View style={localStyles.form_container}>
                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={localStyles.input_label}>Username</Text>
                    </View>

                    <TextInput 
                    style={localStyles.text_input}
                    placeholder='Username'
                    placeholderTextColor='#969696'
                    onChangeText={userInput => setUsername(userInput)}
                    defaultValue=''
                    />
                </View>

                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={localStyles.input_label}>Email</Text>
                    </View>

                    <TextInput 
                    style={localStyles.text_input}
                    placeholder='Email'
                    placeholderTextColor='#969696'
                    onChangeText={emailInput => setEmail(emailInput)}
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

                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={localStyles.input_label}>Confirm Password</Text>
                    </View>
                    
                    <TextInput 
                    style={localStyles.text_input}
                    placeholder='Confirm Password'
                    placeholderTextColor='#969696'
                    onChangeText={confirmInput => setConfirmPass(confirmInput)}
                    defaultValue=''
                    secureTextEntry
                    />
                </View>

                <View style={localStyles.input_container}>
                    <View style={localStyles.label_container}>
                        <Text style={localStyles.input_label}>Role</Text>
                    </View>
                    <View style={localStyles.picker_container}>
                        <Picker
                        selectedValue={role}
                        onValueChange={(value) => setRole(value)}
                        style={localStyles.picker}
                        >
                            <Picker.Item label="Select a role" value="" style={localStyles.picker_text}/>
                            <Picker.Item label="Teacher" value="teacher" style={localStyles.picker_text}/>
                            <Picker.Item label="Student" value="student" style={localStyles.picker_text}/>
                        </Picker>
                    </View>
                </View>

                <View style={localStyles.button_parent}>
                    <Pressable 
                    onPress={handleSingup}
                    style={({ pressed }) => [
                        pressed ? localStyles.pressable_onPress : localStyles.pressable_default
                    ]}>
                        <Text style={globalStyles.button_normal_text}>Submit</Text>
                    </Pressable>
                </View>

                <View style={localStyles.error_container}>
                    <Text style={localStyles.error_text}>{error}</Text>
                </View>
            </View>
        </View>
    );    
}

const localStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        marginBottom: '5%'
    },

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
        marginBottom: '-10%',
    },

    picker_container: {
        flex: 1,
        zIndex: 999,
        elevation: 999,
        height: '90%',
        justifyContent: 'center',
    },

    picker: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginVertical: 1,
    },

    picker_text: {
        fontSize: 14,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
    },

    form_container: {
        backgroundColor: '#afdaff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5%',
        borderColor: '#97b9d6',
        borderWidth: 2,
        height: '40%',
        width: '100%',
        overflow: 'visible',
    },

    text_input: {
        backgroundColor: '#ffffff',
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        width: '100%',
        flex: 1,
        height: '60%',
        padding: '2%',
    },
    
    button_parent: {
        width: '65%',
        height: '12%',
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