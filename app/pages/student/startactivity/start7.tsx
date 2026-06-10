import { globalColors, globalStyles } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToolsPanel from '../tools/panel';
import { localColors, localStyles } from './startStyles';

type AttemptKey = 'action1' | 'action2' | 'action3';

type AttemptData = {
    prediction: string,
    outcome: string,
    isUserCorrect: 'yes' | 'no' | null;
};

const TABS: {key: AttemptKey; label: string; description: string}[] = [
    {key: 'action1', label: 'Movement 1', description: 'First movement'},
    {key: 'action2', label: 'Movement 2', description: 'Second movement'},
    {key: 'action3', label: 'Movement 3', description: 'Third movement'},
];

const DEFAULT_ATTEMPT: AttemptData = {
    prediction: '',
    outcome: '',
    isUserCorrect: null,
};

const isAttemptComplete = (attempt: AttemptData) => 
    attempt.prediction.trim() !== '' &&
    attempt.outcome.trim() !== '' &&
    attempt.isUserCorrect !== null

export default function StartActivity1() {
    const { theme, changeTheme } = useTheme();
    
    const themed = globalColors[theme as ThemeKey];
    const localThemed = localColors[theme as ThemeKey];

    const [activeTab, setActiveTab] = useState<AttemptKey>('action1');
    const [attempt, setAttempt] = useState<Record<AttemptKey, AttemptData>>({
        action1: {...DEFAULT_ATTEMPT},
        action2: {...DEFAULT_ATTEMPT},
        action3: {...DEFAULT_ATTEMPT},
    });

    const updateField = (field : keyof AttemptData, value: any) => {
        setAttempt((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab], [field]: value,
            },
        }));
    };

    const handleSubmit = () => {
        Alert.alert('Submitted', 'Your results have been saved');
        router.push('/pages/student/quiz/quiz7');
    };

    const current = attempt[activeTab];

    const completeCount = Object.values(attempt).filter(isAttemptComplete).length;

    return (
        <SafeAreaView style={[themed.page, localStyles.page]}>
            <View style={[localThemed.header_container, localStyles.header]}>
                <TouchableOpacity 
                style={[themed.back, localStyles.back_button]}
                onPress={() => router.back()}>
                    <Text style={themed.text}>{'<'}</Text>
                </TouchableOpacity>
                <View style={localStyles.header_title_container}>
                    <Text style={[themed.text, localStyles.header_title]}>
                        Activity 7 · In Progress
                    </Text>
                    <Text style={[themed.text, localStyles.header_subtitle]}>
                        Breathing Pace Timer Challenge
                    </Text>
                </View>
                <View style={[themed.white_background, localStyles.header_progress]}>
                    <Text style={[themed.text, localStyles.header_progress_text]}>
                        {completeCount}/3
                    </Text>
                </View>
            </View>

            <View style={[themed.tab_bar, localStyles.tab_row]}>
                {TABS.map((tab) => {
                    const complete = isAttemptComplete(attempt[tab.key]);
                    return(
                        <TouchableOpacity
                            key={tab.key}
                            style={[globalStyles.tab, activeTab === tab.key && themed.tab_active]}
                            onPress={() => setActiveTab(tab.key)}
                            activeOpacity={0.75}>
                                
                                <Text style={localStyles.tab_complete}>
                                    {complete ? '✅' : '⬜'}
                                </Text>
                                <Text style={[[themed.tab_label, globalStyles.tab_label], activeTab === tab.key && [themed.tab_label_active, globalStyles.tab_label_active]]}>
                                    {tab.label}
                                </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={[localThemed.header_container, localStyles.attempt_description_container]}>
                <Text style={[themed.text, localStyles.attempt_description]}>
                    {TABS.find((t) => t.key === activeTab)?.description}
                </Text>
            </View>

            <ScrollView
                style={[themed.white_background, localStyles.scroll]}
                contentContainerStyle={localStyles.scroll_content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>

                    <Text style={[themed.text, localStyles.section_heading]}>
                        📊 Record Results
                    </Text>

                    <View style={localStyles.input_container}>
                        <Text style={[themed.text, localStyles.input_label]}>
                            Breath per Minute (Prediction)
                        </Text>
                        <View style={localStyles.input_row}>
                            <TextInput 
                                style={[themed.white_background, localStyles.input]}
                                placeholder='e.g. 6 breath per minute'
                                placeholderTextColor='#969696'
                                keyboardType='decimal-pad'
                                value={current.prediction}
                                onChangeText={(val) => updateField('prediction', val)}>
                            </TextInput>
                            <Text style={[themed.text, localStyles.input_unit]}>
                                /min
                            </Text>
                        </View>
                    </View>

                    <View style={localStyles.input_container}>
                        <Text style={[themed.text, localStyles.input_label]}>
                            Outcome (Time + Movement)
                        </Text>
                        <View style={localStyles.input_row}>
                            <TextInput 
                                style={[themed.white_background, localStyles.input]}
                                placeholder='e.g. 5mm in 20 seconds'
                                placeholderTextColor='#969696'
                                keyboardType='decimal-pad'
                                value={current.outcome}
                                onChangeText={(val) => updateField('outcome', val)}>
                            </TextInput>
                            <Text style={[themed.text, localStyles.input_unit]}>
                                /min
                            </Text>
                        </View>
                    </View>

                    <View style={localStyles.input_container}>
                        <Text style={[themed.text, localStyles.input_label]}>
                            Were you right with your prediction?
                        </Text>
                        <View style={localStyles.toggle_row}>
                            <TouchableOpacity
                                style={[[themed.white_background, localStyles.toggle_button], current.isUserCorrect === 'yes' && themed.pressable_default]}
                                onPress={() => updateField('isUserCorrect', 'yes')}>

                                <Text style={[[themed.text, localStyles.toggle_text], current.isUserCorrect === 'yes' && [themed.text, localStyles.toggle_text_active]]}>
                                    ✔ Yes
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[[themed.white_background, localStyles.toggle_button], current.isUserCorrect === 'no' && themed.pressable_default]}
                                onPress={() => updateField('isUserCorrect', 'no')}>

                                <Text style={[[themed.text, localStyles.toggle_text], current.isUserCorrect === 'no' && [themed.text, localStyles.toggle_text_active]]}>
                                    ✖ No
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{height: 32}}/>
            </ScrollView>

            <View style={[themed.white_background, localStyles.footer]}>
                {completeCount === 3 ? (
                    <TouchableOpacity
                        style={[localThemed.start_button, localStyles.submit_button]}
                        onPress={handleSubmit}
                        activeOpacity={0.85}>

                        <Text style={localStyles.submit_button_text}>
                            Submit Results
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[themed.pressable_default, localStyles.next_button]}
                        onPress={() => {
                            const i = TABS.findIndex((t) => t.key === activeTab);
                            if (i < TABS.length - 1) {
                                setActiveTab(TABS[i + 1].key);
                            }
                        }}
                        activeOpacity={0.85}>

                        <Text style={localStyles.next_button_text}>
                            {activeTab === 'action3' ? 'Review All' : 'Next Attempt →'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <ToolsPanel />
        </SafeAreaView>
    );    
}