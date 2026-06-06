import { firestore } from '@/backend/firebase/config';
import { useAuth } from '@/src/context/AuthContext';
import { getTeamDetails } from '@/src/services/firebaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

type TeamRow = {
    id: string,
    discriminator: string,
    grade: string,
    members: string[],
    name: string,
}

export default function Profile() {
    const [usernameEdit, setUsernameEdit] = useState('Username');

    const [team, setTeam] = useState<TeamRow | null>(null);
    const [teamnameEdit, setTeamnameEdit] = useState('Team Name');
    const [teammembersEdit, setTeammembersEdit] = useState<string[]>([]);

    const [error, setError] = useState("");

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
        } catch (e) {
            setError("Update failed.");
            console.log(e);
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
                <View style={localStyles.field_container}>
                    <View style={localStyles.row}>
                        <Text style={localStyles.label}>
                            Username
                        </Text>
                        <TextInput
                            style={localStyles.input}
                            value={usernameEdit}
                            onChangeText={(text) => {
                                setUsernameEdit(text);
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

                    {userDoc?.role === 'student' && team && (
                        <>
                            <View style={localStyles.row}>
                                <Text style={localStyles.label}>Team Name</Text>
                                <TextInput
                                    style={localStyles.input}
                                    value={teamnameEdit}
                                    onChangeText={(text) => {
                                        setTeamnameEdit(text);
                                        setError('');
                                    }}
                                />
                            </View>

                            <Text style={[localStyles.label, { marginBottom: -8 }]}>Members</Text>

                            {(teammembersEdit ?? []).map((member, index) => (
                                <View key={index} style={localStyles.row}>
                                    <Text style={localStyles.label}>Member {index + 1}</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
                                        <TextInput
                                            style={[localStyles.input, { flex: 1 }]}
                                            value={member}
                                            placeholder="First Name"
                                            placeholderTextColor='#969696'
                                            onChangeText={(text) => updateMember(text, index)}
                                        />
                                        <Pressable
                                            onPress={() => removeMember(index)}
                                            style={localStyles.remove_button}>
                                            <Text>-</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}

                            <Pressable style={localStyles.add_button} onPress={addMember}>
                                <Text style={localStyles.button_text}>+ Add Member</Text>
                            </Pressable>
                        </>
                    )}

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

                    <View style={localStyles.error_container}>
                        <Text style={localStyles.error_text}>{error}</Text>
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
        width: 80,
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

        error_container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    error_text: {
        textAlign: 'center',
        color: 'red',
    },

    add_button: {
        marginTop: 20,
        padding: 5,
        backgroundColor: '#ffffff',
        width: '100%'
    },

    remove_button: {
        marginLeft: 3,
        padding: 5,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
});