import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

import { FONT_FAMILY, globalColors } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { activityColors } from '../activities/activityStyles';

export default function Camera(){
    const [lastUri, setLastUri] = useState<string | null>(null);

    const { theme, changeTheme } = useTheme();

    const themed = activityColors[theme as ThemeKey];
    const globalThemed = globalColors[theme as ThemeKey];

    const handlePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted){
            Alert.alert('Permission Required', 'Camera access is needed to take a photo');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled){
            setLastUri(result.assets[0].uri);
        }
    };

    const handleVideo = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted){
            Alert.alert('Permission Required', 'Camera access is needed to record the video');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoMaxDuration: 60,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled){
            setLastUri(result.assets[0].uri);
        }
    };

    return (
        <View style={localStyles.container}>
            <View style={localStyles.button_row}>
                <TouchableOpacity
                    style={[localStyles.button, themed.camera_button]}
                    onPress={handlePhoto}
                    activeOpacity={0.8}>

                    <Text style={localStyles.button_icon}>
                        📸
                    </Text>
                    <Text style={[themed.camera_button_text, localStyles.button_text]}>
                        Take Photo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[localStyles.button, themed.camera_button]}
                    onPress={handleVideo}
                    activeOpacity={0.8}>

                    <Text style={localStyles.button_icon}>
                        🎥
                    </Text>
                    <Text style={[localStyles.button_text, themed.camera_button_text]}>
                        Record Video
                    </Text>
                </TouchableOpacity>
            </View>

            {lastUri && (
                <View style={localStyles.captured}>
                    <Text style={localStyles.captured_label}>
                        ✅ Captured successfully
                    </Text>
                    <Text style={localStyles.captured_uri} numberOfLines={1}>
                        {lastUri}
                    </Text>
                </View>
            )}

            <Text style={localStyles.tip}>
                💡 Tip: Place phone sideways to capture the view in frame.
            </Text>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        gap: 12,
    },

    button_row: {
        flexDirection: 'row',
        gap: 10,
    },

    button: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        gap: 6,
        borderWidth: 1,
    },

    button_icon: {
        fontSize: 28,
    },

    button_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    captured: {
        backgroundColor: '#f0faf4',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#4caf7d',
    },

    captured_label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: '#4caf7d',
        marginBottom: 2,
    },

    captured_uri: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: '#888888',
    },

    tip: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: '#888888',
        textAlign: 'center',
        fontStyle: 'italic',
    },

})