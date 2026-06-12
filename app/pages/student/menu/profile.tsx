import { firestore } from '@/backend/firebase/config';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { getTeamDetails } from '@/src/services/firebaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalColors, globalStyles } from '../../../styles';

type TeamRow = {
    id: string,
    discriminator: string,
    grade: string,
    members: string[],
    name: string,
}

export default function Profile() {
    const { theme, changeTheme } = useTheme();

    const themed = globalColors[theme as ThemeKey];

    const [usernameEdit, setUsernameEdit] = useState('Username');

    const [team, setTeam] = useState<TeamRow | null>(null);
    const [teamnameEdit, setTeamnameEdit] = useState('Team Name');
    const [teammembersEdit, setTeammembersEdit] = useState<string[]>([]);

    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const { logout, userID, userDoc, currentUser, teamID } = useAuth();

    useEffect(() => {
        const loadTeam = async () => {
            if (!userID) return;

            const teamData = await getTeamDetails(teamID);
            if (teamData) {
                setTeam(teamData);
                setTeamnameEdit(teamData.name);
                setTeammembersEdit(teamData.members ?? []);
            }
        }

        if (userDoc?.username) {
            setUsernameEdit(userDoc.username);
        }
        if (userDoc?.role === 'student') {
            loadTeam();
        }
    }, [userDoc, userID])

    const handleProfileUpdate = async () => {
        if (usernameEdit === "") {
            setError("Please enter a valid username.");
            return;
        }
        if (userDoc?.role === "student") {
            if (teamnameEdit.trim() === '') {
                setError('Please enter a valid team name.');
                return;
            }
            else if (teammembersEdit.some(m => m.trim() === '')) {
                setError('Please fill in all member names.');
                return;
            }
            else if (teammembersEdit.length < 2) {
                setError('Please add at least 2 members.');
                return;
            }
        }

        try {
            await firestore().collection("users").doc(currentUser.uid).update({
                username: usernameEdit
            })

            if (userDoc?.role === 'student') {
                await firestore()
                .collection('teams')
                .doc(team?.id)
                .update({
                    name: teamnameEdit.trim(),
                    members: teammembersEdit.map(m => m.trim())
                })
            }

            setError('');
            alert('Update successful!');
        } catch (e) {
            setError("Update failed.");
        }
    }

    const addMember = () => {
        setTeammembersEdit([...teammembersEdit, '']);
    }

    const removeMember = (index: number) => {
        setTeammembersEdit(teammembersEdit.filter((_, i) => i !== index));
    }
    
    const updateMember = (text: string, index: number) => {
        const updated = [...teammembersEdit];
        updated[index] = text;
        setTeammembersEdit(updated);
    }

    return (
        <SafeAreaView style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={[themed.back, globalStyles.back_button]}
                onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text style={[themed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[themed.text, globalStyles.page_title]}>
                    Profile
                </Text>
            </View>

            <ScrollView
                        style={[themed.scroll_container, localStyles.container]}
                        contentContainerStyle={localStyles.form_content}
                        showsVerticalScrollIndicator={false}>
                <View style={[localStyles.container]}>
                    <View style={localStyles.field_container}>
                        <View style={localStyles.row}>
                            <Text style={[themed.text, localStyles.label]}>
                                Username
                            </Text>
                            <TextInput
                                style={[themed.text_input, localStyles.input]}
                                value={usernameEdit}
                                onChangeText={(text) => {
                                    setUsernameEdit(text);
                                    setError('');
                                }}
                            />
                        </View>

                        <View style={localStyles.row}>
                            <Text style={[themed.text, localStyles.label]}>
                                Email
                            </Text>
                            <Text style={[themed.text_input, localStyles.input]}>
                                {userDoc?.email}
                            </Text>
                        </View>

                        {userDoc?.role === 'student' && team && (
                            <>
                                <View style={localStyles.row}>
                                    <Text style={[themed.text, localStyles.label]}>Team Name</Text>
                                    <TextInput
                                        style={[themed.text_input, localStyles.input]}
                                        value={teamnameEdit}
                                        onChangeText={(text) => {
                                            setTeamnameEdit(text);
                                            setError('');
                                        }}
                                    />
                                </View>

                                <Text style={[[themed.text, localStyles.label], { marginBottom: -8 }]}>Members</Text>

                                {(teammembersEdit ?? []).map((member, index) => (
                                    <View key={index} style={localStyles.row}>
                                        <Text style={[themed.text, localStyles.label]}>Member {index + 1}</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
                                            <TextInput
                                                style={[[themed.text_input, localStyles.input], { flex: 1 }]}
                                                value={member}
                                                placeholder="First Name"
                                                placeholderTextColor='#808080'
                                                onChangeText={(text) => updateMember(text, index)}
                                            />
                                            <Pressable
                                                onPress={() => removeMember(index)}
                                                style={[themed.simple_button, localStyles.remove_button]}>
                                                <Text>-</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}

                                <Pressable style={[themed.button_light, localStyles.add_button]} onPress={addMember}>
                                    <Text style={[themed.text, localStyles.button_text]}>+ Add Member</Text>
                                </Pressable>
                            </>
                        )}

                        <View style={localStyles.button_container}>
                            <TouchableOpacity
                                style={[themed.button_light, localStyles.button]}
                                onPress={handleProfileUpdate}>
                                    <Text style={[themed.text, localStyles.button_text]}>
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            <TouchableOpacity
                                style={[themed.button_light, localStyles.button]}
                                onPress={logout}>
                                    <Text style={[themed.text, localStyles.button_text]}>
                                        Logout
                                    </Text>
                                </TouchableOpacity>
                        </View>

                        <View style={localStyles.error_container}>
                            <Text style={[themed.error_text, localStyles.error_text]}>{error}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
    container: {
        width: '90%',
        flexGrow: 0,
        flexShrink: 1,
        maxHeight: '75%'
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
        width: 80,
        fontSize: 15,
        fontWeight: '500',
    },

    input: {
        width: '70%',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
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
    },

    button_text:{
        fontSize: 15,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '500',
    },

    error_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    error_text: {
        textAlign: 'center',
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
});