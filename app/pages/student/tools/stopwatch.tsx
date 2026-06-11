import { FONT_FAMILY } from "@/app/styles";
import React, { useEffect, useRef, useState } from "react";

import { useTheme } from "@/src/context/ThemeContext";
import { ThemeKey } from "@/src/context/ThemeContext.d";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { activityColors } from "../activities/activityStyles";

const BLUE = '#97b9d6';
const DARK = '#1a2e3d';
const WHITE = '#ffffff';
const GREEN = '#4caf7d';
const RED = '#e05c5c';

const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
};

const formatLapDiff = (ms: number): string => {
    const sign = ms >= 0 ? '+' : '-';
    const abs = Math.abs(ms);
    const seconds = Math.floor(abs / 1000);
    const centis = Math.floor((abs % 1000) / 10);
    return `${sign}${seconds}.${String(centis).padStart(2, '0')}s`;
};

export default function Stopwatch(){
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [laps, setLaps] = useState<number[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);
    const accumulatedRef = useRef<number>(0);

    const { theme } = useTheme();
    const themed = activityColors[theme as ThemeKey];

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            };
        };
    }, []);

    const start = () => {
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current));
        }, 10);
        setRunning(true);
    };

    const stop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        accumulatedRef.current += Date.now() - startTimeRef.current;
        setRunning(false);
    };

    const reset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        accumulatedRef.current = 0;
        setElapsed(0);
        setLaps([]);
        setRunning(false);
    };

    const lap = () => {
        if (!running) return;
        setLaps((prev) => [...prev, elapsed]);
    };

    const lapSegments = laps.map((lapTime, i) => {
        const prev = i === 0 ? 0 : laps[i - 1];
        return lapTime - prev;
    });

    const bestLap = lapSegments.length > 0 ? Math.min(...lapSegments) : null;
    const worstLap = lapSegments.length > 0 ? Math.max(...lapSegments) : null;
    const avgLap = lapSegments.length > 0
        ? lapSegments.reduce((a, b) => a + b, 0) / lapSegments.length
        : null;

    const getLapColor = (segmentMs: number): string => {
        if (lapSegments.length < 2) return BLUE;
        if (segmentMs === bestLap) return GREEN;
        if (segmentMs === worstLap) return RED;
        return BLUE;
    };

    return (
        <View style={localStyles.container}>
            <View style={localStyles.display_box}>
                <Text style={localStyles.display_time}>{formatTime(elapsed)}</Text>
                {laps.length > 0 && (
                    <Text style={localStyles.display_lap_hint}>
                        Lap {laps.length + (running ? 1 : 0)} — current{' '}
                        {formatTime(elapsed - (laps[laps.length - 1] ?? 0))}
                    </Text>
                )}
            </View>

            <View style={localStyles.control_row}>
                <TouchableOpacity
                    style={[localStyles.button_secondary, !running && elapsed > 0 && localStyles.button_reset]}
                    onPress={running ? lap : reset}
                    activeOpacity={0.8}
                    disabled={!running && elapsed === 0}>
                    <Text style={localStyles.button_secondary_text}>
                        {running ? '⏱ Lap' : elapsed > 0 ? '↺ Reset' : '⏱ Lap'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[localStyles.button_primary, running ? localStyles.button_stop : localStyles.button_start]}
                    onPress={running ? stop : start}
                    activeOpacity={0.8}>
                    <Text style={localStyles.button_primary_text}>
                        {running ? '⏹ Stop' : elapsed > 0 ? '▶ Resume' : '▶ Start'}
                    </Text>
                </TouchableOpacity>
            </View>

            {lapSegments.length > 1 && (
                <View style={localStyles.stats_row}>
                    <View style={[themed.stat_chip, localStyles.stat_chip]}>
                        <Text style={localStyles.stat_label}>Best</Text>
                        <Text style={[localStyles.stat_value, { color: GREEN }]}>
                            {formatTime(bestLap!)}
                        </Text>
                    </View>
                    <View style={[themed.stat_chip, localStyles.stat_chip]}>
                        <Text style={localStyles.stat_label}>Avg</Text>
                        <Text style={[localStyles.stat_value, themed.progress_text]}>
                            {formatTime(Math.round(avgLap!))}
                        </Text>
                    </View>
                    <View style={[themed.stat_chip, localStyles.stat_chip]}>
                        <Text style={localStyles.stat_label}>Worst</Text>
                        <Text style={[localStyles.stat_value, { color: RED }]}>
                            {formatTime(worstLap!)}
                        </Text>
                    </View>
                </View>
            )}

            {laps.length > 0 && (
                <View style={[themed.laps_wrap, localStyles.laps_wrap]}>
                    <Text style={localStyles.laps_heading}>
                        Laps
                    </Text>
                    <ScrollView
                        style={localStyles.laps_scroll}
                        showsVerticalScrollIndicator={false}>
                        {[...laps].reverse().map((lapTime, reversedIndex) => {
                            const i = laps.length - 1 - reversedIndex;
                            const segment = lapSegments[i];
                            const color = getLapColor(segment);
                            const diff = avgLap !== null ? segment - avgLap : 0;
 
                            return (
                                <View key={i} style={[themed.lap_row, localStyles.lap_row]}>
                                    <View style={[localStyles.lap_number_wrap, { borderColor: color }]}>
                                        <Text style={[localStyles.lap_number, { color }]}>
                                            {i + 1}
                                        </Text>
                                    </View>
                                    <View style={localStyles.lap_times}>
                                        <Text style={localStyles.lap_segment}>
                                            {formatTime(segment)}
                                        </Text>
                                        {lapSegments.length > 1 && (
                                            <Text style={[
                                                localStyles.lap_diff,
                                                { color: diff <= 0 ? GREEN : RED }
                                            ]}>
                                                {formatLapDiff(diff)}
                                            </Text>
                                        )}
                                    </View>
                                    <Text style={localStyles.lap_total}>
                                        {formatTime(lapTime)}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
            gap: 10,
    },

    display_box: {
        backgroundColor: DARK,
        borderRadius: 14,
        padding: 20,
        alignItems: 'center',
        gap: 6,
    },

    display_time: {
        fontSize: 48,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 2,
        fontVariant: ['tabular-nums'],
    },

    display_lap_hint: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
    },

    control_row: {
        flexDirection: 'row',
        gap: 10,
    },

    button_primary: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },

    button_start: {
        backgroundColor: GREEN,
    },

    button_stop: {
        backgroundColor: RED,
    },

    button_primary_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
    },

    button_secondary: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#e8f0f7',
    },

    button_reset: {
        backgroundColor: '#fef3cd',
    },

    button_secondary_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: DARK,
    },

    stats_row: {
        flexDirection: 'row',
        gap: 8,
    },

    stat_chip: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dde8f0',
        paddingVertical: 8,
        alignItems: 'center',
        gap: 2,
    },

    stat_label: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: '#888',
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    stat_value: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
    },

    laps_wrap: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dde8f0',
        padding: 12,
        gap: 8,
    },

    laps_heading: {
        fontSize: 12,
        fontWeight: '700',
        color: DARK,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    laps_scroll: {

    },

    lap_row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        gap: 10,
    },

    lap_number_wrap: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    lap_number: {
        fontSize: 12,
        fontWeight: '800',
    },
    
    lap_times: {
        flex: 1,
        gap: 2,
    },

    lap_segment: {
        fontSize: 14,
        fontWeight: '700',
        color: DARK,
        fontVariant: ['tabular-nums'],
    },

    lap_diff: {
        fontSize: 11,
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },

    lap_total: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
        fontVariant: ['tabular-nums'],
    },
})