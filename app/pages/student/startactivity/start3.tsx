import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';

import { useTheme } from '@/src/context/ThemeContext';

export default function StartActivity3() {
    const { getThemedStyle } = useTheme();

    const globalThemedStyles = useMemo(() => {
        return getThemedStyle(globalStyles);
    }, [getThemedStyle]);

    return (
        <SafeAreaView style={globalThemedStyles.page}>
            <View style={globalThemedStyles.header}>
                <TouchableOpacity 
                style={globalThemedStyles.back_button}
                onPress={() => router.push('/student/activities/3')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalThemedStyles.page_title}>
                    Start activity 3
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