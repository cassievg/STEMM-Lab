import { fetchActivities, fetchCourses } from '@/src/database/databaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

// type Activity = {
//     id: string;
//     name: string;
//     icon: string;
//     status: boolean;
// };

type ActivityRow = {
    id: string;
    name: string;
    course: string;
}

// const ACTIVITIES = {
//     engineering: [
//         {id: '1', name: 'Parachute Drop Challenge', icon: 'A', status: false},
//         {id: '2', name: 'Sound Pollution Hunter', icon: 'B', status: false},
//         {id: '3', name: 'Hand Fan Challenge', icon: 'C', status: false},
//         {id: '4', name: 'Earthquake-Resistant Structure', icon: 'D', status: false},
//     ],
//     health_medical: [
//         {id: '5', name: 'Human Performance Lab', icon: 'E', status: false},
//         {id: '6', name: 'Reaction Board Challenge', icon: 'F', status: false},
//         {id: '7', name: 'Breathing Pace Trainer', icon: 'G', status: false},
//     ]
// };

// const TABS: {key: TabKey; label: string}[] = [
//     {key: 'engineering', label: 'Engineering'},
//     {key: 'health_medical', label: 'Health and Medical Science'},
// ];

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 16 * 2 - 20) / 2;

export default function ActivitySelection() {
    const [activeTab, setActiveTab] = useState<string>('');

    const [courses, setCourses] = useState<string[]>([]);
    const [activities, setActivities] = useState<ActivityRow[]>([]);

    const formatCourseName = (str:string): string => {
        return str.replace(/(^\w|_\w)/g, (match) => match.replace('_', ' ').toUpperCase());
    }

    useEffect(() => {
        const loadData = async () => {
            const fetchedCourses = await fetchCourses();
            const fetchedActivities = await fetchActivities();

            setCourses(fetchedCourses);
            setActivities(fetchedActivities);

            if (fetchedCourses.length > 0) {
                setActiveTab(fetchedCourses[0]);
            }
            
            console.log(fetchedCourses);
            console.log(fetchedActivities);
        }

        loadData();  
    }, [])
    
    const filteredActivities = activities.filter(
        activity => activity.course === activeTab
    );

    const renderActivity = ({item}: {item: ActivityRow}) => (
        <TouchableOpacity
            style={localStyles.card}
            onPress={() => router.push(`/pages/student/activities/${item.id}` as any)}
            activeOpacity={0.7}>

            <View style={localStyles.card_icon_box}>
                <Text style={localStyles.card_icon}>A</Text>
            </View>
            <Text style={localStyles.card_label}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={localStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Activities
                </Text>
            </View>

            <View style={localStyles.tab_bar}>
                {courses.map((course) => (
                    <TouchableOpacity
                        key={course}
                        style={[localStyles.tab, 
                            activeTab === course && localStyles.tab_active]}
                        onPress={() => setActiveTab(course)}
                        activeOpacity={0.8}>
                        <Text style={[
                            localStyles.tab_label,
                            activeTab === course && localStyles.tab_label_active,
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit>
                            {formatCourseName(course)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredActivities}
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