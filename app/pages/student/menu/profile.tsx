import { firestore } from '@/backend/firebase/config';
import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

export default function Profile() {
    const [inputName, setInputName] = useState('Username');
    const { currentUser, userDoc } = useAuth();

    const [error, setError] = useState("");

    const { logout } = useAuth();

    useEffect(() => {
        if (userDoc?.username) {
            setInputName(userDoc.username);
        }
    }, [userDoc])

    const handleProfileUpdate = async () => {
        if (inputName === "") {
            setError("Please enter a valid username.");
            return;
        }

        try {
            await firestore().collection("users").doc(currentUser.uid).update({
                username: inputName
            })
        } catch (e) {
            setError("Update failed.");
            console.log(e);
        }
    }

    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Profile
                </Text>
            </View>

            <View style={localStyles.container}>
                <View style={localStyles.avatar_container}>
                    <View style={localStyles.avatar}>
                        <Text style={localStyles.avatar_text}>
                            👤
                        </Text>
                    </View>
                    <TouchableOpacity style={localStyles.edit_button}>
                        <Text style={localStyles.edit_text}>
                            ✏️
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={localStyles.field_container}>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>
                            Name
                        </Text>
                        <TextInput
                            style={localStyles.input}
                            value={inputName}
                            onChangeText={(text) => {
                                setInputName(text);
                                setError('');
                            }}
                        />
                    </View>

                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>
                            Email
                        </Text>
                        <Text style={localStyles.email_text}>
                            {userDoc?.email}
                        </Text>
                    </View>

                    <View style={localStyles.button_container}>
                        <TouchableOpacity
                            style={localStyles.button}
                            onPress={handleProfileUpdate}>
                                <Text style={localStyles.button_text}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                        <TouchableOpacity
                            style={localStyles.button}
                            onPress={logout}>
                                <Text style={localStyles.button_text}>
                                    Logout
                                </Text>
                            </TouchableOpacity>
                    </View>

                    <View style={globalStyles.error_container}>
                        <Text style={globalStyles.error_text}>{error}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
    container:{ 
        backgroundColor: '#afdaff',
        borderColor: '#97b9d6',
        borderWidth: 2,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 8,
        paddingBottom: '5%',
    },

    avatar_container: {
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },

    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatar_text: {
        fontSize: 75,
    },

    edit_button: {
        marginTop: 8,
    },

    edit_text: {
        fontSize: 16,
    },

    field_container: {
        marginTop: 16,
        paddingHorizontal: 24,
        gap: 16,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    label: {
        width: 60,
        fontSize: 15,
        fontWeight: '500',
    },

    input: {
        width: '70%',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
    },

    email_text: {
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        color: '#333'
    },

    button_container: {
        width: '75%',
        marginTop: '7%',
        paddingHorizontal: 24,
        gap: 12,
        alignSelf: 'center',
    },

    button: {
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },

    button_text:{
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '500',
    },
});