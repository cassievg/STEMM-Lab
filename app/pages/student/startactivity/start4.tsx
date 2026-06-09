import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToolsPanel from '../tools/panel';

type AttemptKey = 'action1' | 'action2' | 'action3';

type AttemptData = {
    prediction: string,
    outcome: string,
    isUserCorrect: 'yes' | 'no' | null;
};

const BLUE = '#97b9d6';
const LIGHT_BLUE = '#afdaff';
const WHITE = '#ffffff';
const FONT_FAMILY = 'Trebuchet MS, Roboto, sans-serif';

const TABS: {key: AttemptKey; label: string; description: string}[] = [
    {key: 'action1', label: 'Design 1', description: 'Try any different design'},
    {key: 'action2', label: 'Design 2', description: 'Try any different design'},
    {key: 'action3', label: 'Design 3', description: 'Try any different design'},
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
        router.push('/pages/student/quiz/quiz1');
    };

    const current = attempt[activeTab];

    const completeCount = Object.values(attempt).filter(isAttemptComplete).length;

    return (
        <SafeAreaView style={localStyles.page}>
            <View style={localStyles.header}>
                <TouchableOpacity 
                style={localStyles.back_button}
                onPress={() => router.push('/pages/student/activities/1')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <View style={localStyles.header_title_container}>
                    <Text style={localStyles.header_title}>
                        Activity 4 · In Progress
                    </Text>
                    <Text style={localStyles.header_subtitle}>
                        Earthquake-Resistant Structure Challenge
                    </Text>
                </View>
                <View style={localStyles.header_progress}>
                    <Text style={localStyles.header_progress_text}>
                        {completeCount}/3
                    </Text>
                </View>
            </View>

            <View style={localStyles.tab_row}>
                {TABS.map((tab) => {
                    const complete = isAttemptComplete(attempt[tab.key]);
                    return(
                        <TouchableOpacity
                            key={tab.key}
                            style={[localStyles.tab, activeTab === tab.key && localStyles.tab_active]}
                            onPress={() => setActiveTab(tab.key)}
                            activeOpacity={0.75}>
                                
                                <Text style={localStyles.tab_complete}>
                                    {complete ? '✅' : '⬜'}
                                </Text>
                                <Text style={[localStyles.tab_label, activeTab === tab.key && localStyles.tab_label_active]}>
                                    {tab.label}
                                </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={localStyles.attempt_description_container}>
                <Text style={localStyles.attempt_description}>
                    {TABS.find((t) => t.key === activeTab)?.description}
                </Text>
            </View>

            <ScrollView
                style={localStyles.scroll}
                contentContainerStyle={localStyles.scroll_content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>

                    <Text style={localStyles.section_heading}>
                        📊 Record Results
                    </Text>

                    <View style={localStyles.input_container}>
                        <Text style={localStyles.input_label}>
                            Phone moves (Distance)
                        </Text>
                        <View style={localStyles.input_row}>
                            <TextInput 
                                style={localStyles.input}
                                placeholder='e.g. 1'
                                placeholderTextColor='#969696'
                                keyboardType='decimal-pad'
                                value={current.prediction}
                                onChangeText={(val) => updateField('prediction', val)}>
                            </TextInput>
                            <Text style={localStyles.input_unit}>
                                cm
                            </Text>
                        </View>
                    </View>

                    <View style={localStyles.input_container}>
                        <Text style={localStyles.input_label}>
                            Outcome (in Degrees)
                        </Text>
                        <View style={localStyles.input_row}>
                            <TextInput 
                                style={localStyles.input}
                                placeholder='e.g. 4'
                                placeholderTextColor='#969696'
                                keyboardType='decimal-pad'
                                value={current.outcome}
                                onChangeText={(val) => updateField('outcome', val)}>
                            </TextInput>
                            <Text style={localStyles.input_unit}>
                                cm
                            </Text>
                        </View>
                    </View>

                    <View style={localStyles.input_container}>
                        <Text style={localStyles.input_label}>
                            Were you right with your prediction?
                        </Text>
                        <View style={localStyles.toggle_row}>
                            <TouchableOpacity
                                style={[localStyles.toggle_button, current.isUserCorrect === 'yes' && localStyles.toggle_button_active]}
                                onPress={() => updateField('isUserCorrect', 'yes')}>

                                <Text style={[localStyles.toggle_text, current.isUserCorrect === 'yes' && localStyles.toggle_text_active]}>
                                    ✔ Yes
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[localStyles.toggle_button, current.isUserCorrect === 'no' && localStyles.toggle_button_active]}
                                onPress={() => updateField('isUserCorrect', 'no')}>

                                <Text style={[localStyles.toggle_text, current.isUserCorrect === 'no' && localStyles.toggle_text_active]}>
                                    ✖ No
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{height: 32}}/>
            </ScrollView>

            <View style={localStyles.footer}>
                {completeCount === 3 ? (
                    <TouchableOpacity
                        style={localStyles.submit_button}
                        onPress={handleSubmit}
                        activeOpacity={0.85}>

                        <Text style={localStyles.submit_button_text}>
                            Submit Results
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={localStyles.next_button}
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

const localStyles = StyleSheet.create({
    page: {
        backgroundColor: WHITE,
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: LIGHT_BLUE,
    },

    back_button: {
        borderWidth: 1,
        borderColor: WHITE,
        backgroundColor: WHITE,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 16,
        borderRadius: 4,
        zIndex: 1,
    },

    header_title_container: {
        flex: 1,
    },

    header_title: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
        textTransform: 'uppercase',
    },

    header_subtitle: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28,
    },

    header_progress: {
        backgroundColor: WHITE,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },

    header_progress_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    tab_row: {
        flexDirection: 'row',
        backgroundColor: WHITE,
    },

    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },

    tab_active: {
        borderBottomColor: BLUE,
    },

    tab_complete: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        marginBottom: 2,
    },

    tab_label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
    },

    tab_label_active: {
        color: BLUE,
        fontWeight: '700',
    },
    
    attempt_description_container: {
        backgroundColor: LIGHT_BLUE,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    attempt_description: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontStyle: 'italic',
    },

    scroll: {
        flex: 1,
    },

    scroll_content: {
        paddingTop: 0,
        padding: 16,
    },

    section_heading: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 20,
        marginBottom: 10,
    },

    video_preview_container: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000000',
        gap: 8,
    },

    video_preview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },

    video_retake_button: {
        backgroundColor: WHITE,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BLUE,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 8,
    },

    video_retake_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        color: BLUE,
    },

    video_subtext: {
        fontSize: 12,
        marginTop: 2,
    },

    video_button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: WHITE,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: BLUE,
        borderStyle: 'dashed',
        padding: 14,
    },

    video_button_complete: {
        borderStyle: 'solid',
        backgroundColor: LIGHT_BLUE,
    },

    video_icon: {
        fontSize: 20,
    },

    video_text: {
        fontSize: 14,
        fontWeight: '600',
    },

    timer_container: {
        backgroundColor: '#1a2e3d',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        gap: 12,
    },

    timer_display: {
        fontSize: 48,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 2,
        fontVariant: ['tabular-nums'],
    },

    timer_button: {
        flexDirection: 'row',
        gap: 12,
    },

    timer_button_start: {
        backgroundColor: '#4caf7d',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    
    timer_button_stop: {
        backgroundColor: '#e05c5c',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    timer_button_reset: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    timer_button_use: {
        backgroundColor: BLUE,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    timer_button_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: WHITE,
    },

    input_container: {
        marginBottom: 16,
    },

    input_label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        marginBottom: 6,
    },

    input_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    input: {
        flex: 1,
        backgroundColor: WHITE,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
    },

    input_unit: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        width: 30,
    },

    input_multiline: {
        height: 80,
        textAlignVertical: 'top',
    },

    toggle_row: {
        flexDirection: 'row',
        gap: 10,
    },

    toggle_button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        alignItems: 'center',
        backgroundColor: WHITE,
    },

    toggle_button_active: {
        backgroundColor: LIGHT_BLUE,
    },

    toggle_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
    },

    toggle_text_active: {
        fontWeight: '700',
    },

    footer: {
        padding: 16,
        paddingTop: 4,
        backgroundColor: WHITE,
        borderTopWidth: 1,
        borderColor: 'transparent',
    },

    next_button: {
        backgroundColor: BLUE,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },

    next_button_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 0.5,
    },

    submit_button: {
        backgroundColor: '#4caf7d',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },

    submit_button_text: {
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 0.5,
    },

});