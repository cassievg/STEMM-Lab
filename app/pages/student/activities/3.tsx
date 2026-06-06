import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';


export default function Activity3() {
    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/pages/student/menu/activityselection')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Activity 3
                </Text>
            </View>

            <View>

            </View>

        </SafeAreaView>
    );    
}