import { useAuth } from '@/src/context/AuthContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { fetchGlobalLdb, fetchLocalLdb, getRoomByTeamAndActivity, hasLocal } from '@/src/services/firebaseServices';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalColors, globalStyles } from '../../../../styles';

import { useTheme } from '@/src/context/ThemeContext';

type LdbRow = {
    teamName: string,
    score: number
}

export default function History() {
    const { theme } = useTheme();

    const themed = globalColors[theme as ThemeKey];

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
            <Text style={[themed.text, localStyles.rank]}>#{index + 1}</Text>
            <Text style={[themed.text, localStyles.team_name]}>{item.teamName}</Text>
            <Text style={[themed.text, localStyles.score]}>{item.score}</Text>
        </View>
    );

    const renderGlobal = ({item, index}: {item: LdbRow, index: number}) => (
        <View style={localStyles.item}>
            <Text style={[themed.text, localStyles.rank]}>#{index + 1}</Text>
            <Text style={[themed.text, localStyles.team_name]}>{item.teamName}</Text>
            <Text style={[themed.text, localStyles.score]}>{item.score}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.header}>
                <TouchableOpacity
                    style={[themed.back, globalStyles.back_button]}
                    onPress={() => router.push('/pages/student/menu/activityselection')}>
                    <Text style={[themed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[themed.text, globalStyles.page_title]}>Leaderboards</Text>
            </View>

            <View style={[themed.tab_bar, globalStyles.tab_bar]}>
                <TouchableOpacity
                    key={'local'}
                    style={[globalStyles.tab, 
                        activeTab === 'local' && [themed.tab_active]]}
                    onPress={() => setActiveTab('local')}
                    activeOpacity={0.8}>
                    <Text style={[
                        [themed.tab_label, globalStyles.tab_label],
                        activeTab === 'local' && [themed.tab_label_active, globalStyles.tab_label_active],
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit>
                        Local LDB
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    key={'global'}
                    style={[globalStyles.tab, 
                        activeTab === 'global' && [themed.tab_active]]}
                    onPress={() => setActiveTab('global')}
                    activeOpacity={0.8}>
                    <Text style={[
                        [themed.tab_label, globalStyles.tab_label],
                        activeTab === 'global' && [themed.tab_label_active, globalStyles.tab_label_active],
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit>
                        Global LDB
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={[(loading || (activeTab === 'local' ? localLDB.length === 0 : globalLDB.length === 0))
                ? themed.white_background : [themed.container, {borderRadius: 8, borderWidth: 2}], localStyles.list
            ]}>
                {activeTab === 'local' && (
                    loading ? (
                        <Text style={[themed.text, globalStyles.empty]}>Loading...</Text>
                    ) : localLDB.length === 0 ? (
                        <Text style={[themed.text, globalStyles.empty]}>No local leaderboard yet.</Text>
                    ) : (
                        <FlatList
                            data={localLDB}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({item, index}) => renderLocal({item, index})}
                            ItemSeparatorComponent={() => <View style={globalStyles.separator}/>}
                        />
                    )
                )}

                {activeTab === 'global' && (
                    loading ? (
                        <Text style={[themed.text, globalStyles.empty]}>Loading...</Text>
                    ) : globalLDB.length === 0 ? (
                        <Text style={[themed.text, globalStyles.empty]}>No global leaderboard yet.</Text>
                    ) : (
                        <FlatList
                            data={globalLDB}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({item, index}) => renderGlobal({item, index})}
                            ItemSeparatorComponent={() => <View style={[themed.separator, globalStyles.separator]}/>}
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
    },

    rank: {
        fontSize: 13,
        fontWeight: '500',
    },

    team_name: {
        fontSize: 15,
        fontWeight: '600',
    }
});