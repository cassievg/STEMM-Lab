import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';


export default function StartActivity7() {
    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/student/activities/7')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Start activity 7
                </Text>
            </View>

            <View>

            </View>

        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
    container: {

    },
});