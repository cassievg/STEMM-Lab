import { Picker } from "@react-native-picker/picker";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { signOut, signUp } from '../../../../backend/firebase/auth.js';
import { firestore } from '../../../../backend/firebase/config.js';

import { ThemeKey } from "@/src/context/ThemeContext.d.js";
import { useTheme } from "@/src/context/ThemeContext.js";
import { createTeam } from "@/src/services/firebaseServices";
import { globalColors, globalStyles } from "../../../styles";

export default function Register() {
    const { theme, changeTheme } = useTheme();

    const themed = globalColors[theme as ThemeKey];
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [role, setRole] = useState("");

    const [teamName, setTeamName] = useState('');
    const [grade, setGrade] = useState('');
    const [members, setMembers] = useState<string[]>([]);

    const [error, setError] = useState("");

    const generateDisciminator = (): string => {
        const chars = 'QWERTYUIOPASDFGHJKLZXCVBNM123456789';
        return Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

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
        else if (role === "student" && teamName === "") {
            setError("Please enter a team name.");
            return;
        }
        else if (role === "student" && grade === "") {
            setError("Please enter a grade.");
            return;
        }
        else if (role === "student" && members.some(m => m.trim() === "")) {
            setError("Please provide all member names.");
            return;
        }
        else if (role === "student" && members.length < 2) {
            setError("Please add more members to your team.");
            return;
        }
        
        try {
            const { user } = await signUp(email, password);

            await firestore().collection('users').doc(user.uid).set(
                {
                    username: username,
                    email: email,
                    role: role,
                }
            )

            if (role === "student") {
                const discriminator = generateDisciminator();
                const teamRef = await createTeam(teamName, members, grade, discriminator);

                await firestore()
                    .collection('users')
                    .doc(user.uid)
                    .update({
                        teamId: teamRef.id
                    });
            }

            await signOut();
            router.replace('/pages/student/menu/login');
        } catch (e: any) {
            setError(e.message);
        }
    }

    const removeMember = (index: number): void => {
        setMembers(members.filter((_, i) => i !== index));
    }

    const addMember = (): void => {
        setMembers([...members, '']);
    }

    const updateMembers = (text: string, index: number): void => {
        const updated = [...members];
        updated[index] = text;
        setMembers(updated);
    }

    return (
        <View style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={[themed.back, globalStyles.back_button]}
                onPress={() => router.push('..')}>
                    <Text style={[themed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[themed.text, globalStyles.page_title]}>
                    Register
                </Text>       
            </View>

            <ScrollView
            style={[themed.scroll_container, localStyles.form_container]}
            contentContainerStyle={localStyles.form_content}
            showsVerticalScrollIndicator={false}>
                <View style={[themed.scroll_container, localStyles.form_container]}>
                    <View style={localStyles.input_container}>
                        <View style={localStyles.label_container}>
                            <Text style={[themed.text, localStyles.input_label]}>Username</Text>
                        </View>

                        <TextInput 
                        style={[themed.text_input, localStyles.text_input, {color: '#000000'}]}
                        placeholder='Username'
                        placeholderTextColor='#808080'
                        onChangeText={userInput => setUsername(userInput)}
                        defaultValue=''
                        />
                    </View>

                    <View style={localStyles.input_container}>
                        <View style={localStyles.label_container}>
                            <Text style={[themed.text, localStyles.input_label]}>Email</Text>
                        </View>

                        <TextInput 
                        style={[themed.text_input, localStyles.text_input, {color: '#000000'}]}
                        placeholder='Email'
                        placeholderTextColor='#808080'
                        onChangeText={emailInput => setEmail(emailInput)}
                        defaultValue=''
                        />
                    </View>

                    <View style={localStyles.input_container}>
                        <View style={localStyles.label_container}>
                            <Text style={[themed.text, localStyles.input_label]}>Password</Text>
                        </View>
                        
                        <TextInput 
                        style={[themed.text_input, localStyles.text_input, {color: '#000000'}]}
                        placeholder='Password'
                        placeholderTextColor='#808080'
                        onChangeText={passInput => setPassword(passInput)}
                        defaultValue=''
                        secureTextEntry
                        />
                    </View>

                    <View style={localStyles.input_container}>
                        <View style={localStyles.label_container}>
                            <Text style={[themed.text, localStyles.input_label]}>Confirm Password</Text>
                        </View>
                        
                        <TextInput 
                        style={[themed.text_input, localStyles.text_input, {color: '#000000'}]}
                        placeholder='Confirm Password'
                        placeholderTextColor='#808080'
                        onChangeText={confirmInput => setConfirmPass(confirmInput)}
                        defaultValue=''
                        secureTextEntry
                        />
                    </View>

                    <View style={localStyles.role_container}>
                        <View style={localStyles.label_container}>
                            <Text style={[themed.text, localStyles.input_label]}>Role</Text>
                        </View>
                        <View style={globalStyles.picker_container}>
                            <Picker
                            selectedValue={role}
                            onValueChange={(value) => setRole(value)}
                            style={[themed.picker, {color: '#000000'}, globalStyles.picker]}
                            >
                                <Picker.Item label="Select a role" value="" style={[{color: '#000000'}, globalStyles.picker_text]}/>
                                <Picker.Item label="Student" value="student" style={[{color: '#000000'}, globalStyles.picker_text]}/>
                            </Picker>
                        </View>
                    </View>

                    {role === 'student' && (
                        <View style={localStyles.input_container}>
                            <View style={localStyles.label_container}>
                                <Text style={[themed.text, localStyles.input_label]}>Grade</Text>
                            </View>

                            <TextInput 
                            style={[themed.text_input, localStyles.text_input, {color: '#000000'}]}
                            placeholder='Grade'
                            placeholderTextColor='#808080'
                            onChangeText={userInput => setGrade(userInput)}
                            defaultValue=''
                            />
                        </View>
                    )}

                    {role === 'student' && (
                        <View style={localStyles.input_container}>
                            <View style={localStyles.label_container}>
                                <Text style={[themed.text, localStyles.input_label]}>Team Name</Text>
                            </View>

                            <TextInput 
                            style={[themed.text_input, localStyles.text_input, {color: '#000000'}]}
                            placeholder='Team Name'
                            placeholderTextColor='#808080'
                            onChangeText={userInput => setTeamName(userInput)}
                            defaultValue=''
                            />
                        </View>
                    )}

                    {role === 'student' && (
                        <>
                            {members.map((member, index) => (
                                <View
                                key={index}
                                style={localStyles.member_container}>
                                    <View style={localStyles.label_container}>
                                        <Text style={[{color: '#000000'}, localStyles.input_label]}>
                                            Member {index + 1}
                                        </Text>
                                    </View>

                                    <View
                                    style={localStyles.member_row}>
                                        <TextInput
                                        style={[themed.text_input, {color: '#000000'}, localStyles.text_input]}
                                        placeholder="First Name"
                                        placeholderTextColor='#808080'
                                        value={member}
                                        onChangeText={(text:string) => {
                                            updateMembers(text, index);
                                        }} />

                                        <Pressable
                                        onPress={() => removeMember(index)}
                                        style={[themed.simple_button, localStyles.remove_button]}>
                                            <Text style={[themed.text, globalStyles.button_normal_text]}>-</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    {role === 'student' && (
                        <Pressable
                        onPress={addMember}
                        style={[themed.pressable_onPress, localStyles.add_button]}>
                            <Text style={[themed.text, globalStyles.button_big_text]}>+</Text>
                        </Pressable>
                    )}

                    <View style={localStyles.button_parent}>
                        <Pressable 
                        onPress={handleSingup}
                        style={({ pressed }) => [
                            pressed ? [themed.button_extra_light, localStyles.pressable_onPress] : [themed.button_light, localStyles.pressable_default]
                        ]}>
                            <Text style={[themed.text, globalStyles.button_normal_text]}>Submit</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            <View style={localStyles.error_container}>
                <Text style={[themed.error_text, localStyles.error_text]}>{error}</Text>
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
        paddingVertical: 8,
        alignItems: 'center',
        marginBottom: 0,
    },

    role_container: {
        flexDirection: 'row',
        gap: '10%',
        width: '100%',
        height: 60,
        paddingVertical: 8,
        alignItems: 'center',
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
        marginVertical: 1,
    },

    picker_text: {
        fontSize: 14,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
    },

    form_container: {
        padding: '5%',
        width: '100%',
        flexGrow: 0,
        flexShrink: 1,
        maxHeight: '75%'
    },

    form_content: {
        padding: '5%',
        alignItems: 'center',  
    },

    text_input: {
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        flex: 1,
        height: 36,
        paddingHorizontal: 8,
    },

    member_input: {
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        flex: 1,
        height: 36,
        padding: '2%',
    },

    member_container: {
        flexDirection: 'row',
        gap: '10%',
        width: '100%',
        paddingTop: '3%',
        paddingBottom: '3%',
        alignItems: 'center',
    },

    member_row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    
    button_parent: {
        width: '65%',
        height: 44,
        marginTop: 16,
        marginBottom: 12,
        marginHorizontal: 'auto',
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

    add_button: {
        marginTop: 20,
        padding: 5,
        width: '100%'
    },

    remove_button: {
        marginLeft: 3,
        padding: 5,
        borderRadius: 10,
    },

    error_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    error_text: {
        textAlign: 'center',
    },
});