import { useAuth } from '@/src/context/AuthContext';
import { fetchGlobalLdb, fetchLocalLdb, getRoomByTeamAndActivity, hasLocal } from '@/src/services/firebaseServices';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../../styles';

type HistoryRow = {
    activityId: string,
    activityName: string,
    score: number,
    globalRank: number,
    localRank: number | null,
    submitDate: string
}

type LdbRow = {
    teamName: string,
    score: number
}

export default function History() {
    const { teamID } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const [localLDB, setLocalLDB] = useState<LdbRow[]>([]);
    const [globalLDB, setGlobalLDB] = useState<LdbRow[]>([]);

    const [activeTab, setActiveTab] = useState<string>('')

    const { id } = useLocalSearchParams<{id: string}>();

    useEffect(() => {
        if (!teamID || !id) return;

        setActiveTab('global');

        const loadLdb = async () => {
            setLoading(true);

            const loadGlobal = async () => {
            const global = await fetchGlobalLdb(id);
            setGlobalLDB(global);
            }

            const loadLocal = async () => {
                const hasRoom = await hasLocal(teamID, id);
                if (!hasRoom) return;

                const room = await getRoomByTeamAndActivity(teamID, id);
                if (!room) return;

                const local = await fetchLocalLdb(room.id, id);
                setLocalLDB(local);
            }

            loadLocal();
            loadGlobal();
            setLoading(false);
        }

        loadLdb();
    }, [teamID, id])

    const renderLocal = ({item, index}: {item: LdbRow, index: number}) => (
        <View style={localStyles.item}>
            <Text style={localStyles.rank}>#{index + 1}</Text>
            <Text style={localStyles.team_name}>{item.teamName}</Text>
            <Text style={localStyles.score}>{item.score}</Text>
        </View>
    );

    const renderGlobal = ({item, index}: {item: LdbRow, index: number}) => (
        <View style={localStyles.item}>
            <Text style={localStyles.rank}>#{index + 1}</Text>
            <Text style={localStyles.team_name}>{item.teamName}</Text>
            <Text style={localStyles.score}>{item.score}</Text>
        </View>
    );

    const handleLocalActivate = () => {
        setActiveTab('local');
        renderLocal;
    }

    const handleGlobalActivate = () => {
        setActiveTab('global');
        renderGlobal;
    }

    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity
                    style={globalStyles.back_button}
                    onPress={() => router.push('/pages/student/menu/activityselection')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>Leaderboards</Text>
            </View>

            <View style={localStyles.tab_bar}>
                <TouchableOpacity
                    key={'local'}
                    style={[localStyles.tab, 
                        activeTab === 'local' && localStyles.tab_active]}
                    onPress={() => setActiveTab('local')}
                    activeOpacity={0.8}>
                    <Text style={[
                        localStyles.tab_label,
                        activeTab === 'local' && localStyles.tab_label_active,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit>
                        Local LDB
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    key={'global'}
                    style={[localStyles.tab, 
                        activeTab === 'global' && localStyles.tab_active]}
                    onPress={() => setActiveTab('global')}
                    activeOpacity={0.8}>
                    <Text style={[
                        localStyles.tab_label,
                        activeTab === 'global' && localStyles.tab_label_active,
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit>
                        Global LDB
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={localStyles.list}>
                {activeTab === 'local' && (
                    loading ? (
                        <Text style={localStyles.empty}>Loading...</Text>
                    ) : localLDB.length === 0 ? (
                        <Text style={localStyles.empty}>No local leaderboard yet.</Text>
                    ) : (
                        <FlatList
                            data={localLDB}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({item, index}) => renderLocal({item, index})}
                            ItemSeparatorComponent={() => <View style={localStyles.separator}/>}
                        />
                    )
                )}

                {activeTab === 'global' && (
                    loading ? (
                        <Text style={localStyles.empty}>Loading...</Text>
                    ) : globalLDB.length === 0 ? (
                        <Text style={localStyles.empty}>No global leaderboard yet.</Text>
                    ) : (
                        <FlatList
                            data={globalLDB}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({item, index}) => renderGlobal({item, index})}
                            ItemSeparatorComponent={() => <View style={localStyles.separator}/>}
                        />
                    )
                )}
            </View>
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
        marginTop: 20,
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

    rank: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },

    team_name: {
        fontSize: 15,
        fontWeight: '600',
    },

    tab_bar: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#97b9d6',
        backgroundColor: '#ffffff',
    },

    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },

    tab_active: {
        borderBottomColor: '#97b9d6',
    },

    tab_label: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        color: '#888888',
        fontWeight: '400',
        textAlign: 'center',
        width: '100%'
    },

    tab_label_active: {
        color: '#111111',
        fontWeight: '800',
    },
});