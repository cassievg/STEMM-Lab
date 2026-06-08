import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BLUE, DARK, FONT_FAMILY, WHITE } from '../activities/activityStyles';

const GRAPH_HEIGHT = 100;
const MAX_HISTORY = 60;
const SAMPLE_INTERVAL = 300;

const getCategory = (db: number): {label: string; color: string} => {
    if (db < 40){
        return {label: '🤫 Quiet', color: '#4caf7d'}
    };
    if (db < 60){
        return {label: '🗣 Moderate', color: '#f0b429'}
    };
    if (db < 80){
        return {label: '🔊 Loud', color: '#e05c5c'}
    };
    return {label: '📢 Very Loud', color: '#b91c1c'};
};

const meterToDb = (metering: number): number => {
    const clamped = Math.max(-60, Math.min(0, metering));
    return Math.round(((clamped + 60) / 60) * 70 + 30);
};

function GraphBar({value, max}: {value: number; max: number}){
    const height = Math.max(2, (value / max) * GRAPH_HEIGHT);
    const { color } = getCategory(value);
    return (
        <View style={localStyles.bar_wrap}>
            <View
                style={{width: 6,height,backgroundColor: color, borderRadius: 2}}>

            </View>
        </View>
    );
}

export default function SoundMeter() {
    const [active, setActive] = useState(false);
    const [db, setDb] = useState(0);
    const [peak, setPeak] = useState(0);
    const [history, setHistory] = useState<number[]>([]);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startMeasuring = async () => {
        try {
            const {granted} = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Microphone access is needed to record the audio');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync({
                ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
                isMeteringEnabled: true,
            });

            await recording.startAsync();
            recordingRef.current = recording;
            setActive(true);

            intervalRef.current = setInterval(async () => {
                try {
                    const status = await recording.getStatusAsync();
                    if (status.isRecording && status.metering !== undefined){
                        const currentDb = meterToDb(status.metering);
                        setDb(currentDb);
                        setPeak((prev) => Math.max(prev, currentDb));
                        setHistory((prev) => {
                            const next = [...prev, currentDb];
                            return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
                        });
                    }
                } catch (e) {
                    console.error('Polling error:', e);
                }
                
            }, SAMPLE_INTERVAL);
        } catch (e) {
            console.error('Sound meter error: ', e)
        }
    };

    const stopMeasuring = async () => {
        try {
            if (intervalRef.current){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            };
            if (recordingRef.current){
                await recordingRef.current.stopAndUnloadAsync();
                recordingRef.current = null;
            }
        } catch (e){

        }
        setActive(false);
        setDb(0);
    };

    useEffect(() => {
        return () => {
            stopMeasuring();
        };
    }, []);

    const handleReset = () => {
        setPeak(0);
        setHistory([]);
    };

    const category = getCategory(db);
    const maxDb = 100;

    const gaugePct = Math.min(db / maxDb, 1);

    return (
        <View style={localStyles.container}>
            <View style={localStyles.control_row}>
                <TouchableOpacity
                    style={[localStyles.button, active && localStyles.button_stop]}
                    onPress={active ? stopMeasuring : startMeasuring}
                    activeOpacity={0.8}>

                    <Text style={localStyles.button_text}>
                        {active ? '⏹ Stop' : '▶ Start'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={localStyles.button_reset}
                    onPress={handleReset}
                    activeOpacity={0.8}>

                    <Text style={localStyles.button_reset_text}>
                        ↺ Reset
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={localStyles.meter_box}>
                <View style={localStyles.gauge_background}>
                    <View
                        style={[localStyles.gauge_fill,
                                {
                                    width: `${gaugePct * 100}%` as any,
                                    backgroundColor: category.color,
                                },
                            ]}
                    />
                    <View style={localStyles.gauge_marker} />
                </View>

                <View style={localStyles.gauge_labels}>
                    <Text style={localStyles.gauge_label_text}>
                        30
                    </Text>
                    <Text style={localStyles.gauge_label_text}>
                        55
                    </Text>
                    <Text style={localStyles.gauge_label_text}>
                        80
                    </Text>
                    <Text style={localStyles.gauge_label_text}>
                        100 dB
                    </Text>
                </View>

                <View style={localStyles.db_row}>
                    <Text style={[
                        localStyles.db_value,
                        {color: category.color}
                    ]}>
                        {active ? db : '-'}
                    </Text>
                    <Text style={localStyles.db_unit}>
                        dB
                    </Text>
                </View>

                <Text style={[localStyles.category_label, {color: category.color}]}>
                    {active ? category.label: 'Tap Start to measure'}
                </Text>

                {peak > 0 && (
                    <View style={localStyles.peak_row}>
                        <Text style={localStyles.peak_label}>
                            Peak:
                        </Text>
                        <Text style={[localStyles.peak_value, {color: getCategory(peak).color}]}>
                            {peak} dB
                        </Text>
                    </View>
                )}
            </View>

            <View style={localStyles.graph_wrap}>
                <View style={localStyles.graph_header}>
                    <Text style={localStyles.graph_title}>
                        History
                    </Text>
                    <Text style={localStyles.graph_subtitle}>
                        {history.length}/{MAX_HISTORY} samples
                    </Text>
                </View>

                {history.length === 0 ? (
                    <View style={localStyles.graph_empty}>
                        <Text style={localStyles.graph_empty_text}>
                            No data yet — Start measuring to see history
                        </Text>
                    </View>
                ) : (
                    <View style={localStyles.graph_container}>
                        <View style={localStyles.y_axis}>
                            <Text style={localStyles.y_label}>
                                100
                            </Text>
                            <Text style={localStyles.y_label}>
                                65
                            </Text>
                            <Text style={localStyles.y_label}>
                                30
                            </Text>
                        </View>

                        <ScrollView
                            style={localStyles.graph_scroll}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={localStyles.graph_bars}>

                            {history.map((val, i) => (
                                <GraphBar key={i} value={val} max={maxDb}/>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={localStyles.legend_row}>
                    {[
                        {label: 'Quiet', color: '#4caf7d'},
                        {label: 'Moderate', color: '#f0b429'},
                        {label: 'Loud', color: '#e05c5c'},
                    ].map((item) => (
                        <View key={item.label} style={localStyles.legend_item}>
                            <View style={[localStyles.legend_dot, {backgroundColor: item.color}]}/>
                            <Text style={localStyles.legend_text}>
                                {item.label}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={localStyles.info_box}>
                <Text style={localStyles.info_text}>
                    Activity 2
                </Text>
            </View>
        </View>
    )
}

const localStyles =  StyleSheet.create({
    bar_wrap: {
        width: 6,
        height: GRAPH_HEIGHT,
        justifyContent: 'flex-end',
    },

    bar: {
        width: 6,
        borderRadius: 6,
    },

    container: {
        gap: 12,
    },

    control_row: {
        flexDirection: 'row',
        gap: 8,
    },

    button: {
        flex: 1,
        backgroundColor: BLUE,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },

    button_stop: {
        backgroundColor: '#e05c5c',
    },

    button_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: WHITE,
    },

    button_reset: {
        backgroundColor: '#f0f4f8',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
    },

    button_reset_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: DARK,
    },

    meter_box: {
        backgroundColor: DARK,
        borderRadius: 14,
        padding: 16,
        gap: 10,
    },

    gauge_background: {
        height: 14,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 7,
        overflow: 'hidden',
        position: 'relative',
    },

    gauge_fill: {
        height: '100%',
        borderRadius: 7,
    },

    gauge_marker: {
        position: 'absolute',
        left: '71%',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },

    gauge_labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    gauge_label_text: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: 'rgba(255,255,255,0.5)',
    },

    db_row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 6,
    },

    db_value: {
        fontSize: 56,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        lineHeight: 60,
    },

    db_unit: {
        fontSize: 20,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
        paddingBottom: 8,
    },

    category_label: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        textAlign: 'center',
    },

    peak_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },

    peak_label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
    },

    peak_value: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
    },

    graph_wrap: {
        backgroundColor: WHITE,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dde8f0',
        padding: 12,
        gap: 8,
    },

    graph_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    graph_title: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: DARK,
    },

    graph_subtitle: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: '#888888',
    },

    graph_empty: {
        height: GRAPH_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f8fc',
        borderRadius: 8,
    },

    graph_empty_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: '#aaaaaa',
        textAlign: 'center',
    },

    graph_container: {
        flexDirection: 'row',
        height: GRAPH_HEIGHT,
        gap: 4,
    },

    y_axis: {
        width: 28,
        height: GRAPH_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingRight: 4,
    },

    y_label: {
        fontSize: 10,
        fontFamily: FONT_FAMILY,
        color: '#aaaaaa',
    },

    graph_scroll: {
        flex: 1,
    },

    graph_bars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: GRAPH_HEIGHT,
        paddingHorizontal: 4,
    },

    legend_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
    },

    legend_item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    legend_dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    legend_text: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: '#666666',
    },

    info_box: {
        backgroundColor: '#eaf4fd',
        borderRadius: 10,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: BLUE,
    },

    info_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: DARK,
        lineHeight: 18,
    },


})