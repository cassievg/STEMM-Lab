import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../../../styles';

import { useTheme } from '@/src/context/ThemeContext';

export default function Settings() {
    const [sound, setSound] = useState(true);
    const [animations, setAnimations] = useState(true);
    const [colourblindMode, setColourblindMode] = useState(true);

    const languages = ['English', 'Bahasa Indonesia'];
    const [language, setLanguage] = useState('English');
    const [picker, setPicker] = useState<'theme' | 'language' | null>(null);

    const { getThemedStyle, themeList, theme, changeTheme } = useTheme();

    const globalThemedStyles = useMemo(() => {
        return getThemedStyle(globalStyles);
    }, [getThemedStyle]);

    const localThemedStyles = useMemo(() => {
        return getThemedStyle(localStyles);
    }, [getThemedStyle]);

    return (
        <View style={globalThemedStyles.page}>
            <View style={globalThemedStyles.header}>
                <TouchableOpacity
                    style={globalThemedStyles.back_button}
                    onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text style={globalThemedStyles.text}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalThemedStyles.page_title}>
                    Settings
                </Text>
            </View>

            <View style={localThemedStyles.container}>
                <View style={localThemedStyles.settings}>
                    <Text style={localThemedStyles.setting_text}>
                        Sound
                    </Text>
                    <Switch
                        style={localThemedStyles.setting_switch}
                        value={sound}
                        onValueChange={(value) => setSound(value)}
                    />
                </View>

                <View style={localThemedStyles.settings}>
                    <Text style={localThemedStyles.setting_text}>
                        Animation
                    </Text>
                    <Switch
                        style={localThemedStyles.setting_switch}
                        value={animations}
                        onValueChange={(value) => setAnimations(value)}
                    />
                </View>

                <View style={localThemedStyles.settings}>
                    <Text style={localThemedStyles.setting_text}>
                        Colourblind mode
                    </Text>
                    <Switch
                        style={localThemedStyles.setting_switch}
                        value={colourblindMode}
                        onValueChange={(value) => setColourblindMode(value)}
                    />
                </View>

                <View style={localThemedStyles.settings}>
                    <Text style={localThemedStyles.setting_text}>
                        Theme
                    </Text>
                    <TouchableOpacity
                        style={localThemedStyles.setting_drop_down}
                        onPress={() => setPicker('theme')}>
                        <Text style={localThemedStyles.setting_text}>
                            {theme}
                        </Text>
                        <Text style={localThemedStyles.drop_down_v}>
                            v
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={localThemedStyles.settings}>
                    <Text style={localThemedStyles.setting_text}>
                        Language
                    </Text>
                    <TouchableOpacity
                        style={localThemedStyles.setting_drop_down}
                        onPress={() => setPicker('language')}>
                        <Text style={localThemedStyles.setting_text}>
                            {language}
                        </Text>
                        <Text style={localThemedStyles.drop_down_v}>
                            v
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={!!picker} transparent animationType="fade">
                    <TouchableOpacity
                        style={localThemedStyles.overlay}
                        activeOpacity={1}
                        onPress={() => setPicker(null)}
                    >
                        <View style={localThemedStyles.modal}>
                            <FlatList
                                data={picker === 'theme' ? themeList : picker === 'language' ? languages : []}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={localThemedStyles.option}
                                        onPress={() => {
                                            setPicker(null);
                                            if (picker === 'theme') {
                                                changeTheme(item);
                                            } else {
                                                setLanguage(item);
                                            }
                                        }}
                                    >
                                        <Text style={localThemedStyles.option_text}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={localThemedStyles.save_button}>
                <Pressable
                    onPress={() => { router.push('/pages/student/menu/homescreen') }}
                    style={({ pressed }) => [
                        pressed ? globalThemedStyles.pressable_onPress : globalThemedStyles.pressable_default
                    ]}>
                    <Text style={localThemedStyles.save_text}>
                        Save
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const localStyles = {
    light : StyleSheet.create({
    container: {
        width: '90%',
        height: '37%',
        backgroundColor: '#afdaff',
        borderRadius: 8,
    },

    settings: {
        marginTop: '8%',
        paddingHorizontal: '3%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    setting_text: {
        fontSize: 18,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
    },

    setting_switch: {
        marginLeft: 'auto',
    },

    setting_drop_down: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 120,
        height: 42,
        borderWidth: 1,
        borderColor: '#97b9d6',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginLeft: 'auto',
    },

    drop_down_text: {
        fontSize: 16,
        fontWeight: '600',
    },

    drop_down_v: {
        fontSize: 14,
        color: '#888',
        marginLeft: 10,
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },

    overlay: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 40,
    },

    option: {
        padding: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee'
    },

    option_text: {
        fontSize: 16,
        color: '#111'
    },

    save_button: {
        width: '55%',
        height: '5%',
        marginTop: '8%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#afdaff',
        borderRadius: 10,
    },

    save_text: {
        fontSize: 18,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        textAlign: "center",
    }
}),
    dark : StyleSheet.create({
    container: {
        width: '90%',
        height: '37%',
        backgroundColor: '#afdaff',
        borderRadius: 8,
    },

    settings: {
        marginTop: '8%',
        paddingHorizontal: '3%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    setting_text: {
        fontSize: 18,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
    },

    setting_switch: {
        marginLeft: 'auto',
    },

    setting_drop_down: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 120,
        height: 42,
        borderWidth: 1,
        borderColor: '#97b9d6',
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginLeft: 'auto',
    },

    drop_down_text: {
        fontSize: 16,
        fontWeight: '600',
    },

    drop_down_v: {
        fontSize: 14,
        color: '#888',
        marginLeft: 10,
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },

    overlay: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 40,
    },

    option: {
        padding: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee'
    },

    option_text: {
        fontSize: 16,
        color: '#111'
    },

    save_button: {
        width: '55%',
        height: '5%',
        marginTop: '8%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#afdaff',
        borderRadius: 10,
    },

    save_text: {
        fontSize: 18,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        textAlign: "center",
}})}