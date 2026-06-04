import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../../../styles';



export default function Settings() {
  const [sound, setSound] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [colourblindMode, setColourblindMode] = useState(true);

  const themes = ['Light','Dark'];
  const languages = ['English', 'Bahasa Indonesia']
  const [theme, setTheme] = useState('Light');
  const [language, setLanguage] = useState('English');
  const [picker, setPicker] = useState<'theme' | 'language' | null>(null);

    return (
        <View style={globalStyles.page}>
            <View style={globalStyles.header}>
                <TouchableOpacity 
                style={globalStyles.back_button}
                onPress={() => router.push('/pages/student/menu/homescreen')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text style={globalStyles.page_title}>
                    Setting
                </Text>
            </View>

            <View style={localStyles.container}>
                <View style={localStyles.settings}>
                    <Text style={localStyles.setting_text}>
                        Sound
                    </Text>
                    <Switch 
                    style={localStyles.setting_switch}
                    value={sound}
                    onValueChange={(value) => setSound(value)}
                    />
                </View>

                <View style={localStyles.settings}>
                    <Text style={localStyles.setting_text}>
                        Animation
                    </Text>
                    <Switch 
                    style={localStyles.setting_switch}
                    value={animations}
                    onValueChange={(value) => setAnimations(value)}
                    />
                </View>

                <View style={localStyles.settings}>
                    <Text style={localStyles.setting_text}>
                        Colourblind mode
                    </Text>
                <Switch 
                    style={localStyles.setting_switch}
                    value={colourblindMode}
                    onValueChange={(value) => setColourblindMode(value)}
                    />
                </View>

                <View style={localStyles.settings}>
                    <Text style={localStyles.setting_text}>
                        Theme
                    </Text>
                    <TouchableOpacity
                        style={localStyles.setting_drop_down}
                        onPress={() => setPicker('theme')}>
                        <Text style={localStyles.setting_text}>
                            {theme}
                        </Text>
                        <Text style={localStyles.drop_down_v}>
                            v
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={localStyles.settings}>
                    <Text style={localStyles.setting_text}>
                        Language
                    </Text>
                    <TouchableOpacity
                        style={localStyles.setting_drop_down}
                        onPress={() => setPicker('language')}>
                        <Text style={localStyles.setting_text}>
                            {language}
                        </Text>
                        <Text style={localStyles.drop_down_v}>
                            v
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={!!picker} transparent animationType="fade">
                    <TouchableOpacity
                        style={localStyles.overlay}
                        activeOpacity={1}
                        onPress={() => setPicker(null)}
                    >
                        <View style={localStyles.modal}>
                            <FlatList
                                data={picker === 'theme' ? themes : picker === 'language' ? languages: []}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={localStyles.option}
                                    onPress={() => {
                                    setPicker(null);
                                    if (picker === 'theme') {
                                        setTheme(item);
                                    } else {
                                        setLanguage(item);
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
                <View style={localStyles.save_button}>
                    <Pressable
                    onPress={() => {router.push('/pages/student/menu/homescreen')}}
                    style={({ pressed }) => [
                    pressed ? globalStyles.pressable_onPress : globalStyles.pressable_default
                    ]}>
                        <Text style={localStyles.save_text}>
                            Save
                        </Text>
                    </Pressable>
                </View>
        </View>
    );    
}

const localStyles = StyleSheet.create({
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

    drop_down_text:{
        fontSize:16,
        fontWeight: '600',
    },

    drop_down_v:{
        fontSize:14,
        color: '#888',
        marginLeft: 10,
    },

    modal:{
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },

    overlay:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        padding: 40,
    },

    option:{
        padding: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee'
    },

    option_text:{
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
});