import { useAuth } from '@/src/context/AuthContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { fetchActivities, fetchCourses } from '@/src/services/databaseServices';
import { activityIsComplete } from '@/src/services/firebaseServices';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalColors, globalStyles } from '../../../styles';

import AppBannerAd from '@/src/components/bannerAd';
import { useTheme } from '@/src/context/ThemeContext';

type ActivityRow = {
    id: string;
    name: string;
    course: string;
}

const ACTIVITY_ICONS: Record<string, ImageSourcePropType> = {
    "1": require('@/assets/images/1.png'),
    "2": require('@/assets/images/2.png'),
    "3": require('@/assets/images/3.png'),
    "4": require('@/assets/images/4.png'),
    "5": require('@/assets/images/5.png'),
    "6": require('@/assets/images/6.png'),
    "7": require('@/assets/images/7.png'),
}

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 16 * 2 - 20) / 2;

export default function ActivitySelection() {
    const { theme, changeTheme } = useTheme();

    const themed = globalColors[theme as ThemeKey];

    const [activeTab, setActiveTab] = useState<string>('');

    const [courses, setCourses] = useState<string[]>([]);
    const [activities, setActivities] = useState<ActivityRow[]>([]);

    const { teamID } = useAuth();

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
        }

        loadData();  
    }, [])
    
    const filteredActivities = activities.filter(
        activity => activity.course === activeTab
    );

    const handleActivityRouting = async (activityId: string) => {
        const activityCompleted = await activityIsComplete(teamID, activityId);
        if (!activityCompleted) {
            router.push(`/pages/student/activities/${activityId}` as any);
        } else {
            router.push(`/pages/student/activities/leaderboards/${activityId}` as any);
        }
    }

    const renderActivity = ({item}: {item: ActivityRow}) => (
        <TouchableOpacity
            style={localStyles.card}
            onPress={() => handleActivityRouting(item.id)}
            activeOpacity={0.7}>

            <View style={[themed.card_box, localStyles.card_icon_box]}>
                <Image
                    source={ACTIVITY_ICONS[item.id]}
                    style={localStyles.card_icon}
                    resizeMode='contain' />
            </View>
            <Text style={[themed.text, localStyles.card_label]}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={[themed.back, globalStyles.back_button]}
                onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text style={[themed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[themed.text, globalStyles.page_title]}>
                    Activities
                </Text>
            </View>

            <View style={[themed.tab_bar, globalStyles.tab_bar]}>
                {courses.map((course) => (
                    <TouchableOpacity
                        key={course}
                        style={[globalStyles.tab, 
                            activeTab === course && [themed.tab_active]]}
                        onPress={() => setActiveTab(course)}
                        activeOpacity={0.8}>
                        <Text style={[
                            [themed.tab_label, globalStyles.tab_label],
                            activeTab === course && [themed.tab_label_active, globalStyles.tab_label_active],
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
            <AppBannerAd />
        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    card_icon: {
        width: 80,
    },

    card_label: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        textAlign: 'center',
    }
});