import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { globalStyles } from './styles';



export default function Settings() {
  const [sound, setSound] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [colourblindMode, setColourblindMode] = useState(true);

  const themes = ['Light','Dark'];
  const languages = ['English', 'Bahasa Indonesia']
  const [theme, setTheme] = useState('Light');
  const [language, setLanguage] = useState('English');
  const [picker, setPicker] = useState(null);

    return (
        <View style={globalStyles.page}>
            <View style={globalStyles.title_container}>
                <Text style={globalStyles.page_title}>
                    Settings
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
                </View>

                <View style={localStyles.settings}>
                    <Text style={localStyles.setting_text}>
                        Language
                    </Text>
                </View>

            </View>
                <View style={localStyles.save_button}>
                    <Pressable>
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
        width: '85%',
        height: '35%',
        backgroundColor: '#afdaff',
    },

    settings: {
        marginTop: '5%',
        paddingHorizontal: '2%',
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