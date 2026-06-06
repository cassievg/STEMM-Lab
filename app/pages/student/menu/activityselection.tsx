import { fetchActivities, fetchCourses } from '@/src/services/databaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

type ActivityRow = {
    id: string;
    name: string;
    course: string;
}

const ACTIVITY_ICONS: Record<string, string> = {
    "EC1": "A",
    "EC2": "B",
    "EC3": "C",
    "EC4": "D",
    "HMS1": "E",
    "HMS2": "F",
    "HMS3": "G",
}

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
            <Text style={localStyles.card_label}>{ACTIVITY_ICONS[item.id] ?? "📘"}</Text>
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