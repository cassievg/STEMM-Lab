import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from './styles';

type Notification = {
    id: string;
    message: string;
    date: string;
}

const notifications: Notification[] = [
    {id: '1', message: "You've been invited to join Team A.", date: '20260526'},
    {id: '2', message: "You placed 5th in Activity 2.", date: '20260527'},
]

export default function Inbox() {
    const renderItem = ({item}: {item: Notification}) => (
        <TouchableOpacity 
        style={localStyles.item}
        onPress={() => console.log('Working', item.id)}>
            <Text 
            style={globalStyles.text}
            numberOfLines={notifications.length}>
                {item.message}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={localStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/studenthome')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Inbox
                </Text>
            </View>
            
            <View style={localStyles.container}>
                <FlatList
                data={notifications}
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
        width: '100%',
        paddingVertical: 10,
        marginBottom: '5%'
    },

    container: {
        width: '100%',
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