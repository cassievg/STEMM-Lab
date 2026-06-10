import { globalColors, globalStyles } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToolsPanel from '../tools/panel';
import { localColors, localStyles } from './startStyles';

type AttemptKey = 'action1' | 'action2' | 'action3';

type AttemptData = {
    prediction: string,
    timeToHit: string,
    isUserCorrect: 'yes' | 'no' | null;
    slowMotionTime: string;
    notes: string;
    videoRecorded: boolean;
    videoUri: string | null;
};

const TABS: {key: AttemptKey; label: string; description: string}[] = [
    {key: 'action1', label: 'Design 1', description: 'No parachute (baseline)'},
    {key: 'action2', label: 'Design 2', description: 'Plastic with corners tied'},
    {key: 'action3', label: 'Design 3', description: 'Your own design'},
];

const DEFAULT_ATTEMPT: AttemptData = {
    prediction: '',
    timeToHit: '',
    isUserCorrect: null,
    slowMotionTime: '',
    notes: '',
    videoRecorded: false,
    videoUri: null,
};

const isAttemptComplete = (attempt: AttemptData) => 
    attempt.prediction.trim() !== '' &&
    attempt.timeToHit.trim() !== '' &&
    attempt.isUserCorrect !== null &&
    attempt.slowMotionTime.trim() !== '' &&
    attempt.videoRecorded;

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

    const [timerActive, setTimerActive] = useState(false);
    const [timerMS, setTimerMS] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = () => {
        setTimerActive(true);
        intervalRef.current = setInterval(() => {
            setTimerMS((prev) => prev + 10);
        }, 10);
    };

    const stopTimer = () => {
        setTimerActive(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetTimer = () => {
        stopTimer();
        setTimerMS(0);
    };

    const updateField = (field : keyof AttemptData, value: any) => {
        setAttempt((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab], [field]: value,
            },
        }));
    };

    const useTimerValue = () => {
        const seconds = (timerMS / 1000).toFixed(2);
        updateField('timeToHit', seconds);
    };

    const formatTime = (ms: number) => {
        const second = Math.floor(ms / 1000);
        const mili = Math.floor((ms % 1000)/10);
        return `${second.toString().padStart(2, '0')}.${mili.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        stopTimer();
        setTimerMS(0);
    }, [activeTab]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleRecordVideo = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted){
            Alert.alert('Permission Required', 'Camera access is needed to record the drop');
            return;
        };

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoMaxDuration: 60,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled){
            updateField('videoUri', result.assets[0].uri);
            updateField('videoRecorded', true);
        }
        
    };

    const handleSubmit = () => {
        Alert.alert('Submitted', 'Your results have been saved');
        router.push('/pages/student/quiz/quiz1');
    };

    const current = attempt[activeTab];

    const completeCount = Object.values(attempt).filter(isAttemptComplete).length;

    const player = useVideoPlayer(current.videoUri ?? null);

    return (
        <SafeAreaView style={[themed.page, localStyles.page]}>
            <View style={[localThemed.header_container, localStyles.header]}>
                <TouchableOpacity 
                style={[themed.back, localStyles.back_button]}
                onPress={() => router.push('/pages/student/activities/1')}>
                    <Text style={themed.text}>{'<'}</Text>
                </TouchableOpacity>
                <View style={localStyles.header_title_container}>
                    <Text style={[themed.text, localStyles.header_title]}>
                        Activity 1 · In Progress
                    </Text>
                    <Text style={[themed.text, localStyles.header_subtitle]}>
                        Parachute Drop Challenge
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
                        📹 Video Recording
                    </Text>
                    
                    {current.videoUri ? (
                        <View style={[themed.black_background, localStyles.video_preview_container]}>
                            <VideoView
                                player={player}
                                style={localStyles.video_preview}
                                nativeControls/>
                            <TouchableOpacity
                                style={[themed.back, localStyles.video_retake_button]}
                                onPress={handleRecordVideo}
                                activeOpacity={0.8}>

                                <Text style={[themed.light_text, localStyles.video_retake_text]}>
                                    🔄 Retake Video
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[themed.back, localStyles.video_button]}
                            onPress={handleRecordVideo}
                            activeOpacity={0.8}>

                            <Text style={localStyles.video_icon}>
                                🎥
                            </Text>
                            <View>
                                <Text style={[themed.text, localStyles.video_text]}>
                                    Record Drop Video
                                </Text>
                                <Text style={[themed.text, localStyles.video_subtext]}>
                                    Tap to open camera
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <Text style={[themed.text, localStyles.section_heading]}>
                        ⏱ Drop Timer
                    </Text>
                    <View style={[localThemed.timer_container, localStyles.timer_container]}>
                        <Text style={localStyles.timer_display}>
                            {formatTime(timerMS)}s
                        </Text>
                        <View style={localStyles.timer_button}>
                            {!timerActive ? (
                                <TouchableOpacity 
                                    style={[localThemed.start_button, localStyles.timer_button_start]}
                                    onPress={startTimer}>

                                        <Text style={[themed.text, localStyles.timer_button_text]}>
                                            ▶ Start
                                        </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[localThemed.stop_button, localStyles.timer_button_stop]}
                                    onPress={stopTimer}>

                                        <Text style={[themed.text, localStyles.timer_button_text]}>
                                            ⏹ Stop
                                        </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[localThemed.reset_button, localStyles.timer_button_reset]}
                                onPress={resetTimer}>

                                    <Text style={[themed.text, localStyles.timer_button_text]}>
                                        ↺ Reset
                                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[themed.pressable_default, localStyles.timer_button_use]}
                                onPress={useTimerValue}>

                                <Text style={[themed.text, localStyles.timer_button_text]}>
                                    Use Value
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={[themed.text, localStyles.section_heading]}>
                        📊 Record Results
                    </Text>

                    <View style={localStyles.input_container}>
                        <Text style={[themed.text, localStyles.input_label]}>
                            How long will it take to hit the ground? (Prediction)
                        </Text>
                        <View style={localStyles.input_row}>
                            <TextInput 
                                style={[themed.white_background, localStyles.input]}
                                placeholder='e.g. 0.80'
                                placeholderTextColor='#969696'
                                keyboardType='decimal-pad'
                                value={current.prediction}
                                onChangeText={(val) => updateField('prediction', val)}>
                            </TextInput>
                            <Text style={[themed.text, [themed.text, localStyles.input_unit]]}>
                                s
                            </Text>
                        </View>
                    </View>

                    <View style={localStyles.input_container}>
                        <Text style={[themed.text, localStyles.input_label]}>
                            Time to first hit the ground (Actual)
                        </Text>
                        <View style={localStyles.input_row}>
                            <TextInput 
                                style={[themed.white_background, localStyles.input]}
                                placeholder='e.g. 0.60'
                                placeholderTextColor='#969696'
                                keyboardType='decimal-pad'
                                value={current.timeToHit}
                                onChangeText={(val) => updateField('timeToHit', val)}>
                            </TextInput>
                            <Text style={[themed.text, localStyles.input_unit]}>
                                s
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

                    <View style={localStyles.input_container}>
                        <Text style={[themed.text, localStyles.input_label]}>
                            Time to first hit to stop moving (Slow-motion)
                        </Text>
                        <View style={localStyles.input_row}>
                            <TextInput 
                                style={[themed.white_background, localStyles.input]}
                                placeholder='e.g. 0.15'
                                placeholderTextColor='#969696'
                                keyboardType='decimal-pad'
                                value={current.slowMotionTime}
                                onChangeText={(val) => updateField('slowMotionTime', val)}>
                            </TextInput>
                            <Text style={[themed.text, localStyles.input_unit]}>
                                s
                            </Text>
                        </View>
                    </View>

                    <View style={localStyles.input_container}>
                        <Text style={[themed.text, localStyles.input_label]}>
                            Notes / Observation
                        </Text>
                        <TextInput 
                            style={[themed.white_background, localStyles.input, localStyles.input_multiline]}
                            placeholder='What did you observe?'
                            placeholderTextColor='#969696'
                            multiline
                            numberOfLines={3}
                            value={current.notes}
                            onChangeText={(val) => updateField('notes', val)}>
                        </TextInput>
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