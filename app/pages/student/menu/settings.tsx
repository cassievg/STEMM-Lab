import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { globalColors, globalStyles } from '../../../styles';

export default function Settings() {
    const [picker, setPicker] = useState<'theme' | null>(null);

    const { theme, changeTheme, themeList } = useTheme();

    const themed = globalColors[theme as ThemeKey];

    return (
        <View style={[themed.page, globalStyles.page]}>
            <View style={globalStyles.header}>
                <TouchableOpacity
                    style={[themed.back, globalStyles.back_button]}
                    onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text style={[themed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={[themed.text, globalStyles.page_title]}>
                    Settings
                </Text>
            </View>

            <View style={[themed.container, localStyles.container]}>
                <View style={localStyles.settings}>
                    <Text style={[themed.text, localStyles.setting_text]}>
                        Theme
                    </Text>
                    <View style={globalStyles.picker_container}>
                        <Picker
                            selectedValue={theme}
                            onValueChange={(value) => changeTheme(value)}
                            style={[themed.picker, {color: '#000000'}, globalStyles.picker]}
                        >
                            {themeList.map((t: any) => (
                                <Picker.Item
                                    key={t}
                                    label={t.charAt(0).toUpperCase() + t.slice(1)}
                                    value={t}
                                    style={[globalStyles.picker_text]}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <Modal
                visible={!!picker}
                transparent
                animationType="fade">
                    <TouchableOpacity
                        style={localStyles.overlay}
                        activeOpacity={1}
                        onPress={() => setPicker(null)}
                    >
                        <View style={localStyles.modal}>
                            <FlatList
                                data={themeList}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={localStyles.option}
                                        onPress={() => {
                                            setPicker(null);
                                            if (picker === 'theme') {
                                                changeTheme(item);
                                            }
                                        }}
                                    >
                                        <Text style={localStyles.option_text}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        width: '90%',
        flexGrow: 0,
        flexShrink: 1,
        maxHeight: '75%',
        paddingHorizontal: '5%',
        paddingBottom: '7%'
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
        marginLeft: 10,
    },

    modal: {
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
    },

    option_text: {
        fontSize: 16,
        color: '#111'
    },
})