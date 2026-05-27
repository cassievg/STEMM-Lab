import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from './styles';


export default function ActivitySelection() {
    return (
        <SafeAreaView style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/studenthome')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Activities
                </Text>
            </View>
        </SafeAreaView>
    );    
}

const styles = StyleSheet.create({
    
});