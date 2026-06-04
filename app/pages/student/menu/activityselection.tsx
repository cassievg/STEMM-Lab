import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

type Activity = {
    id: string;
    name: string;
    icon: string;
    status: boolean;
};

type TabKey = 'engineering' | 'health_medical';

const ACTIVITIES = {
    engineering: [
        {id: '1', name: 'Parachute Drop Challenge', icon: 'A', status: false},
        {id: '2', name: 'Sound Pollution Hunter', icon: 'B', status: false},
        {id: '3', name: 'Hand Fan Challenge', icon: 'C', status: false},
        {id: '4', name: 'Earthquake-Resistant Structure', icon: 'D', status: false},
    ],
    health_medical: [
        {id: '5', name: 'Human Performance Lab', icon: 'E', status: false},
        {id: '6', name: 'Reaction Board Challenge', icon: 'F', status: false},
        {id: '7', name: 'Breathing Pace Trainer', icon: 'G', status: false},
    ]
};

const TABS: {key: TabKey; label: string}[] = [
    {key: 'engineering', label: 'Engineering'},
    {key: 'health_medical', label: 'Health and Medical Science'},
];

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 16 * 2 - 20) / 2;

export default function ActivitySelection() {
    const [activeTab, setActiveTab] = useState<'engineering' | 'health_medical'>('engineering');
    const activity = ACTIVITIES[activeTab];
    
    const handleActivityPress = (item: Activity) => {
        router.push(`/student/activities/${item.id}` as any);
    };


    const renderActivity = ({item}: {item: Activity}) => (
        <TouchableOpacity
            style={localStyles.card}
            onPress={() => handleActivityPress(item)}
            activeOpacity={0.7}>

            <View style={localStyles.card_icon_box}>
                <Text style={localStyles.card_icon}>{item.icon}</Text>
            </View>
            <Text style={localStyles.card_label}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={localStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/homescreen')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Activities
                </Text>
            </View>

            <View style={localStyles.tab_bar}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[localStyles.tab, 
                            activeTab === tab.key && localStyles.tab_active]}
                        onPress={() => setActiveTab(tab.key)}
                        activeOpacity={0.8}>
                        <Text style={[
                            localStyles.tab_label,
                            activeTab === tab.key && localStyles.tab_label_active,
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                key={activeTab}
                data={activity}
                renderItem={renderActivity}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={localStyles.grid}
                columnWrapperStyle={localStyles.row}
                showsVerticalScrollIndicator={false}>
            </FlatList>
        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
    page:{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },

    tab_bar: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#97b9d6',
        backgroundColor: '#ffffff'
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
    },

    tab_label_active: {
        color: '#111111',
        fontWeight: '800',
    },

    grid: {
        padding: 16,
    },

    row: {
        gap: 20,
        marginBottom: 14,
    },

    card: {
        width: cardSize,
        alignItems: 'center',
    },

    card_icon_box: {
        width: cardSize,
        height: cardSize,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#97b9d6',
        backgroundColor: '#afdaff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    card_icon: {
        fontSize: 28,
    },

    card_label: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        textAlign: 'center',
    }
});