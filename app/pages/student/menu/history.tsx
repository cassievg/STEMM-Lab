import { useAuth } from '@/src/context/AuthContext';
import { fetchTeamHistory } from '@/src/services/firebaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

type HistoryRow = {
    activityId: string,
    activityName: string,
    score: number,
    globalRank: number,
    localRank: number | null,
    submitDate: string
}

export default function History() {
    const { teamID } = useAuth();
    const [history, setHistory] = useState<HistoryRow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            if (!teamID) return;

            const data = await fetchTeamHistory(teamID);
            setHistory(data);
            setLoading(false);
        }

        loadHistory();
    }, [teamID])

    const renderItem = ({item}: {item: HistoryRow}) => (
        <View style={localStyles.item}>
            <View style={localStyles.item_left}>
                <Text style={localStyles.activity_name}>{item.activityName || item.activityId || 'Unknown Activity'}</Text>
                <Text style={localStyles.score}>Score: {item.score ?? 'N/A'}</Text>
            </View>
            <View style={localStyles.item_right}>
                {item.localRank && (
                    <Text style={localStyles.rank_local}>#{item.localRank} local</Text>
                )}
                <Text style={localStyles.rank_global}>#{item.globalRank} global</Text>
            </View>
        </View>
    )

    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity
                    style={globalStyles.back_button}
                    onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>History</Text>
            </View>

            {loading ? (
                <Text style={localStyles.empty}>Loading...</Text>
            ) : history.length === 0 ? (
                <Text style={localStyles.empty}>No activity history yet.</Text>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.activityId + item.submitDate}
                    renderItem={renderItem}
                    contentContainerStyle={localStyles.list}
                    ItemSeparatorComponent={() => <View style={localStyles.separator} />}
                />
            )}
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    list: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#afdaff',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#97b9d6',
        overflow: 'hidden',
    },

    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        width: '100%',
    },

    item_left: {
        flex: 1,
        gap: 4,
    },

    item_right: {
        alignItems: 'flex-end',
        gap: 4,
        minWidth: 90,
    },

    activity_name: {
        fontSize: 15,
        fontWeight: '600',
    },
    
    score: {
        fontSize: 13,
        color: '#555',
    },

    rank_local: {
        fontSize: 13,
        color: '#007AFF',
        fontWeight: '500',
    },

    rank_global: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },

    separator: {
        height: 1,
        backgroundColor: '#97b9d6',
    },

    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: 'gray',
    },
});