import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

import { firestore } from '@/backend/firebase/config';
import { acceptInvite, checkUserInTeam, declineInvite, fetchInboxByRecipient } from '@/backend/firebase/firebaseServices';
import { fetchActivities } from '@/src/database/databaseServices';
import { useAuth } from '../../../../src/context/AuthContext';

type ActivityRow = {
    id: string,
    name: string,
    course: string
}

type InboxRow = {
    id: string,
    activityId: string,
    author: string,
    date: string,
    recipient: string,
}

export default function Inbox() {
    const { currentUser, userDoc, userID } = useAuth();
    const [activities, setActivities] = useState<ActivityRow[]>([]);
    const [inbox, setInbox] = useState<InboxRow[]>([]);
    const [recipient, setRecipient] = useState('')
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedInvite, setSelectedInvite] = useState<InboxRow | null>(null);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        console.log(userID);
        if (!userID) return;

        const loadActivities = async () => {
            const res = await fetchActivities();
            console.log(res);
            setActivities(res);
        }

        const loadMessages = async() => {
            const res = await fetchInboxByRecipient(userID);
            setInbox(res);
        }

        loadActivities();
        loadMessages();
    }, [userID])

    const sendInvite = async () => {
        const authorID = userID;
        const recipientID = recipient;
        const activityID = selectedActivity;

        const alreadyInTeam = await checkUserInTeam(recipientID, activityID);
        if (alreadyInTeam) {
            alert("This user is already in a team.");
            return;
        }

        await firestore()
            .collection('inbox')
            .add({
                author: authorID,
                recipient: recipientID,
                activityId: activityID,
                date: new Date().toISOString()
            })

        setRecipient('');
        setSelectedActivity('');
        setModalVisible(false);
    }

    const renderItem = ({item}: {item: InboxRow}) => (
        <TouchableOpacity 
        style={localStyles.item}
        onPress={() => setSelectedInvite(item)}>
            <Text 
            style={globalStyles.text}
            numberOfLines={inbox.length}>
                You got an invite to a team!
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={globalStyles.page}>
            <Modal
            transparent
            visible={modalVisible}
            animationType='fade'
            onRequestClose={() => setModalVisible(false)}
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>

                        <Text style={modalStyles.label}>Your ID</Text>
                        <Text style={modalStyles.value}>{userID}</Text>

                        <Text style={modalStyles.label}>Recipient ID</Text>
                        <TextInput
                            style={modalStyles.input}
                            value={recipient}
                            onChangeText={setRecipient}
                            placeholder="Enter recipient ID"
                        />

                        <Text style={modalStyles.label}>Activity</Text>
                        <View style={modalStyles.pickerWrapper}>
                            <Picker
                                selectedValue={selectedActivity}
                                onValueChange={(val) => setSelectedActivity(val)}
                            >
                                <Picker.Item label="-- Select Activity --" value="" />
                                {activities.map((activity) => (
                                    <Picker.Item
                                        key={activity.id}
                                        label={activity.name}
                                        value={activity.id}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <View style={modalStyles.buttons}>
                            <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
                            <Button title="Send" onPress={sendInvite} />
                        </View>

                    </View>
                </View>
            </Modal>

            <Modal
                visible={!!selectedInvite}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedInvite(null)}
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <Text style={modalStyles.label}>Invite Details</Text>
                        <Text style={{ marginTop: 8 }}>
                            You've been invited to team up for activity{' '}
                            <Text style={{ fontWeight: 'bold' }}>{selectedInvite?.activityId}</Text>
                            {' '}by{' '}
                            <Text style={{ fontWeight: 'bold' }}>{selectedInvite?.author}</Text>
                        </Text>

                        <View style={modalStyles.buttons}>
                            <Button title="Close" color="gray" onPress={() => setSelectedInvite(null)}
                            />
                            <Button
                            title="Decline"
                            color="gray"
                            onPress={async () => {
                                if (!selectedInvite) return;
                                await declineInvite(selectedInvite.id);
                                setInbox(prev => prev.filter(i => i.id !== selectedInvite.id));
                                setSelectedInvite(null);
                            }}
                            />
                            <Button title="Accept" onPress={async () => {
                                if (!selectedInvite) return;
                                await acceptInvite(
                                    selectedInvite.id,
                                    selectedInvite.activityId,
                                    selectedInvite.author,
                                    userID
                                );
                                setInbox(prev => prev.filter(i => i.id !== selectedInvite.id));
                                setSelectedInvite(null);
                                router.push(`/pages/student/activities/${selectedInvite.activityId}`)}}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={localStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Inbox
                </Text>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => setModalVisible(true)}>
                    <Text>{'+'}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={localStyles.container}>
                <FlatList
                data={inbox}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={localStyles.seperator}/>}
                />
            </View>

        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        paddingVertical: 10,
        marginBottom: '5%'
    },

    container: {
        width: '90%',
        height: '37%',
        backgroundColor: '#afdaff',
        borderRadius: 8,
        flex: 1,
    },

    item: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    seperator:{
        height: 1,
        backgroundColor: '#97b9d6', 
    },
})

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        gap: 8,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 8,
    },
    value: {
        color: 'gray',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
});