import { useAuth } from '@/src/context/AuthContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { fetchTeamHistory } from '@/src/services/firebaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalColors, globalStyles } from '../../../styles';

import { useTheme } from '@/src/context/ThemeContext';

type HistoryRow = {
    activityId: string,
    activityName: string,
    score: number,
    globalRank: number,
    localRank: number | null,
    submitDate: string
}

export default function History() {
    const { theme, changeTheme } = useTheme();

    const themed = globalColors[theme as ThemeKey];
    
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
                <Text style={[themed.text, globalStyles.text]}>{item.activityName || item.activityId || 'Unknown Activity'}</Text>
                <Text style={[themed.text, localStyles.score]}>Score: {item.score ?? 'N/A'}</Text>
            </View>
            <View style={localStyles.item_right}>
                {item.localRank && (
                    <Text style={[themed.text, localStyles.rank_local]}>#{item.localRank} local</Text>
                )}
                <Text style={[themed.text, localStyles.rank_global]}>#{item.globalRank} global</Text>
            </View>
        </View>
    )

    return (
        <SafeAreaView style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.header}>
                <TouchableOpacity
                    style={[themed.back, globalStyles.back_button]}
                    onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text style={[themed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[themed.text, globalStyles.page_title]}>History</Text>
            </View>

            {loading ? (
                <Text style={[themed.empty, globalStyles.empty]}>Loading...</Text>
            ) : history.length === 0 ? (
                <Text style={[themed.empty, globalStyles.empty]}>No activity history yet.</Text>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.activityId + item.submitDate}
                    renderItem={renderItem}
                    contentContainerStyle={[themed.container, localStyles.list]}
                    ItemSeparatorComponent={() => <View style={[themed.separator, globalStyles.separator]} />}
                />
            )}
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    list: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: 8,
        borderWidth: 2,
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
    },

    rank_local: {
        fontSize: 13,
        fontWeight: '500',
    },

    rank_global: {
        fontSize: 13,
        fontWeight: '500',
    }
});