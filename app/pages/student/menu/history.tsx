import { useAuth } from '@/src/context/AuthContext';
import { fetchHistory } from '@/src/services/databaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

type Progress = {
    id: string,
    activityId: string,
    userId: string,
    status: string,
}

type History = {
    activityName: string,
    
}

export default function History() {
    const { userID } = useAuth();
    const [history, setHistory] = useState<Progress[]>([]);

    useEffect(() => {
        if (!userID) return;

        const loadHistory = async () => {
            const res = await fetchHistory(userID);
            setHistory(res);
        }

        loadHistory();
    }, [userID])
    
    const renderItem = ({item}: {item: Progress}) => (
        <TouchableOpacity 
        style={localStyles.item}>
            <Text 
            style={globalStyles.text}
            numberOfLines={history.length}>
                Completed 
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={localStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    History
                </Text>
            </View>

            <View style={localStyles.container}>
                <FlatList
                data={history}
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